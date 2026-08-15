// DriveService.js
// Handles Google Drive BYOS logic

const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
const FOLDER_NAME = 'AI_Resume_Portfolio_App';

/**
 * Mocks the GIS Auth flow to return a dummy token since we don't have a real Client ID yet.
 * In a real environment, this would call google.accounts.oauth2.initTokenClient
 */
export const connectDrive = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const dummyToken = 'dummy_google_drive_access_token_' + Date.now();
            sessionStorage.setItem('gdrive_token', dummyToken);
            resolve(dummyToken);
        }, 1000);
    });
};

export const getDriveToken = () => {
    return sessionStorage.getItem('gdrive_token');
};

export const disconnectDrive = () => {
    sessionStorage.removeItem('gdrive_token');
};

/**
 * Saves a JSON blob to Google Drive.
 * @param {string} accessToken 
 * @param {object} data The resume/portfolio JSON data
 * @param {string} fileName The name of the file to save as (e.g. resume_123.json)
 * @param {string} fileId Optional. If provided, updates existing file via PATCH.
 */
export const saveToDrive = async (accessToken, data, fileName, fileId = null) => {
    // For local mocking/testing without real credentials, we will just use localStorage
    if (accessToken.startsWith('dummy_')) {
        console.log(`[Drive Mock] Saving ${fileName} to Drive...`);
        return new Promise((resolve) => {
            setTimeout(() => {
                const docId = fileId || crypto.randomUUID();
                const localFiles = JSON.parse(localStorage.getItem('mock_gdrive_files') || '{}');
                localFiles[docId] = {
                    name: fileName,
                    content: data,
                    updatedAt: new Date().toISOString()
                };
                localStorage.setItem('mock_gdrive_files', JSON.stringify(localFiles));
                resolve({ id: docId });
            }, 500);
        });
    }

    // Real Google Drive API logic
    const metadata = { name: fileName, mimeType: 'application/json' };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([JSON.stringify(data)], { type: 'application/json' }));

    const url = fileId 
        ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
        : DRIVE_UPLOAD_URL;

    const response = await fetch(url, {
        method: fileId ? 'PATCH' : 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized');
        }
        throw new Error('Failed to save to Google Drive');
    }

    return response.json();
};

export const loadFromDrive = async (accessToken, fileId) => {
    if (accessToken.startsWith('dummy_')) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const localFiles = JSON.parse(localStorage.getItem('mock_gdrive_files') || '{}');
                if (localFiles[fileId]) {
                    resolve(localFiles[fileId].content);
                } else {
                    reject(new Error('File not found'));
                }
            }, 500);
        });
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) {
        throw new Error('Failed to load from Google Drive');
    }

    return response.json();
};

export const deleteFromDrive = async (accessToken, fileId) => {
    if (accessToken.startsWith('dummy_')) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const localFiles = JSON.parse(localStorage.getItem('mock_gdrive_files') || '{}');
                delete localFiles[fileId];
                localStorage.setItem('mock_gdrive_files', JSON.stringify(localFiles));
                resolve(true);
            }, 500);
        });
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!response.ok) {
        throw new Error('Failed to delete from Google Drive');
    }

    return true;
};
