import React from 'react';
import { useSelector } from 'react-redux';
import PreviewErrorBoundary from '@/components/PreviewErrorBoundary';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import MinimalImageTemplate from './templates/MinimalImageTemplate';

// Map our Redux resume schema to the schema expected by the templates
export const mapResumeInfoToTemplateData = (resumeInfo) => {
    if (!resumeInfo) return {};

    return {
        personal_info: {
            full_name: `${resumeInfo?.firstName || ''} ${resumeInfo?.lastName || ''}`.trim(),
            profession: resumeInfo?.jobTitle || '',
            email: resumeInfo?.email || '',
            phone: resumeInfo?.phone || '',
            location: resumeInfo?.address || '',
            linkedin: resumeInfo?.linkedin || '',
            website: resumeInfo?.website || ''
        },
        professional_summary: resumeInfo?.summery || resumeInfo?.summary || '',
        experience: (resumeInfo?.Experience || resumeInfo?.experience || []).map(exp => ({
            position: exp?.title || '',
            company: exp?.companyName || '',
            city: exp?.city || '',
            state: exp?.state || '',
            start_date: exp?.startDate || '',
            end_date: exp?.endDate || '',
            is_current: exp?.currentlyWorking || false,
            description: exp?.workSummery || exp?.workSummary || '' 
        })),
        education: (resumeInfo?.education || resumeInfo?.Education || []).map(edu => ({
            degree: edu?.degree || '',
            field: edu?.major || '',
            institution: edu?.universityName || '',
            graduation_date: edu?.endDate || '',
            description: edu?.description || ''
        })),
        skills: (resumeInfo?.skills || resumeInfo?.Skills || []).map(skill => skill?.name || (typeof skill === 'string' ? skill : '')),
        project: [] // Not implemented in current form
    };
};

const ResumePreview = React.memo(() => {
    const resumeInfo = useSelector(state => state.resume.resumeData);
    const templateData = mapResumeInfoToTemplateData(resumeInfo);

    // Get the accent color, defaulting to a basic color if none is chosen
    const accentColor = resumeInfo?.themeColor || '#2c3e50';

    const getTemplateComponent = () => {
        const template = resumeInfo?.themeTemplate || 'Classic';
        switch (template) {
            case 'Modern':
                return <ModernTemplate data={templateData} accentColor={accentColor} />;
            case 'Minimal':
                return <MinimalTemplate data={templateData} accentColor={accentColor} />;
            case 'MinimalImage':
                return <MinimalImageTemplate data={templateData} accentColor={accentColor} />;
            case 'Classic':
            default:
                return <ClassicTemplate data={templateData} accentColor={accentColor} />;
        }
    };

    return (
        <PreviewErrorBoundary>
            <div 
                id="print-area" 
                className={`shadow-lg h-full overflow-y-auto bg-gray-50 custom-scrollbar font-${(resumeInfo?.themeFont || 'sans').toLowerCase().replace(' ', '-')}`}
            >
                {getTemplateComponent()}
            </div>
        </PreviewErrorBoundary>
    )
})

export default ResumePreview;