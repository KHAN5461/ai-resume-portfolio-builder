import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfileData } from '@/store/profileSlice';
import { Code, CheckCircle2, AlertCircle, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_TEMPLATE = {
  "personalInfo": {
    "fullName": "",
    "targetTitle": "",
    "email": "",
    "phone": "",
    "location": "",
    "portfolioUrl": "",
    "githubUrl": "",
    "linkedinUrl": ""
  },
  "professionalSummary": "",
  "workExperience": [
    {
      "role": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "bullets": [
        ""
      ]
    }
  ],
  "projects": [
    {
      "name": "",
      "role": "",
      "startDate": "",
      "endDate": "",
      "highlights": [
        ""
      ],
      "technologies": [
        ""
      ]
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "gpaOrHonors": ""
    }
  ],
  "skills": {
    "languages": [
      ""
    ],
    "frameworksAndLibraries": [
      ""
    ],
    "databasesAndTools": [
      ""
    ]
  },
  "certifications": [
    {
      "title": "",
      "issuer": "",
      "date": ""
    }
  ]
};

export default function RawJsonEditor() {
  const profileInfo = useSelector(state => state.profile.present);
  const resumeInfo = useSelector(state => state.resume.present.resumeData);
  const dispatch = useDispatch();
  
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize the text box by merging Master Profile and visual form data
  useEffect(() => {
    if (!isDirty) {
      const constructedProfile = {
        personalInfo: {
          fullName: profileInfo?.personalInfo?.fullName || `${resumeInfo?.firstName || ''} ${resumeInfo?.lastName || ''}`.trim(),
          targetTitle: profileInfo?.personalInfo?.targetTitle || resumeInfo?.jobTitle || '',
          email: profileInfo?.personalInfo?.email || resumeInfo?.email || '',
          phone: profileInfo?.personalInfo?.phone || resumeInfo?.phone || '',
          location: profileInfo?.personalInfo?.location || resumeInfo?.address || '',
          portfolioUrl: profileInfo?.personalInfo?.portfolioUrl || '',
          githubUrl: profileInfo?.personalInfo?.githubUrl || '',
          linkedinUrl: profileInfo?.personalInfo?.linkedinUrl || resumeInfo?.linkedin || ''
        },
        professionalSummary: profileInfo?.professionalSummary || resumeInfo?.summery || resumeInfo?.summary || '',
        workExperience: profileInfo?.workExperience?.length > 0 ? profileInfo.workExperience : (resumeInfo?.Experience || []).map(exp => ({
          role: exp.title || '',
          company: exp.companyName || '',
          location: exp.city || exp.state ? `${exp.city || ''} ${exp.state || ''}`.trim() : '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          current: exp.currentlyWorking || false,
          bullets: exp.workSummery ? exp.workSummery.split('\n') : []
        })),
        projects: profileInfo?.projects || [],
        education: profileInfo?.education?.length > 0 ? profileInfo.education : (resumeInfo?.education || []).map(edu => ({
          degree: edu.degree || '',
          institution: edu.universityName || '',
          location: '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          gpaOrHonors: edu.description || ''
        })),
        skills: profileInfo?.skills?.languages?.length > 0 ? profileInfo.skills : {
           languages: (resumeInfo?.skills || []).map(s => typeof s === 'string' ? s : s.name),
           frameworksAndLibraries: [],
           databasesAndTools: []
        },
        certifications: profileInfo?.certifications || []
      };

      const isEmpty = !constructedProfile.personalInfo.fullName && constructedProfile.workExperience.length === 0;
      
      if (isEmpty) {
        setJsonText(JSON.stringify(DEFAULT_TEMPLATE, null, 2));
      } else {
        setJsonText(JSON.stringify(constructedProfile, null, 2));
      }
    }
  }, [profileInfo, resumeInfo, isDirty]);

  const handleChange = (e) => {
    setJsonText(e.target.value);
    setIsDirty(true);
    setError(null);
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      dispatch(updateProfileData(parsed));
      
      // Bi-directional sync back to visual forms (legacy schema)
      const [firstName = '', ...lastNames] = (parsed.personalInfo?.fullName || '').split(' ');
      const lastName = lastNames.join(' ');
      
      const legacyData = {
        ...resumeInfo,
        firstName,
        lastName,
        jobTitle: parsed.personalInfo?.targetTitle || '',
        address: parsed.personalInfo?.location || '',
        phone: parsed.personalInfo?.phone || '',
        email: parsed.personalInfo?.email || '',
        summery: parsed.professionalSummary || '',
        Experience: (parsed.workExperience || []).map(exp => ({
          title: exp.role || '',
          companyName: exp.company || '',
          city: exp.location || '',
          state: '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          currentlyWorking: exp.current || false,
          workSummery: (exp.bullets || []).join('\n')
        })),
        education: (parsed.education || []).map(edu => ({
          degree: edu.degree || '',
          major: '',
          universityName: edu.institution || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          description: edu.gpaOrHonors || ''
        })),
        skills: [
          ...(parsed.skills?.languages || []),
          ...(parsed.skills?.frameworksAndLibraries || []),
          ...(parsed.skills?.databasesAndTools || [])
        ].map(s => ({ name: s, rating: 100 }))
      };
      
      import('@/store/resumeSlice').then(mod => {
        dispatch(mod.setResumeData(legacyData));
      });

      setIsDirty(false);
      setError(null);
      toast.success("JSON data applied successfully!");
    } catch (e) {
      setError(e.message);
      toast.error("Invalid JSON format");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2 text-stitch-primary">
          <Code size={18} />
          Master Profile JSON
        </h3>
        
        <div className="flex items-center gap-2">
            {!isDirty && !error && (
                <span className="flex items-center gap-1.5 text-[12px] font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full transition-all">
                    <CheckCircle2 size={14} /> Synced
                </span>
            )}
            {error && (
                <span className="flex items-center gap-1.5 text-[12px] font-bold text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full transition-all">
                    <AlertCircle size={14} /> Invalid JSON
                </span>
            )}
        </div>
      </div>

      <p className="text-sm text-on-surface-variant">
        Edit your unified Master Profile data. Click Apply to sync changes across both your Resume and Portfolio forms.
      </p>

      <div className={`flex-1 relative border-2 rounded-xl overflow-hidden shadow-inner transition-colors duration-300 ${error ? 'border-red-500/50 bg-red-950/20' : 'border-slate-700 bg-slate-900'}`}>
        <textarea
          value={jsonText}
          onChange={handleChange}
          className="w-full h-full p-4 font-mono text-sm bg-transparent text-green-400 outline-none resize-none custom-scrollbar"
          spellCheck="false"
        />
      </div>
      
      {error && (
        <div className="p-3 bg-red-500/10 text-red-500 rounded-lg text-sm font-mono break-words border border-red-500/20">
          Error: {error}
        </div>
      )}

      <div className="flex gap-2 w-full">
        <button
          onClick={() => { setIsDirty(false); setError(null); }}
          disabled={!isDirty}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-surface-variant text-on-surface-variant rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-variant/80 transition-colors"
          title="Discard JSON changes and re-sync from visual form"
        >
          <RefreshCw size={18} />
          Sync Form
        </button>
        <button
          onClick={handleApply}
          disabled={!isDirty || !!error}
          className="flex-[2] flex items-center justify-center gap-2 py-3 bg-stitch-primary text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stitch-primary/90 transition-colors"
        >
          <Save size={18} />
          Apply Changes
        </button>
      </div>
    </div>
  );
}
