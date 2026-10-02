import React from 'react'

function SkillsPreview({resumeInfo}) {
  const rawSkills = resumeInfo?.skills || resumeInfo?.Skills;
  const skills = Array.isArray(rawSkills) 
    ? rawSkills 
    : typeof rawSkills === 'object' && rawSkills !== null
      ? Object.values(rawSkills).flatMap(val => Array.isArray(val) ? val : [val]).map(s => typeof s === 'string' ? { name: s, rating: 5 } : s).filter(Boolean)
      : [];

  return (
    <div className='my-6'>
    <h2 className='text-center font-bold text-sm mb-2'
    style={{
        color:resumeInfo?.themeColor
    }}
    >Skills</h2>
    <hr style={{
        borderColor:resumeInfo?.themeColor
    }} />

    <div className='grid grid-cols-2 gap-3 my-4'>
        {skills.map((skill,index)=>(
            <div key={index} className='flex items-center justify-between'>
                <h2 className='text-xs'>{typeof skill === 'string' ? skill : skill?.name}</h2>
                <div className='h-2 bg-gray-200 w-[120px]'>
                    <div className='h-2'
                        style={{
                            backgroundColor:resumeInfo?.themeColor,
                            width: ((typeof skill === 'object' ? skill?.rating : 5) || 5) * 20 + '%'
                        }}
                    >
                    </div>
                </div>
            </div>
        ))}
    </div>
    </div>
  )
}

export default SkillsPreview