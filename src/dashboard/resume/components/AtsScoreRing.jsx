import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const AtsScoreRing = () => {
  const resumeInfo = useSelector(state => state.resume.resumeData);

  const calculateScore = () => {
    let score = 0;
    if (resumeInfo?.firstName || resumeInfo?.lastName) score += 10;
    if (resumeInfo?.email) score += 10;
    if (resumeInfo?.summery?.length > 50) score += 20;
    if (resumeInfo?.Experience?.length > 0) score += 30;
    if (resumeInfo?.education?.length > 0) score += 15;
    if (resumeInfo?.skills?.length > 0) score += 15;
    return Math.min(score, 100);
  };

  const score = useMemo(() => calculateScore(), [resumeInfo]);
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-full px-4 py-2 shadow-lg">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg className="w-10 h-10 transform -rotate-90">
          <circle cx="20" cy="20" r="18" className="stroke-slate-800" strokeWidth="4" fill="transparent" />
          <circle 
            cx="20" cy="20" r="18" 
            className="stroke-emerald-400 transition-all duration-1000 ease-out" 
            strokeWidth="4" fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-[10px] font-bold text-slate-50">{score}%</span>
      </div>
      <div className="flex flex-col">
        <span className="text-[12px] font-semibold text-slate-50 leading-tight">ATS Compatibility</span>
        <span className="text-[10px] text-emerald-400 leading-tight">
          {score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Work'}
        </span>
      </div>
    </div>
  );
};
