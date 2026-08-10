import { supabase } from '../lib/supabaseClient';

const GetUserResumes = async (userEmail) => {
    // Assuming 'resumes' table has columns: documentId, userEmail, title, data (jsonb)
    const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('userEmail', userEmail);
    
    if (error) {
        console.error("Supabase Error:", error);
        // Fallback to local storage if table doesn't exist yet (for smooth frontend transition)
        const local = JSON.parse(localStorage.getItem('local_resumes') || '[]');
        return { data: { data: local.filter(r => r.userEmail === userEmail) } };
    }
    return { data: { data } };
};

const GetUserPortfolios = async (userEmail) => {
    const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('userEmail', userEmail);
    
    if (error) {
        const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
        return { data: { data: local.filter(p => p.userEmail === userEmail) } };
    }
    return { data: { data } };
};

const CreateNewResume = async (payload) => {
    const documentId = payload.data.resumeId || crypto.randomUUID();
    const newResume = { ...payload.data, documentId };
    
    const { data, error } = await supabase
        .from('resumes')
        .insert([newResume])
        .select();

    if (error) {
        // Fallback
        const local = JSON.parse(localStorage.getItem('local_resumes') || '[]');
        local.push(newResume);
        localStorage.setItem('local_resumes', JSON.stringify(local));
        return { data: { data: newResume } };
    }
    return { data: { data: data[0] } };
};

const CreateNewPortfolio = async (payload) => {
    const documentId = payload.data.portfolioId || crypto.randomUUID();
    const newPortfolio = { ...payload.data, documentId };

    const { data, error } = await supabase
        .from('portfolios')
        .insert([newPortfolio])
        .select();

    if (error) {
        const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
        local.push(newPortfolio);
        localStorage.setItem('local_portfolios', JSON.stringify(local));
        return { data: { data: newPortfolio } };
    }
    return { data: { data: data[0] } };
};

const GetResumeById = async (id) => {
    const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('documentId', id)
        .single();

    if (error) {
        const local = JSON.parse(localStorage.getItem('local_resumes') || '[]');
        const found = local.find(r => r.documentId === id);
        return { data: { data: found } };
    }
    return { data: { data } };
};

const GetPortfolioById = async (id) => {
    const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('documentId', id)
        .single();

    if (error) {
        const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
        const found = local.find(p => p.documentId === id);
        return { data: { data: found } };
    }
    return { data: { data } };
};

const UpdateResumeDetail = async (id, payload) => {
    const { data, error } = await supabase
        .from('resumes')
        .update(payload)
        .eq('documentId', id)
        .select();

    if (error) {
        const local = JSON.parse(localStorage.getItem('local_resumes') || '[]');
        const index = local.findIndex(r => r.documentId === id);
        if (index > -1) {
            local[index] = { ...local[index], ...payload };
            localStorage.setItem('local_resumes', JSON.stringify(local));
            return { data: { data: local[index] } };
        }
    }
    return { data: { data: data?.[0] } };
};

const UpdatePortfolioDetail = async (id, payload) => {
    const { data, error } = await supabase
        .from('portfolios')
        .update(payload.data)
        .eq('documentId', id)
        .select();

    if (error) {
        const local = JSON.parse(localStorage.getItem('local_portfolios') || '[]');
        const index = local.findIndex(p => p.documentId === id);
        if (index > -1) {
            local[index] = { ...local[index], ...payload.data };
            localStorage.setItem('local_portfolios', JSON.stringify(local));
            return { data: { data: local[index] } };
        }
    }
    return { data: { data: data?.[0] } };
};

const DeleteResumeById = async (id) => {
    const { data, error } = await supabase
        .from('resumes')
        .delete()
        .eq('documentId', id);

    if (error) {
        let local = JSON.parse(localStorage.getItem('local_resumes') || '[]');
        local = local.filter(r => r.documentId !== id);
        localStorage.setItem('local_resumes', JSON.stringify(local));
        return { data: { data: true } };
    }
    return { data: { data: true } };
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
    DeleteResumeById
};
