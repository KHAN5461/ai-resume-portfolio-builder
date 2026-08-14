import { db } from '../lib/firebaseConfig';
import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc } from 'firebase/firestore';

const GetUserResumes = async (userEmail) => {
    try {
        const q = query(collection(db, "resumes"), where("userEmail", "==", userEmail));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => doc.data());
        return { data: { data } };
    } catch (error) {
        console.error("Firestore Error:", error);
        const local = JSON.parse(localStorage.getItem('local_resumes') || '[]');
        return { data: { data: local.filter(r => r.userEmail === userEmail) } };
    }
};

const GetUserPortfolios = async (userEmail) => {
    try {
        const q = query(collection(db, "portfolios"), where("userEmail", "==", userEmail));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => doc.data());
        return { data: { data } };
    } catch (error) {
        console.error("Firestore Error:", error);
        const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
        return { data: { data: local.filter(p => p.userEmail === userEmail) } };
    }
};

const CreateNewResume = async (payload) => {
    const documentId = payload.data.resumeId || crypto.randomUUID();
    const newResume = { ...payload.data, documentId };
    
    try {
        await setDoc(doc(db, "resumes", documentId), newResume);
        return { data: { data: newResume } };
    } catch (error) {
        console.error("Firestore Error:", error);
        const local = JSON.parse(localStorage.getItem('local_resumes') || '[]');
        local.push(newResume);
        localStorage.setItem('local_resumes', JSON.stringify(local));
        return { data: { data: newResume } };
    }
};

const CreateNewPortfolio = async (payload) => {
    const documentId = payload.data.portfolioId || crypto.randomUUID();
    const newPortfolio = { ...payload.data, documentId };

    try {
        await setDoc(doc(db, "portfolios", documentId), newPortfolio);
        return { data: { data: newPortfolio } };
    } catch (error) {
        console.error("Firestore Error:", error);
        const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
        local.push(newPortfolio);
        localStorage.setItem('local_portfolios', JSON.stringify(local));
        return { data: { data: newPortfolio } };
    }
};

const GetResumeById = async (id) => {
    try {
        const docRef = doc(db, "resumes", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { data: { data: docSnap.data() } };
        } else {
            throw new Error("No such document!");
        }
    } catch (error) {
        console.error("Firestore Error:", error);
        const local = JSON.parse(localStorage.getItem('local_resumes') || '[]');
        const found = local.find(r => r.documentId === id);
        return { data: { data: found } };
    }
};

const GetPortfolioById = async (id) => {
    try {
        const docRef = doc(db, "portfolios", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { data: { data: docSnap.data() } };
        } else {
            throw new Error("No such document!");
        }
    } catch (error) {
        console.error("Firestore Error:", error);
        const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
        const found = local.find(p => p.documentId === id);
        return { data: { data: found } };
    }
};

const UpdateResumeDetail = async (id, payload) => {
    try {
        const docRef = doc(db, "resumes", id);
        await updateDoc(docRef, payload.data);
        const docSnap = await getDoc(docRef);
        return { data: { data: docSnap.data() } };
    } catch (error) {
        console.error("Firestore Error:", error);
        const local = JSON.parse(localStorage.getItem('local_resumes') || '[]');
        const idx = local.findIndex(r => r.documentId === id);
        if(idx !== -1) {
            local[idx] = { ...local[idx], ...payload.data };
            localStorage.setItem('local_resumes', JSON.stringify(local));
            return { data: { data: local[idx] } };
        }
        return { data: { data: payload.data } };
    }
};

const UpdatePortfolioDetail = async (id, payload) => {
    try {
        const docRef = doc(db, "portfolios", id);
        await updateDoc(docRef, payload.data);
        const docSnap = await getDoc(docRef);
        return { data: { data: docSnap.data() } };
    } catch (error) {
        console.error("Firestore Error:", error);
        const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
        const idx = local.findIndex(p => p.documentId === id);
        if(idx !== -1) {
            local[idx] = { ...local[idx], ...payload.data };
            localStorage.setItem('local_portfolios', JSON.stringify(local));
            return { data: { data: local[idx] } };
        }
        return { data: { data: payload.data } };
    }
};

const DeleteResumeById = async (id) => {
    try {
        await deleteDoc(doc(db, "resumes", id));
        return { data: { success: true } };
    } catch (error) {
        console.error("Firestore Error:", error);
        const local = JSON.parse(localStorage.getItem('local_resumes') || '[]');
        localStorage.setItem('local_resumes', JSON.stringify(local.filter(r => r.documentId !== id)));
        return { data: { success: true } };
    }
};

const DeletePortfolioById = async (id) => {
    try {
        await deleteDoc(doc(db, "portfolios", id));
        return { data: { success: true } };
    } catch (error) {
        console.error("Firestore Error:", error);
        const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
        localStorage.setItem('local_portfolios', JSON.stringify(local.filter(p => p.documentId !== id)));
        return { data: { success: true } };
    }
};

const IncrementPortfolioViews = async (id) => {
    try {
        const docRef = doc(db, "portfolios", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const currentViews = docSnap.data().views || 0;
            await updateDoc(docRef, { views: currentViews + 1 });
            return { data: { success: true, views: currentViews + 1 } };
        }
    } catch (error) {
        console.error("Firestore Error on incrementing views:", error);
        const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
        const idx = local.findIndex(p => p.documentId === id);
        if(idx !== -1) {
            const currentViews = local[idx].views || 0;
            local[idx].views = currentViews + 1;
            localStorage.setItem('local_portfolios', JSON.stringify(local));
            return { data: { success: true, views: currentViews + 1 } };
        }
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
