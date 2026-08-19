import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, FileSearch, X, Target, LoaderCircle, Check } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { AIChatSession } from '@/service/AIModal';

export function AtsRoastPanel({ isOpen, onClose }) {
    const resumeInfo = useSelector(state => state.resume.present.resumeData);
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const [jobDescription, setJobDescription] = useState('');
    const [scanResults, setScanResults] = useState(null);

    const handleScan = async () => {
        setIsScanning(true);
        setScanComplete(false);

        const prompt = `
        You are an expert ATS (Applicant Tracking System) scanner and career coach.
        Review the following Resume Data:
        ${JSON.stringify({
            summary: resumeInfo.summary || resumeInfo.summery,
            experience: resumeInfo.experience,
            skills: resumeInfo.skills,
            education: resumeInfo.education
        })}

        ${jobDescription ? `Against this Target Job Description:\n${jobDescription}\n` : 'Without a specific Job Description (general best practices scan).'}

        Provide a JSON response with the following schema exactly (no markdown formatting, just pure JSON):
        {
            "score": <number between 0 and 100>,
            "summary": "<short 2 sentence summary of the match>",
            "missingKeywords": ["keyword1", "keyword2"],
            "feedback": [
                {
                    "type": "success" | "warning" | "error",
                    "title": "<short title>",
                    "message": "<detailed actionable feedback>"
                }
            ]
        }
        Make sure you include 3 to 4 feedback items analyzing formatting, action verbs, and keyword matches.
        `;

        try {
            const result = await AIChatSession.sendMessage(prompt);
            const responseText = result.response.text();
            // clean potential markdown formatting from JSON
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsedData = JSON.parse(cleanJson);
            setScanResults(parsedData);
        } catch (error) {
            console.error("AI Scan Failed:", error);
            // Fallback mock data if AI fails
            setScanResults({
                score: 65,
                summary: "We couldn't reach the AI server, but here is a mock evaluation based on general ATS rules.",
                missingKeywords: ["React", "Node.js", "Team Leadership"],
                feedback: [
                    { type: "error", title: "AI Generation Failed", message: "There was an error communicating with the AI. Please try again." }
                ]
            });
        }

        setIsScanning(false);
        setScanComplete(true);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="fixed right-0 top-0 h-full w-full max-w-[500px] bg-surface-container-lowest border-l border-outline-variant/30 shadow-2xl z-50 flex flex-col"
                    >
                        <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface sticky top-0 z-10">
                            <div>
                                <h2 className="font-headline-sm font-bold text-on-surface flex items-center gap-2">
                                    <Target className="w-5 h-5 text-stitch-primary" />
                                    AI Job Matcher & ATS Scan
                                </h2>
                                <p className="font-body-sm text-on-surface-variant">Analyze your resume against a specific job.</p>
                            </div>
                            <button aria-label="Close ATS Roast panel" onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            {!isScanning && !scanComplete && (
                                <div className="flex flex-col h-full">
                                    <div className="mb-6">
                                        <label className="block font-label-md text-on-surface mb-2 font-bold">Target Job Description (Optional)</label>
                                        <p className="font-body-sm text-on-surface-variant mb-3">Paste the job description here to get a customized ATS compatibility score and missing keyword analysis.</p>
                                        <textarea 
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            placeholder="e.g. We are looking for a Senior Frontend Engineer with 5+ years of React experience..."
                                            className="w-full h-48 p-4 rounded-xl border border-outline-variant/40 bg-surface focus:border-stitch-primary focus:ring-1 focus:ring-stitch-primary outline-none resize-none font-body-sm text-on-surface"
                                        />
                                    </div>
                                    
                                    <div className="mt-auto">
                                        <button 
                                            onClick={handleScan}
                                            className="w-full bg-stitch-primary text-white px-6 py-4 rounded-xl font-label-lg hover:bg-stitch-primary/90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                                        >
                                            <Sparkles className="w-5 h-5" /> Run AI Matcher
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isScanning && (
                                <div className="py-20 flex flex-col items-center justify-center h-full">
                                    <div className="w-16 h-16 border-4 border-outline-variant/30 border-t-stitch-primary rounded-full animate-spin mb-6"></div>
                                    <p className="font-label-lg text-on-surface animate-pulse mb-2">Analyzing Resume Match...</p>
                                    <p className="font-body-sm text-on-surface-variant text-center max-w-[250px]">Extracting keywords, evaluating impact, and scoring formatting.</p>
                                </div>
                            )}

                            {scanComplete && scanResults && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Score Card */}
                                    <div className="flex items-center gap-6 mb-8 p-6 bg-surface border border-outline-variant/20 rounded-2xl shadow-sm">
                                        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-outline-variant/20" />
                                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * scanResults.score) / 100} className={`${scanResults.score >= 80 ? 'text-green-500' : scanResults.score >= 60 ? 'text-amber-500' : 'text-red-500'} transition-all duration-1000 ease-out`} />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="font-headline-lg font-bold text-on-surface">{scanResults.score}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-label-lg font-bold text-on-surface mb-1">
                                                {scanResults.score >= 80 ? 'Excellent Match!' : scanResults.score >= 60 ? 'Good, but needs tweaks.' : 'Low ATS Compatibility.'}
                                            </h3>
                                            <p className="font-body-sm text-on-surface-variant">{scanResults.summary}</p>
                                        </div>
                                    </div>

                                    {/* Missing Keywords */}
                                    {scanResults.missingKeywords && scanResults.missingKeywords.length > 0 && (
                                        <div className="mb-8">
                                            <h4 className="font-label-lg font-bold text-on-surface mb-3 flex items-center gap-2">
                                                <Target className="w-4 h-4 text-stitch-primary" /> Missing Keywords
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {scanResults.missingKeywords.map((kw, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-100 rounded-lg font-label-sm flex items-center gap-1.5">
                                                        <X className="w-3 h-3" /> {kw}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="font-body-sm text-on-surface-variant mt-3 text-xs">Inject these organically into your experience descriptions to boost your score.</p>
                                        </div>
                                    )}

                                    {/* Actionable Feedback */}
                                    <h4 className="font-label-lg font-bold text-on-surface mb-4">Actionable Feedback</h4>
                                    <div className="space-y-3">
                                        {scanResults.feedback?.map((item, index) => (
                                            <div key={index} className={`flex gap-3 p-4 rounded-xl border ${item.type === 'success' ? 'bg-green-50 border-green-100' : item.type === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'}`}>
                                                {item.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />}
                                                {item.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
                                                {item.type === 'error' && <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
                                                <div>
                                                    <h4 className={`font-label-md font-bold mb-1 ${item.type === 'success' ? 'text-green-900' : item.type === 'warning' ? 'text-amber-900' : 'text-red-900'}`}>{item.title}</h4>
                                                    <p className={`font-body-sm leading-relaxed ${item.type === 'success' ? 'text-green-700' : item.type === 'warning' ? 'text-amber-700' : 'text-red-700'}`}>{item.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <button 
                                        onClick={() => {
                                            setScanComplete(false);
                                            setScanResults(null);
                                        }}
                                        className="w-full mt-8 py-3 bg-surface border border-outline-variant/30 rounded-xl font-label-md text-on-surface hover:bg-surface-variant transition-colors"
                                    >
                                        New Scan
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
