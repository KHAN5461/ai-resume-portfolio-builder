/**
 * SyncManager.js
 * Local State Synchronization Manager for Dual-Storage Reliability
 * 
 * Flow:
 * 1. Synchronous localStorage commits (Instant, zero latency, offline-first).
 * 2. Background Asynchronous synchronization to Firebase Firestore.
 * 3. Persistent offline queue with exponential backoff retry.
 * 4. Silent queue processing without blocking user actions.
 */

import { db, auth } from '../lib/firebaseConfig';
import { doc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { store } from '../store/store';
import { setSyncStatus, setPendingQueueLength, setLastSavedAt } from '../store/syncSlice';

const QUEUE_STORAGE_KEY = 'sparkfolio_sync_queue_v1';
const MAX_RETRIES = 5;
const BASE_RETRY_DELAY = 1000; // 1s

// Structured error handling matching Firestore guidelines
export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

export const handleFirestoreError = (error, operationType, path) => {
  const errMsg = error instanceof Error ? error.message : String(error);
  if (error?.code === 'unavailable' || errMsg.includes('offline') || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return {
      error: errMsg,
      isOffline: true,
      operationType,
      path
    };
  }
  const errInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.warn(`[SyncManager Firestore Warning] [${operationType}] ${path}:`, errInfo.error);
  return errInfo;
};

class SynchronizationManager {
  constructor() {
    this.queue = this.loadPersistedQueue();
    this.isProcessing = false;
    this.timer = null;
    this.initListeners();
  }

  loadPersistedQueue() {
    try {
      const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error('Failed to load persisted sync queue:', e);
    }
    return [];
  }

  savePersistedQueue() {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
      // Update Redux state
      store.dispatch(setPendingQueueLength(this.queue.length));
    } catch (e) {
      console.error('Failed to persist sync queue:', e);
    }
  }

  initListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('[SyncManager] Network online detected. Triggering queue drain.');
        this.processQueue();
      });

      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.queue.length > 0) {
          this.processQueue();
        }
      });
    }
  }

  /**
   * Enqueue a sync operation after local storage write
   * @param {string} type - 'UPSERT_RESUME' | 'DELETE_RESUME' | 'UPSERT_PORTFOLIO' | 'DELETE_PORTFOLIO'
   * @param {object} payload - item data or { id }
   */
  enqueue(type, payload) {
    const id = payload.documentId || payload.resumeId || payload.portfolioId || payload.id;
    if (!id) return;

    // Deduplicate in queue: replace existing pending operation for this ID
    const existingIndex = this.queue.findIndex(item => item.id === id && item.type.startsWith(type.split('_')[0]));
    const queueItem = {
      queueId: `${type}_${id}_${Date.now()}`,
      type,
      id,
      payload,
      retryCount: 0,
      timestamp: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      this.queue[existingIndex] = queueItem;
    } else {
      this.queue.push(queueItem);
    }

    this.savePersistedQueue();

    // Trigger background process immediately
    this.triggerSync();
  }

  triggerSync() {
    if (this.timer) clearTimeout(this.timer);
    
    // Slight debounce to coalesce quick rapid keystrokes (300ms)
    this.timer = setTimeout(() => {
      this.processQueue();
    }, 300);
  }

  async processQueue() {
    if (this.isProcessing) return;
    if (this.queue.length === 0) {
      store.dispatch(setSyncStatus('saved'));
      return;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      store.dispatch(setSyncStatus('offline-queued'));
      return;
    }

    this.isProcessing = true;
    store.dispatch(setSyncStatus('saving'));

    while (this.queue.length > 0) {
      const current = this.queue[0];
      const success = await this.executeOperation(current);

      if (success) {
        this.queue.shift(); // Remove completed item
        this.savePersistedQueue();
        store.dispatch(setLastSavedAt(new Date().toISOString()));
      } else {
        current.retryCount = (current.retryCount || 0) + 1;
        if (current.retryCount >= MAX_RETRIES) {
          // Exceeded max retries, move out of blocking queue to avoid infinite head-of-line blocking
          console.warn(`[SyncManager] Item ${current.id} exceeded max retries (${MAX_RETRIES}). Removing from active queue.`);
          this.queue.shift();
          this.savePersistedQueue();
        } else {
          // Schedule next backoff retry
          const backoff = Math.min(BASE_RETRY_DELAY * Math.pow(2, current.retryCount), 30000);
          console.log(`[SyncManager] Retrying in ${backoff}ms...`);
          this.isProcessing = false;
          if (this.timer) clearTimeout(this.timer);
          this.timer = setTimeout(() => this.processQueue(), backoff);
          return;
        }
      }
    }

    this.isProcessing = false;
    store.dispatch(setSyncStatus('saved'));
  }

  async executeOperation(item) {
    const { type, id, payload } = item;
    try {
      const currentUser = auth?.currentUser;
      const currentUserId = currentUser?.uid || null;
      const currentUserEmail = currentUser?.email || payload.userEmail || null;

      switch (type) {
        case 'UPSERT_RESUME': {
          const docRef = doc(db, 'resumes', id);
          const dataToSave = {
            ...payload,
            documentId: id,
            resumeId: id,
            userId: currentUserId || payload.userId || null,
            userEmail: currentUserEmail,
            lastSyncedAt: new Date().toISOString()
          };
          await setDoc(docRef, dataToSave, { merge: true });
          return true;
        }

        case 'DELETE_RESUME': {
          const docRef = doc(db, 'resumes', id);
          await deleteDoc(docRef);
          return true;
        }

        case 'UPSERT_PORTFOLIO': {
          const docRef = doc(db, 'portfolios', id);
          const dataToSave = {
            ...payload,
            documentId: id,
            portfolioId: id,
            userId: currentUserId || payload.userId || null,
            userEmail: currentUserEmail,
            lastSyncedAt: new Date().toISOString()
          };
          await setDoc(docRef, dataToSave, { merge: true });
          return true;
        }

        case 'DELETE_PORTFOLIO': {
          const docRef = doc(db, 'portfolios', id);
          await deleteDoc(docRef);
          return true;
        }

        default:
          console.warn(`Unknown sync operation type: ${type}`);
          return true;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `${type}/${id}`);
      return false;
    }
  }

  /**
   * Bi-directional reconciliation: Fetch remote collection and merge into local vault
   */
  async pullRemoteResumes(userEmail) {
    if (!navigator.onLine || !userEmail) return [];
    try {
      const q = query(collection(db, 'resumes'), where('userEmail', '==', userEmail));
      const querySnapshot = await getDocs(q);
      const remoteResumes = [];
      querySnapshot.forEach((d) => {
        remoteResumes.push(d.data());
      });
      return remoteResumes;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'resumes');
      return [];
    }
  }

  async pullRemotePortfolios(userEmail) {
    if (!navigator.onLine || !userEmail) return [];
    try {
      const q = query(collection(db, 'portfolios'), where('userEmail', '==', userEmail));
      const querySnapshot = await getDocs(q);
      const remotePortfolios = [];
      querySnapshot.forEach((d) => {
        remotePortfolios.push(d.data());
      });
      return remotePortfolios;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'portfolios');
      return [];
    }
  }
}

export const syncManager = new SynchronizationManager();
export default syncManager;
