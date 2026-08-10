const getResumesFromStorage = () => {
    const data = localStorage.getItem('user_resumes');
    return data ? JSON.parse(data) : [];
};

const saveResumesToStorage = (resumes) => {
    localStorage.setItem('user_resumes', JSON.stringify(resumes));
};

const getPortfoliosFromStorage = () => {
    const data = localStorage.getItem('user_portfolios');
    return data ? JSON.parse(data) : [];
};

const savePortfoliosToStorage = (portfolios) => {
    localStorage.setItem('user_portfolios', JSON.stringify(portfolios));
};

const CreateNewResume = (data) => {
    return new Promise((resolve) => {
        const resumes = getResumesFromStorage();
        const newResume = {
            ...data.data,
            documentId: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString()
        };
        resumes.push(newResume);
        saveResumesToStorage(resumes);
        
        resolve({ data: { data: newResume } });
    });
};

const GetUserResumes = (userEmail) => {
    return new Promise((resolve) => {
        const resumes = getResumesFromStorage();
        const userResumes = resumes.filter(r => r.userEmail === userEmail);
        resolve({ data: { data: userResumes } });
    });
};

const UpdateResumeDetail = (id, data) => {
    return new Promise((resolve) => {
        const resumes = getResumesFromStorage();
        const index = resumes.findIndex(r => r.documentId === id);
        if (index !== -1) {
            resumes[index] = { ...resumes[index], ...data.data };
            saveResumesToStorage(resumes);
            resolve({ data: { data: resumes[index] } });
        } else {
            resolve({ data: { data: null } });
        }
    });
};

const GetResumeById = (id) => {
    return new Promise((resolve) => {
        const resumes = getResumesFromStorage();
        const resume = resumes.find(r => r.documentId === id);
        resolve({ data: { data: resume } });
    });
};

const DeleteResumeById = (id) => {
    return new Promise((resolve) => {
        let resumes = getResumesFromStorage();
        resumes = resumes.filter(r => r.documentId !== id);
        saveResumesToStorage(resumes);
        resolve({ data: { data: { success: true } } });
    });
};

const CreateNewPortfolio = (data) => {
    return new Promise((resolve) => {
        const portfolios = getPortfoliosFromStorage();
        const newPortfolio = {
            ...data.data,
            documentId: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            createdAt: new Date().toISOString()
        };
        portfolios.push(newPortfolio);
        savePortfoliosToStorage(portfolios);
        resolve({ data: { data: newPortfolio } });
    });
};

const GetUserPortfolios = (userEmail) => {
    return new Promise((resolve) => {
        const portfolios = getPortfoliosFromStorage();
        const userPortfolios = portfolios.filter(p => p.userEmail === userEmail);
        resolve({ data: { data: userPortfolios } });
    });
};

const UpdatePortfolioDetail = (id, data) => {
    return new Promise((resolve) => {
        const portfolios = getPortfoliosFromStorage();
        const index = portfolios.findIndex(p => p.documentId === id);
        if (index !== -1) {
            portfolios[index] = { ...portfolios[index], ...data.data };
            savePortfoliosToStorage(portfolios);
            resolve({ data: { data: portfolios[index] } });
        } else {
            resolve({ data: { data: null } });
        }
    });
};

const GetPortfolioById = (id) => {
    return new Promise((resolve) => {
        const portfolios = getPortfoliosFromStorage();
        const portfolio = portfolios.find(p => p.documentId === id);
        resolve({ data: { data: portfolio } });
    });
};

const DeletePortfolioById = (id) => {
    return new Promise((resolve) => {
        let portfolios = getPortfoliosFromStorage();
        portfolios = portfolios.filter(p => p.documentId !== id);
        savePortfoliosToStorage(portfolios);
        resolve({ data: { data: { success: true } } });
    });
};

export default {
    CreateNewResume,
    GetUserResumes,
    UpdateResumeDetail,
    GetResumeById,
    DeleteResumeById,
    CreateNewPortfolio,
    GetUserPortfolios,
    UpdatePortfolioDetail,
    GetPortfolioById,
    DeletePortfolioById
};