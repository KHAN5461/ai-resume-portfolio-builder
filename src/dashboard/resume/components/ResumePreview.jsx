import React from 'react';
import { useSelector } from 'react-redux';
import PersonalDetailPreview from './preview/PersonalDetailPreview'
import SummeryPreview from './preview/SummeryPreview'
import ExperiencePreview from './preview/ExperiencePreview'
import EducationalPreview from './preview/EducationalPreview'
import SkillsPreview from './preview/SkillsPreview'
import PreviewErrorBoundary from '@/components/PreviewErrorBoundary'

const ResumePreview = React.memo(() => {

    const resumeInfo = useSelector(state => state.resume.resumeData);

  return (
    <PreviewErrorBoundary>
      <div className={`shadow-lg h-full p-14 border-t-[20px] font-${resumeInfo?.themeFont?.toLowerCase().replace(' ', '-') || 'sans'}`}
      style={{
          borderColor:resumeInfo?.themeColor
      }}>
          {/* Personal Detail  */}
              <PersonalDetailPreview resumeInfo={resumeInfo} />
          {/* Summery  */}
              <SummeryPreview resumeInfo={resumeInfo} />
          {/* Professional Experience  */}
             {resumeInfo?.Experience?.length>0&& <ExperiencePreview resumeInfo={resumeInfo} />}
          {/* Educational  */}
          {resumeInfo?.education?.length>0&&   <EducationalPreview resumeInfo={resumeInfo} />}
          {/* Skilss  */}
          {resumeInfo?.skills?.length>0&&    <SkillsPreview resumeInfo={resumeInfo}/>}
      </div>
    </PreviewErrorBoundary>
  )
})

export default ResumePreview