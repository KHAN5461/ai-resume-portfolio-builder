import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AIChatSession } from '../../../service/AIModal';
import { Loader2, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, ListMinus, Sparkles } from 'lucide-react';

const ATS_PROMPT = `You are an advanced, strict ATS evaluation matrix. Analyze the following resume data and provide a strict JSON response containing:
- ats_readability_score (number 0-100)
- keyword_match_score (number 0-100)
- formatting_violations (array of strings)
- missing_critical_keywords (array of strings)
- improvement_action_plan (array of strings)

Do not include any other text besides the JSON.

Resume Data: `;

const ProgressCircle = ({ score, label }) => {
    let circleColor = "stroke-green-500";
    let textColor = "text-green-500";
    if (score < 50) {
        circleColor = "stroke-red-500";
        textColor = "text-red-500";
    } else if (score < 80) {
        circleColor = "stroke-yellow-500";
        textColor = "text-yellow-500";
    }

    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="40" className="stroke-outline-variant/20" strokeWidth="8" fill="transparent" />
                    <circle 
                        cx="56" cy="56" r="40" 
                        className={`${circleColor} transition-all duration-1000 ease-out`}
                        strokeWidth="8" fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className={`text-2xl font-bold ${textColor}`}>{score}</span>
                </div>
            </div>
            <span className="text-xs font-semibold text-on-surface-variant text-center">{label}</span>
        </div>
    );
};

const AccordionItem = ({ title, items, icon: Icon, colorClass }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    if (!items || items.length === 0) return null;

    return (
        <div className="border border-outline-variant/20 rounded-lg mb-3 overflow-hidden bg-surface">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-variant/10 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${colorClass}`} />
                    <span className="font-semibold text-on-surface text-sm">{title}</span>
                    <span className="bg-surface-variant/30 text-xs py-0.5 px-2 rounded-full font-medium">
                        {items.length}
                    </span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-on-surface-variant" /> : <ChevronDown className="w-4 h-4 text-on-surface-variant" />}
            </button>
            
            {isOpen && (
                <div className="p-4 pt-0 border-t border-outline-variant/10 bg-surface-variant/5">
                    <ul className="flex flex-col gap-2 mt-3">
                        {items.map((item, idx) => (
                            <li key={idx} className="text-sm text-on-surface-variant flex items-start gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${colorClass.replace('text-', 'bg-')}`} />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export const ResumeATSScore = () => {
    const resumeData = useSelector(state => state.resume.present.resumeData);
    
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [atsReport, setAtsReport] = useState(null);
    const [error, setError] = useState(null);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setError(null);
        try {
            const prompt = ATS_PROMPT + JSON.stringify(resumeData || {});
            const result = await AIChatSession.sendMessage(prompt);
            let responseText = result.response.text();
            
            // Clean up potentially wrapped markdown JSON
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            
            const parsed = JSON.parse(responseText);
            setAtsReport(parsed);
        } catch (err) {
            console.error("ATS Analysis failed:", err);
            setError("Failed to analyze resume. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-6 w-full max-w-lg mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-headline-sm font-bold text-on-surface">AI ATS Analyzer</h3>
                    <p className="text-sm text-on-surface-variant mt-1">Get an instant AI evaluation of your resume's ATS compatibility.</p>
                </div>
            </div>

            {!atsReport && !isAnalyzing && (
                <button 
                    onClick={handleAnalyze}
                    className="w-full py-3 px-4 bg-primary text-on-primary rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
                >
                    <Sparkles className="w-5 h-5" />
                    Analyze with AI ATS
                </button>
            )}

            {isAnalyzing && (
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-on-surface-variant font-medium animate-pulse">Our AI is analyzing your resume...</p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                    <button 
                        onClick={handleAnalyze}
                        className="ml-auto text-xs font-bold text-red-700 hover:underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {atsReport && !isAnalyzing && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-center gap-8 p-4 bg-surface-variant/10 rounded-xl border border-outline-variant/20">
                        <ProgressCircle 
                            score={atsReport.ats_readability_score || 0} 
                            label="Readability" 
                        />
                        <ProgressCircle 
                            score={atsReport.keyword_match_score || 0} 
                            label="Keyword Match" 
                        />
                    </div>

                    <div className="flex flex-col">
                        <h4 className="text-sm font-bold text-on-surface mb-3 uppercase tracking-wider">Detailed Analysis</h4>
                        
                        <AccordionItem 
                            title="Formatting Violations" 
                            items={atsReport.formatting_violations} 
                            icon={AlertCircle}
                            colorClass="text-red-500"
                        />
                        
                        <AccordionItem 
                            title="Missing Critical Keywords" 
                            items={atsReport.missing_critical_keywords} 
                            icon={ListMinus}
                            colorClass="text-yellow-500"
                        />
                        
                        <AccordionItem 
                            title="Improvement Action Plan" 
                            items={atsReport.improvement_action_plan} 
                            icon={CheckCircle2}
                            colorClass="text-green-500"
                        />
                        
                        {(!atsReport.formatting_violations?.length && !atsReport.missing_critical_keywords?.length) && (
                            <div className="w-full text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20 text-green-700 text-sm font-medium flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                Excellent! Your resume is highly optimized for ATS systems.
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={handleAnalyze}
                        className="w-full py-2 px-4 bg-surface-variant/20 text-on-surface rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-surface-variant/40 transition-colors border border-outline-variant/20"
                    >
                        <Sparkles className="w-4 h-4" />
                        Re-analyze
                    </button>
                </div>
            )}
        </div>
    );
};
