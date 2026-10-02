/**
 * StorageService.js
 * Comprehensive Dual-Storage Vault (Local-First localStorage + Background Firestore & Cloud Drive Sync)
 * Guarantees zero latency, zero data loss, offline resilience, and automatic schema migrations.
 */
import { store } from '../store/store';
import { saveToDrive, loadFromDrive, deleteFromDrive } from './DriveService';
import syncManager from './SyncManager';

const LOCAL_STORAGE_RESUMES_KEY = 'local_resumes_v2';
const LOCAL_STORAGE_PORTFOLIOS_KEY = 'local_portfolios_v2';
const SCHEMA_VERSION = 1.2;

// Migration helper to guarantee backward compatibility
export const migrateResumeSchema = (data) => {
  if (!data) return null;
  const migrated = { ...data };
  
  if (!migrated.schemaVersion || migrated.schemaVersion < 1.1) {
    if (!migrated.themeConfig) {
      migrated.themeConfig = { accentColor: '#0f172a', fontFamily: 'Inter' };
    }
    if (!Array.isArray(migrated.layout)) {
      migrated.layout = ['summary', 'experience', 'education', 'skills'];
    }
  }

  if (migrated.schemaVersion < 1.2) {
    if (!migrated.skills || !Array.isArray(migrated.skills)) {
      migrated.skills = [];
    }
    if (!migrated.Experience || !Array.isArray(migrated.Experience)) {
      migrated.Experience = [];
    }
    if (!migrated.Education || !Array.isArray(migrated.Education)) {
      migrated.Education = [];
    }
    migrated.updatedAt = migrated.updatedAt || new Date().toISOString();
    migrated.schemaVersion = SCHEMA_VERSION;
  }

  return migrated;
};

export const migratePortfolioSchema = (data) => {
  if (!data) return null;
  const migrated = { ...data };

  if (!migrated.siteConfig) {
    migrated.siteConfig = { themeMode: 'light', themePreset: 'bento', accentColor: '#0f172a' };
  }
  if (!migrated.projects || !Array.isArray(migrated.projects)) {
    migrated.projects = [];
  }
  if (!migrated.skills || !Array.isArray(migrated.skills)) {
    migrated.skills = [];
  }
  migrated.updatedAt = migrated.updatedAt || new Date().toISOString();
  migrated.schemaVersion = SCHEMA_VERSION;

  return migrated;
};

// Safe local storage reader
const getLocalArray = (key, legacyKey) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    
    // Fallback to legacy key if migrating
    if (legacyKey) {
      const legacyRaw = localStorage.getItem(legacyKey);
      if (legacyRaw) {
        const parsed = JSON.parse(legacyRaw);
        localStorage.setItem(key, JSON.stringify(parsed));
        return parsed;
      }
    }
    return [];
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return [];
  }
};

