import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const ResumeATSScore = () => {
    const resumeData = useSelector(state => state.resume.present.resumeData);
    const resumeInfo = resumeData || {};

    const { score, tips, color } = useMemo(() => {
        let currentScore = 0;
        let currentTips = [];

        // 1. Presence of summary (10 points)
        if (resumeInfo.summery && resumeInfo.summery.trim().length > 0) {
            currentScore += 10;
        } else {
            currentTips.push("Add a professional summary to highlight your career goals.");
        }

        // 2. Presence of skills (10 points)
        if (resumeInfo.skills && resumeInfo.skills.length > 0) {
            currentScore += 10;
        } else {
            currentTips.push("Add skills relevant to the job you are applying for.");
        }

        // 3. Proper contact info (10 points)
        if ((resumeInfo.email && resumeInfo.email.trim()) || (resumeInfo.phone && resumeInfo.phone.trim())) {
            currentScore += 10;
        } else {
            currentTips.push("Include contact information (email or phone) so recruiters can reach you.");
        }

        const experiences = resumeInfo.Experience || resumeInfo.experience || [];
        
        // 4. Experience entries having description bullets (20 points)
        const hasDescriptions = experiences.some(exp => exp.workSummery && exp.workSummery.trim().length > 0);
        if (hasDescriptions) {
            currentScore += 20;
        } else if (experiences.length > 0) {
            currentTips.push("Add detailed descriptions or bullet points to your experience entries.");
        } else {
            currentTips.push("Add your work experience to show your professional background.");
        }

        // 5. Use of strong action verbs in experience bullets (50 points)
        const actionVerbs = ['managed', 'developed', 'led', 'created', 'designed', 'improved', 'increased', 'reduced', 'implemented', 'achieved', 'coordinated', 'analyzed', 'delivered', 'built', 'directed'];
        let verbCount = 0;

        experiences.forEach(exp => {
            if (exp.workSummery) {
                const lowerSummary = exp.workSummery.toLowerCase();
                actionVerbs.forEach(verb => {
                    if (lowerSummary.includes(verb)) {
                        verbCount++;
                    }
                });
            }
        });

        // Max 50 points from strong verbs
        const verbPoints = Math.min(50, verbCount * 10);
        currentScore += verbPoints;
        
        if (verbPoints < 50) {
            currentTips.push("Use more strong action verbs (e.g., 'managed', 'developed', 'led', 'improved') in your experience descriptions.");
        }

        let circleColor = "stroke-green-500";
        let textColor = "text-green-500";
        if (currentScore < 50) {
            circleColor = "stroke-red-500";
            textColor = "text-red-500";
        } else if (currentScore < 80) {
            circleColor = "stroke-yellow-500";
            textColor = "text-yellow-500";
        }

        return { score: currentScore, tips: currentTips, color: circleColor, textColor };
    }, [resumeData]);

    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center gap-6 w-full max-w-sm mx-auto">
            <h3 className="font-headline-sm font-bold text-on-surface w-full text-left">ATS Score Analyzer</h3>
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="40" className="stroke-outline-variant/20" strokeWidth="8" fill="transparent" />
                    <circle 
                        cx="64" cy="64" r="40" 
                        className={`${color} transition-all duration-1000 ease-out`}
                        strokeWidth="8" fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${color.replace('stroke-', 'text-')}`}>{score}</span>
                    <span className="text-sm text-on-surface-variant font-medium">/ 100</span>
                </div>
            </div>
            
            {tips.length > 0 ? (
                <div className="w-full mt-2">
                    <h4 className="font-label-md font-semibold text-on-surface mb-3">Actionable Tips:</h4>
                    <ul className="flex flex-col gap-3">
                        {tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-on-surface-variant bg-surface-variant/30 p-3 rounded-lg flex items-start gap-3 border border-outline-variant/10">
                                <span className="material-symbols-outlined text-[18px] text-yellow-500 mt-0.5 shrink-0">lightbulb</span>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="w-full mt-2 text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20 text-green-700 text-sm font-medium">
                    Excellent! Your resume is highly optimized for ATS systems.
                </div>
            )}
        </div>
    );
};
