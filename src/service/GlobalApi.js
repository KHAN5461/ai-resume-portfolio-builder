import { getDriveToken, saveToDrive, loadFromDrive, deleteFromDrive } from './DriveService';

// Helper to get token safely
const getToken = () => getDriveToken() || 'dummy_token_for_local_fallback';

const CURRENT_SCHEMA_VERSION = 1.1;

// Schema Migration Layer
const migrateResumeData = (data) => {
    let migrated = { ...data };
    const version = migrated.schemaVersion || 1.0;
    
    // 1.0 to 1.1: Ensure themeConfig and layout arrays exist
    if (version < 1.1) {
        if (!migrated.themeConfig) {
            migrated.themeConfig = { accentColor: '#000000', fontFamily: 'Inter' };
        }
        if (!Array.isArray(migrated.layout)) {
            migrated.layout = ['summary', 'experience', 'education', 'skills'];
        }
        migrated.schemaVersion = CURRENT_SCHEMA_VERSION;
    }
    
    return migrated;
};

const migratePortfolioData = (data) => {
    let migrated = { ...data };
    const version = migrated.schemaVersion || 1.0;
    
    // 1.0 to 1.1: Ensure siteConfig exists
    if (version < 1.1) {
        if (!migrated.siteConfig) {
            migrated.siteConfig = { themeMode: 'system', accentColor: '#3b82f6' };
        }
        migrated.schemaVersion = CURRENT_SCHEMA_VERSION;
    }
    
    return migrated;
};

const GetUserResumes = async (userEmail) => {
    // For BYOS, the index is kept locally or in an index.json on Drive.
    // We will use local storage to simulate the index for now.
    const local = JSON.parse(localStorage.getItem('local_resumes') || '[]');
    return { data: { data: local.filter(r => r.userEmail === userEmail).map(migrateResumeData) } };
};

const GetUserPortfolios = async (userEmail) => {
    const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
    return { data: { data: local.filter(p => p.userEmail === userEmail).map(migratePortfolioData) } };
};

const CreateNewResume = async (payload) => {
    const documentId = payload.data.resumeId || crypto.randomUUID();
    const newResume = { ...payload.data, documentId };
    const token = getToken();
    
    try {
        await saveToDrive(token, newResume, `resume_${documentId}.json`, documentId);
    } catch (e) {
        console.error("Drive Error:", e);
    }
    
    // Update local index
    const local = JSON.parse(localStorage.getItem('local_resumes') || '[]');
    local.push(newResume);
    localStorage.setItem('local_resumes', JSON.stringify(local));
    return { data: { data: newResume } };
};

const CreateNewPortfolio = async (payload) => {
    const documentId = payload.data.portfolioId || crypto.randomUUID();
    const newPortfolio = { ...payload.data, documentId };
    const token = getToken();

    try {
        await saveToDrive(token, newPortfolio, `portfolio_${documentId}.json`, documentId);
    } catch (e) {
        console.error("Drive Error:", e);
    }

    const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
    local.push(newPortfolio);
    localStorage.setItem('local_portfolios', JSON.stringify(local));
    return { data: { data: newPortfolio } };
};

const GetResumeById = async (id) => {
    const token = getToken();
    try {
        const driveData = await loadFromDrive(token, id);
        return { data: { data: migrateResumeData(driveData) } };
    } catch (error) {
        console.warn("Drive Load Failed, falling back to local index:", error);
        const local = JSON.parse(localStorage.getItem('local_resumes') || '[]');
        const found = local.find(r => r.documentId === id);
        if (found) return { data: { data: migrateResumeData(found) } };
        throw new Error("No such document!");
    }
};

const GetPortfolioById = async (id) => {
    const token = getToken();
    try {
        const driveData = await loadFromDrive(token, id);
        return { data: { data: migratePortfolioData(driveData) } };
    } catch (error) {
        console.warn("Drive Load Failed, falling back to local index:", error);
        const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
        const found = local.find(p => p.documentId === id);
        if (found) return { data: { data: migratePortfolioData(found) } };
        throw new Error("No such document!");
    }
};

const UpdateResumeDetail = async (id, payload) => {
    const token = getToken();
    
    // Read existing to merge if necessary, or just rely on payload
    // We assume payload.data contains the full update for now
    let dataToSave = payload.data;
    
    const local = JSON.parse(localStorage.getItem('local_resumes') || '[]');
    const idx = local.findIndex(r => r.documentId === id);
    if(idx !== -1) {
        local[idx] = { ...local[idx], ...payload.data };
        localStorage.setItem('local_resumes', JSON.stringify(local));
        dataToSave = local[idx];
    }

    try {
        await saveToDrive(token, dataToSave, `resume_${id}.json`, id);
    } catch (e) {
        console.error("Drive Error:", e);
    }

    return { data: { data: dataToSave } };
};

const UpdatePortfolioDetail = async (id, payload) => {
    const token = getToken();
    let dataToSave = payload.data;

    const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
    const idx = local.findIndex(p => p.documentId === id);
    if(idx !== -1) {
        local[idx] = { ...local[idx], ...payload.data };
        localStorage.setItem('local_portfolios', JSON.stringify(local));
        dataToSave = local[idx];
    }

    try {
        await saveToDrive(token, dataToSave, `portfolio_${id}.json`, id);
    } catch (e) {
        console.error("Drive Error:", e);
    }

    return { data: { data: dataToSave } };
};

const DeleteResumeById = async (id) => {
    const token = getToken();
    try {
        await deleteFromDrive(token, id);
    } catch (e) {
        console.error("Drive Error:", e);
    }
    const local = JSON.parse(localStorage.getItem('local_resumes') || '[]');
    localStorage.setItem('local_resumes', JSON.stringify(local.filter(r => r.documentId !== id)));
    return { data: { success: true } };
};

const DeletePortfolioById = async (id) => {
    const token = getToken();
    try {
        await deleteFromDrive(token, id);
    } catch (e) {
        console.error("Drive Error:", e);
    }
    const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
    localStorage.setItem('local_portfolios', JSON.stringify(local.filter(p => p.documentId !== id)));
    return { data: { success: true } };
};

const IncrementPortfolioViews = async (id) => {
    // Avoid heavy Drive writes for simple view increments.
    // Just update the local index for now.
    const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
    const idx = local.findIndex(p => p.documentId === id);
    if(idx !== -1) {
        const currentViews = local[idx].views || 0;
        local[idx].views = currentViews + 1;
        localStorage.setItem('local_portfolios', JSON.stringify(local));
        return { data: { success: true, views: currentViews + 1 } };
    }
    return { data: { success: false } };
};

export default {
    GetUserResumes,
    GetUserPortfolios,
    CreateNewResume,
    CreateNewPortfolio,
    GetResumeById,
    GetPortfolioById,
    UpdateResumeDetail,
    UpdatePortfolioDetail,
    DeleteResumeById,
    DeletePortfolioById,
    IncrementPortfolioViews
};
