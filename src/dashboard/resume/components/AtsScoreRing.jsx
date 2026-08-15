import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { calculateLocalAtsScore } from '@/lib/atsCalculator';

export const AtsScoreRing = () => {
  const resumeInfo = useSelector(state => state.resume.resumeData);

  const { score, missingKeywords } = useMemo(() => calculateLocalAtsScore(resumeInfo), [resumeInfo]);
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col gap-2">
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
      
      {missingKeywords && missingKeywords.length > 0 && (
        <div className="flex flex-col gap-1 px-2 transition-all duration-500 ease-in-out">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Missing Keywords</span>
          <div className="flex flex-wrap gap-1">
            {missingKeywords.map(kw => (
              <span key={kw} className="text-[9px] px-1.5 py-0.5 rounded border border-dashed border-red-500/30 bg-red-500/10 text-red-400 transition-all duration-300">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
