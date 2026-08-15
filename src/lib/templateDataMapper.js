/**
 * Shared template data mapper and export utilities
 */

/**
 * Handles both string array and object array formats, as well as the new object schema
 */
export const normalizeSkills = (skills) => {
    if (!skills) return [];
    
    // Handle the new object format
    if (typeof skills === 'object' && !Array.isArray(skills)) {
        let flattened = [];
        if (Array.isArray(skills.languages)) flattened = flattened.concat(skills.languages);
        if (Array.isArray(skills.frameworksAndLibraries)) flattened = flattened.concat(skills.frameworksAndLibraries);
        if (Array.isArray(skills.databasesAndTools)) flattened = flattened.concat(skills.databasesAndTools);
        
        return flattened.map(skill => {
            if (typeof skill === 'string') return skill;
            if (skill?.name) return skill.name;
            return '';
        }).filter(Boolean);
    }
    
    if (!Array.isArray(skills)) return [];
    return skills.map(skill => {
        if (typeof skill === 'string') return skill;
        if (skill?.name) return skill.name;
        return '';
    }).filter(Boolean);
};

export const formatDateRange = (startDate, endDate, isCurrent) => {
    if (!startDate) return '';
    const start = startDate;
    const end = isCurrent ? 'Present' : endDate || '';
    return end ? `${start} - ${end}` : start;
};

export const mapResumeInfoToTemplateData = (resumeInfo) => {
    if (!resumeInfo) return {};

    const personalInfo = resumeInfo?.personalInfo || resumeInfo;
    const experienceList = Array.isArray(resumeInfo?.workExperience) ? resumeInfo.workExperience
        : Array.isArray(resumeInfo?.Experience) ? resumeInfo.Experience 
        : Array.isArray(resumeInfo?.experience) ? resumeInfo.experience : [];
        
    const educationList = Array.isArray(resumeInfo?.education) ? resumeInfo.education 
        : Array.isArray(resumeInfo?.Education) ? resumeInfo.Education : [];
        
    const skillsList = resumeInfo?.skills || resumeInfo?.Skills || [];
    
    const projectsList = Array.isArray(resumeInfo?.projects) ? resumeInfo.projects : [];

    return {
        personal_info: {
            full_name: personalInfo?.fullName || `${resumeInfo?.firstName || ''} ${resumeInfo?.lastName || ''}`.trim(),
            profession: personalInfo?.targetTitle || resumeInfo?.jobTitle || '',
            email: personalInfo?.email || resumeInfo?.email || '',
            phone: personalInfo?.phone || resumeInfo?.phone || '',
            location: personalInfo?.location || resumeInfo?.address || '',
            linkedin: personalInfo?.linkedinUrl || resumeInfo?.linkedin || '',
            website: personalInfo?.portfolioUrl || resumeInfo?.website || ''
        },
        professional_summary: typeof resumeInfo?.professionalSummary === 'string' ? resumeInfo.professionalSummary
            : typeof resumeInfo?.summery === 'string' ? resumeInfo.summery 
            : typeof resumeInfo?.summary === 'string' ? resumeInfo.summary : '',
        experience: experienceList.map(exp => ({
            position: exp?.role || exp?.title || '',
            company: exp?.company || exp?.companyName || '',
            city: exp?.location || exp?.city || '',
            state: exp?.state || '',
            start_date: exp?.startDate || '',
            end_date: exp?.endDate || '',
            is_current: exp?.current || exp?.currentlyWorking || false,
            description: (exp?.bullets && exp.bullets.length > 0) ? exp.bullets.join('\n') 
                : typeof exp?.workSummery === 'string' ? exp.workSummery 
                : typeof exp?.workSummary === 'string' ? exp.workSummary : '' 
        })),
        education: educationList.map(edu => ({
            degree: edu?.degree || '',
            field: edu?.major || '',
            institution: edu?.institution || edu?.universityName || '',
            graduation_date: edu?.endDate || '',
            description: edu?.description || '',
            gpa: edu?.gpaOrHonors || edu?.gpa || ''
        })),
        skills: normalizeSkills(skillsList),
        project: projectsList.map(proj => ({
            name: proj?.name || '',
            description: (proj?.highlights && proj.highlights.length > 0) ? proj.highlights.join('\n') : '',
            type: proj?.role || '',
        }))
    };
};

export const mapPortfolioToTemplateData = (portfolioData) => {
    if (!portfolioData) return {};
    
    return {
        hero: {
            greeting: portfolioData?.hero?.greeting || '',
            headline: portfolioData?.hero?.headline || '',
            subheadline: portfolioData?.hero?.subheadline || '',
            primaryCta: portfolioData?.hero?.primaryCta || {},
            secondaryCta: portfolioData?.hero?.secondaryCta || {}
        },
        about: {
            title: portfolioData?.about?.title || '',
            description: portfolioData?.about?.description || '',
            stats: Array.isArray(portfolioData?.about?.stats) ? portfolioData.about.stats : []
        },
        projects: Array.isArray(portfolioData?.projects) ? portfolioData.projects.map(p => ({
            title: p?.title || '',
            description: p?.description || '',
            tags: Array.isArray(p?.tags) ? p.tags : [],
            image: p?.image || '',
            liveUrl: p?.liveUrl || '',
            repoUrl: p?.repoUrl || ''
        })) : [],
        skills: {
            categories: Array.isArray(portfolioData?.skills?.categories) ? portfolioData.skills.categories.map(c => ({
                name: c?.name || '',
                items: normalizeSkills(c?.items)
            })) : []
        },
        contact: {
            heading: portfolioData?.contact?.heading || '',
            subheading: portfolioData?.contact?.subheading || '',
            email: portfolioData?.contact?.email || '',
            socialLinks: Array.isArray(portfolioData?.contact?.socialLinks) ? portfolioData.contact.socialLinks : []
        },
        siteConfig: {
            themePreset: portfolioData?.siteConfig?.themePreset || 'default',
            accentColor: portfolioData?.siteConfig?.accentColor || '#000000',
            themeMode: portfolioData?.siteConfig?.themeMode || 'light'
        }
    };
};

export const validateTemplateData = (data) => {
    if (!data) return { valid: false, warnings: ['No data provided'] };
    
    let valid = true;
    const warnings = [];

    if (!data.personal_info?.full_name?.trim()) {
        valid = false;
        warnings.push('Full name is missing.');
    }

    const hasExperience = Array.isArray(data.experience) && data.experience.length > 0;
    const hasEducation = Array.isArray(data.education) && data.education.length > 0;
    const hasSkills = Array.isArray(data.skills) && data.skills.length > 0;
    const hasSummary = !!data.professional_summary?.trim();

    if (!hasExperience && !hasEducation && !hasSkills && !hasSummary) {
        valid = false;
        warnings.push('At least one section (Experience, Education, Skills, or Summary) must contain data.');
    }

    if (hasExperience) {
        data.experience.forEach((exp, index) => {
            if (!exp.description?.trim()) {
                warnings.push(`Experience entry "${exp.position || index + 1}" is missing a description.`);
            }
        });
    }

    if (!hasSkills) {
        warnings.push('Skills list is empty.');
    }

    return { valid, warnings };
};