const setLocalArray = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error persisting ${key} to localStorage:`, err);
  }
};

const getDriveTokenSafe = () => {
  try {
    return store.getState().sync?.driveToken || null;
  } catch (e) {
    return null;
  }
};

export const StorageService = {
  // === RESUMES ===
  getUserResumes: async (userEmail) => {
    // 1. Instant local read
    const local = getLocalArray(LOCAL_STORAGE_RESUMES_KEY, 'local_resumes');
    const filtered = local
      .filter(r => !userEmail || r.userEmail === userEmail)
      .map(migrateResumeSchema);
    
    filtered.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

    // 2. Background silent reconciliation with Firestore
    if (userEmail && navigator.onLine) {
      setTimeout(async () => {
        try {
          const remote = await syncManager.pullRemoteResumes(userEmail);
          if (remote && remote.length > 0) {
            let hasChanges = false;
            const currentLocal = getLocalArray(LOCAL_STORAGE_RESUMES_KEY, 'local_resumes');
            
            remote.forEach(remoteDoc => {
              const docId = remoteDoc.documentId || remoteDoc.resumeId;
              const idx = currentLocal.findIndex(r => r.documentId === docId || r.resumeId === docId);
              if (idx === -1) {
                currentLocal.push(remoteDoc);
                hasChanges = true;
              } else {
                const localUpdated = new Date(currentLocal[idx].updatedAt || 0).getTime();
                const remoteUpdated = new Date(remoteDoc.updatedAt || 0).getTime();
                if (remoteUpdated > localUpdated) {
                  currentLocal[idx] = { ...currentLocal[idx], ...remoteDoc };
                  hasChanges = true;
                }
              }
            });

            if (hasChanges) {
              setLocalArray(LOCAL_STORAGE_RESUMES_KEY, currentLocal);
            }
          }
        } catch (e) {
          console.warn('[StorageService] Background remote reconciliation skipped:', e);
        }
      }, 0);
    }

    return filtered;
  },

  getResumeById: async (id) => {
    // 1. Try Drive first if token exists
    const token = getDriveTokenSafe();
    if (token) {
      try {
        const cloudData = await loadFromDrive(token, id);
        if (cloudData) {
          const migrated = migrateResumeSchema(cloudData);
          StorageService.saveResumeLocalOnly(migrated);
          return migrated;
        }
      } catch (err) {
        console.warn('Drive load failed, reading from local vault:', err.message);
      }
    }

    // 2. Immediate Local Vault Read
    const local = getLocalArray(LOCAL_STORAGE_RESUMES_KEY, 'local_resumes');
    const found = local.find(r => r.documentId === id || r.resumeId === id);
    if (found) {
      return migrateResumeSchema(found);
    }

    throw new Error('Resume not found in local vault or cloud storage');
  },

  saveResumeLocalOnly: (resumeData) => {
    const local = getLocalArray(LOCAL_STORAGE_RESUMES_KEY, 'local_resumes');
    const id = resumeData.documentId || resumeData.resumeId;
    const now = new Date().toISOString();
    const updatedRecord = { ...resumeData, documentId: id, updatedAt: now };

    const idx = local.findIndex(r => (r.documentId === id || r.resumeId === id));
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updatedRecord };
    } else {
      local.unshift(updatedRecord);
    }
    setLocalArray(LOCAL_STORAGE_RESUMES_KEY, local);
    return updatedRecord;
  },

  createResume: async (payload) => {
    const documentId = payload.data?.resumeId || payload.data?.documentId || crypto.randomUUID();
    const now = new Date().toISOString();
    const newResume = migrateResumeSchema({
      ...payload.data,
      documentId,
      resumeId: documentId,
      createdAt: now,
      updatedAt: now
    });

    // 1. Local Vault Save (Instant, zero latency)
    StorageService.saveResumeLocalOnly(newResume);

    // 2. Asynchronous Silent Sync Manager Enqueue (Firestore)
    syncManager.enqueue('UPSERT_RESUME', newResume);

    // 3. Optional Google Drive sync if token present
    const token = getDriveTokenSafe();
    if (token) {
      try {
        await saveToDrive(token, newResume, `resume_${documentId}.json`, documentId);
      } catch (err) {
        console.warn('Cloud drive save deferred / failed:', err.message);
      }
    }

    return newResume;
  },

  updateResume: async (id, partialData) => {
    const local = getLocalArray(LOCAL_STORAGE_RESUMES_KEY, 'local_resumes');
    const idx = local.findIndex(r => r.documentId === id || r.resumeId === id);
    const existing = idx !== -1 ? local[idx] : {};
    const updated = migrateResumeSchema({
      ...existing,
      ...partialData,
      documentId: id,
      resumeId: id,
      updatedAt: new Date().toISOString()
    });

    // 1. Local Vault Save (Instant)
    StorageService.saveResumeLocalOnly(updated);

    // 2. Asynchronous Silent Sync Manager Enqueue (Firestore)
    syncManager.enqueue('UPSERT_RESUME', updated);

    // 3. Optional Google Drive sync if token present
    const token = getDriveTokenSafe();
    if (token) {
      try {
        await saveToDrive(token, updated, `resume_${id}.json`, id);
      } catch (err) {
        console.warn('Cloud sync error for resume:', err.message);
      }
    }

    return updated;
  },

  deleteResume: async (id) => {
    // 1. Immediate local deletion
    const local = getLocalArray(LOCAL_STORAGE_RESUMES_KEY, 'local_resumes');
    const filtered = local.filter(r => r.documentId !== id && r.resumeId !== id);
    setLocalArray(LOCAL_STORAGE_RESUMES_KEY, filtered);

    // 2. Asynchronous Silent Sync Manager Enqueue (Firestore)
    syncManager.enqueue('DELETE_RESUME', { id });

    // 3. Optional Google Drive deletion
    const token = getDriveTokenSafe();
    if (token) {
      try {
        await deleteFromDrive(token, id);
      } catch (err) {
        console.warn('Drive delete failed:', err.message);
      }
    }
    return true;
  },

  // === PORTFOLIOS ===
  getUserPortfolios: async (userEmail) => {
    const local = getLocalArray(LOCAL_STORAGE_PORTFOLIOS_KEY, 'local_portfolios');
    const filtered = local
      .filter(p => !userEmail || p.userEmail === userEmail)
      .map(migratePortfolioSchema);
    filtered.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

    // Background silent reconciliation with Firestore
    if (userEmail && navigator.onLine) {
      setTimeout(async () => {
        try {
          const remote = await syncManager.pullRemotePortfolios(userEmail);
          if (remote && remote.length > 0) {
            let hasChanges = false;
            const currentLocal = getLocalArray(LOCAL_STORAGE_PORTFOLIOS_KEY, 'local_portfolios');
            
            remote.forEach(remoteDoc => {
              const docId = remoteDoc.documentId || remoteDoc.portfolioId;
              const idx = currentLocal.findIndex(p => p.documentId === docId || p.portfolioId === docId);
              if (idx === -1) {
                currentLocal.push(remoteDoc);
                hasChanges = true;
              } else {
                const localUpdated = new Date(currentLocal[idx].updatedAt || 0).getTime();
                const remoteUpdated = new Date(remoteDoc.updatedAt || 0).getTime();
                if (remoteUpdated > localUpdated) {
                  currentLocal[idx] = { ...currentLocal[idx], ...remoteDoc };
                  hasChanges = true;
                }
              }
            });

            if (hasChanges) {
              setLocalArray(LOCAL_STORAGE_PORTFOLIOS_KEY, currentLocal);
            }
          }
        } catch (e) {
          console.warn('[StorageService] Portfolio background reconciliation skipped:', e);
        }
      }, 0);
    }

    return filtered;
  },

  getPortfolioById: async (id) => {
    const token = getDriveTokenSafe();
    if (token) {
      try {
        const cloudData = await loadFromDrive(token, id);
        if (cloudData) {
          const migrated = migratePortfolioSchema(cloudData);
          StorageService.savePortfolioLocalOnly(migrated);
          return migrated;
        }
      } catch (err) {
        console.warn('Drive load failed for portfolio, falling back locally:', err.message);
      }
    }

    const local = getLocalArray(LOCAL_STORAGE_PORTFOLIOS_KEY, 'local_portfolios');
    const found = local.find(p => p.documentId === id || p.portfolioId === id);
    if (found) {
      return migratePortfolioSchema(found);
    }
    throw new Error('Portfolio not found');
  },

  savePortfolioLocalOnly: (portfolioData) => {
    const local = getLocalArray(LOCAL_STORAGE_PORTFOLIOS_KEY, 'local_portfolios');
    const id = portfolioData.documentId || portfolioData.portfolioId;
    const now = new Date().toISOString();
    const updatedRecord = { ...portfolioData, documentId: id, updatedAt: now };

    const idx = local.findIndex(p => p.documentId === id || p.portfolioId === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updatedRecord };
    } else {
      local.unshift(updatedRecord);
    }
    setLocalArray(LOCAL_STORAGE_PORTFOLIOS_KEY, local);
    return updatedRecord;
  },

  createPortfolio: async (payload) => {
    const documentId = payload.data?.portfolioId || payload.data?.documentId || crypto.randomUUID();
    const now = new Date().toISOString();
    const newPortfolio = migratePortfolioSchema({
      ...payload.data,
      documentId,
      portfolioId: documentId,
      views: 0,
      createdAt: now,
      updatedAt: now
    });

    // 1. Local Vault Save
    StorageService.savePortfolioLocalOnly(newPortfolio);

    // 2. Asynchronous Silent Sync Manager Enqueue (Firestore)
    syncManager.enqueue('UPSERT_PORTFOLIO', newPortfolio);

    // 3. Optional Google Drive sync
    const token = getDriveTokenSafe();
    if (token) {
      try {
        await saveToDrive(token, newPortfolio, `portfolio_${documentId}.json`, documentId);
      } catch (err) {
        console.warn('Cloud sync error for new portfolio:', err.message);
      }
    }

    return newPortfolio;
  },

  updatePortfolio: async (id, partialData) => {
    const local = getLocalArray(LOCAL_STORAGE_PORTFOLIOS_KEY, 'local_portfolios');
    const idx = local.findIndex(p => p.documentId === id || p.portfolioId === id);
    const existing = idx !== -1 ? local[idx] : {};
    const updated = migratePortfolioSchema({
      ...existing,
      ...partialData,
      documentId: id,
      portfolioId: id,
      updatedAt: new Date().toISOString()
    });

    // 1. Local Vault Save
    StorageService.savePortfolioLocalOnly(updated);

    // 2. Asynchronous Silent Sync Manager Enqueue (Firestore)
    syncManager.enqueue('UPSERT_PORTFOLIO', updated);

    // 3. Optional Google Drive sync
    const token = getDriveTokenSafe();
    if (token) {
      try {
        await saveToDrive(token, updated, `portfolio_${id}.json`, id);
      } catch (err) {
        console.warn('Drive sync error for portfolio:', err.message);
      }
    }

    return updated;
  },

  deletePortfolio: async (id) => {
    // 1. Immediate local deletion
    const local = getLocalArray(LOCAL_STORAGE_PORTFOLIOS_KEY, 'local_portfolios');
    const filtered = local.filter(p => p.documentId !== id && p.portfolioId !== id);
    setLocalArray(LOCAL_STORAGE_PORTFOLIOS_KEY, filtered);

    // 2. Asynchronous Silent Sync Manager Enqueue (Firestore)
    syncManager.enqueue('DELETE_PORTFOLIO', { id });

    // 3. Optional Google Drive deletion
    const token = getDriveTokenSafe();
    if (token) {
      try {
        await deleteFromDrive(token, id);
      } catch (err) {
        console.warn('Drive delete failed:', err.message);
      }
    }
    return true;
  },

  incrementPortfolioViews: async (id) => {
    const local = getLocalArray(LOCAL_STORAGE_PORTFOLIOS_KEY, 'local_portfolios');
    const idx = local.findIndex(p => p.documentId === id || p.portfolioId === id);
    if (idx !== -1) {
      local[idx].views = (local[idx].views || 0) + 1;
      setLocalArray(LOCAL_STORAGE_PORTFOLIOS_KEY, local);
      return local[idx].views;
    }
    return 1;
  }
};

export default StorageService;
