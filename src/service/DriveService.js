// DriveService.js
// Handles Google Drive BYOS logic

const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
const FOLDER_NAME = 'AI_Resume_Portfolio_App';

// Cache ETags to prevent data-races
const etagCache = new Map();

/**
 * Mocks the GIS Auth flow to return a dummy token since we don't have a real Client ID yet.
 * In a real environment, this would call google.accounts.oauth2.initTokenClient
 * The scope MUST be strictly: https://www.googleapis.com/auth/drive.file
 */
export const connectDrive = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const dummyToken = 'dummy_google_drive_access_token_' + Date.now();
            resolve(dummyToken);
        }, 1000);
    });
};

export const getDriveToken = () => {
    // Deprecated: Token is now held in memory via Redux syncSlice.driveToken
    return null;
};

export const disconnectDrive = async (accessToken) => {
    if (accessToken && !accessToken.startsWith('dummy_')) {
        try {
            await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            console.log('Successfully revoked Google Drive token.');
        } catch (error) {
            console.error('Failed to revoke Google Drive token:', error);
        }
    }
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

    const headers = { Authorization: `Bearer ${accessToken}` };
    if (fileId && etagCache.has(fileId)) {
        headers['If-Match'] = etagCache.get(fileId);
    }

    const response = await fetch(url, {
        method: fileId ? 'PATCH' : 'POST',
        headers: headers,
        body: form
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized');
        }
        if (response.status === 412) {
            throw new Error('DATA_RACE: This file has been updated elsewhere.');
        }
        throw new Error('Failed to save to Google Drive');
    }

    const json = await response.json();
    if (response.headers.get('ETag')) {
        etagCache.set(fileId || json.id, response.headers.get('ETag'));
    }
    return json;
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

    if (response.headers.get('ETag')) {
        etagCache.set(fileId, response.headers.get('ETag'));
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
