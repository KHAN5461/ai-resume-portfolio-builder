import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfileData } from '@/store/profileSlice';
import { Code, CheckCircle2, AlertCircle, Save } from 'lucide-react';
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
  const dispatch = useDispatch();
  
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize the text box with the profileInfo, or the DEFAULT_TEMPLATE if it's completely empty
  useEffect(() => {
    if (!isDirty) {
      // Check if profileInfo is effectively empty
      const isEmpty = !profileInfo.personalInfo?.fullName && 
                      (!profileInfo.workExperience || profileInfo.workExperience.length === 0);
      
      if (isEmpty) {
        setJsonText(JSON.stringify(DEFAULT_TEMPLATE, null, 2));
      } else {
        // We only want to show the relevant keys for the Master Profile
        const filteredProfile = {
            personalInfo: profileInfo.personalInfo || {},
            professionalSummary: profileInfo.professionalSummary || '',
            workExperience: profileInfo.workExperience || [],
            projects: profileInfo.projects || [],
            education: profileInfo.education || [],
            skills: profileInfo.skills || { languages: [], frameworksAndLibraries: [], databasesAndTools: [] },
            certifications: profileInfo.certifications || []
        };
        setJsonText(JSON.stringify(filteredProfile, null, 2));
      }
    }
  }, [profileInfo, isDirty]);

  const handleChange = (e) => {
    setJsonText(e.target.value);
    setIsDirty(true);
    setError(null);
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      dispatch(updateProfileData(parsed));
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

      <button
        onClick={handleApply}
        disabled={!isDirty || !!error}
        className="flex items-center justify-center gap-2 w-full py-3 bg-stitch-primary text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stitch-primary/90 transition-colors"
      >
        <Save size={18} />
        Apply Changes
      </button>
    </div>
  );
}
