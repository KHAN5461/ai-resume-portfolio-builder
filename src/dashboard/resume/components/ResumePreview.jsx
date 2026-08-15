import React from 'react';
import { useSelector } from 'react-redux';
import PreviewErrorBoundary from '@/components/PreviewErrorBoundary';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import MinimalImageTemplate from './templates/MinimalImageTemplate';
import { mapResumeInfoToTemplateData } from '@/lib/templateDataMapper';

const ResumePreview = React.memo(({ resumeInfo }) => {
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
                className={`shadow-lg h-full overflow-y-auto overflow-x-hidden max-w-full bg-gray-50 custom-scrollbar font-${(resumeInfo?.themeFont || 'sans').toLowerCase().replace(' ', '-')}`}
            >
                <div className="max-md:scale-[0.5] max-sm:scale-[0.4] max-md:origin-top-left w-full">
                    {getTemplateComponent()}
                </div>
            </div>
        </PreviewErrorBoundary>
    )
})

export default ResumePreview;