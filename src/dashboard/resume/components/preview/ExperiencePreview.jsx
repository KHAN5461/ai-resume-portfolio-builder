import React from 'react'
import { sanitizeHtml } from '@/lib/sanitize';

function ExperiencePreview({resumeInfo}) {
  return (
    <div className='my-6'>
        <h2 className='text-center font-bold text-sm mb-2'
        style={{
            color:resumeInfo?.themeColor
        }}
        >Professional Experience</h2>
        <hr style={{
            borderColor:resumeInfo?.themeColor
        }} />

        {(Array.isArray(resumeInfo?.Experience) ? resumeInfo.Experience : []).map((experience,index)=>(
            <div key={index} className='my-5 break-inside-avoid resume-section-item'>
                <h2 className='text-sm font-bold'
                 style={{
                    color:resumeInfo?.themeColor
                }}>{experience?.title}</h2>
                <h2 className='text-xs flex justify-between'>{experience?.companyName}, 
                {experience?.city}, 
                {experience?.state}
                <span>{experience?.startDate} To {experience?.currentlyWorking?'Present':experience.endDate} </span>
                </h2>
                <div className='text-xs my-2 leading-relaxed' dangerouslySetInnerHTML={{__html: sanitizeHtml(experience?.workSummery)}} />
            </div>
        ))}
    </div>
  )
}

export default ExperiencePreview