import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, FileSearch, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

export function AtsRoastPanel({ isOpen, onClose }) {
    const resumeInfo = useSelector(state => state.resume.resumeData);
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);

    // Dummy logic for demo purposes
    const score = 78;
    
    const handleScan = () => {
        setIsScanning(true);
        setScanComplete(false);
        setTimeout(() => {
            setIsScanning(false);
            setScanComplete(true);
        }, 2000);
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
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-surface-container-lowest border-l border-outline-variant/30 shadow-2xl z-50 flex flex-col"
                    >
                        <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface sticky top-0 z-10">
                            <div>
                                <h2 className="font-headline-sm font-bold text-on-surface flex items-center gap-2">
                                    <FileSearch className="w-5 h-5 text-stitch-primary" />
                                    ATS Resume Checker
                                </h2>
                                <p className="font-body-sm text-on-surface-variant">Analyze your resume against ATS systems.</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            {!isScanning && !scanComplete && (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-20 h-20 bg-stitch-primary/10 rounded-full flex items-center justify-center mb-6">
                                        <FileSearch className="w-10 h-10 text-stitch-primary" />
                                    </div>
                                    <h3 className="font-headline-sm font-bold text-on-surface mb-2">Ready to Scan?</h3>
                                    <p className="font-body-sm text-on-surface-variant mb-8 max-w-xs">We'll analyze your resume's formatting, keywords, and action verbs against standard ATS algorithms.</p>
                                    <button 
                                        onClick={handleScan}
                                        className="bg-stitch-primary text-white px-6 py-3 rounded-xl font-label-lg hover:bg-stitch-primary/90 transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                                    >
                                        <Sparkles className="w-5 h-5" /> Run ATS Scan
                                    </button>
                                </div>
                            )}

                            {isScanning && (
                                <div className="py-20 flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 border-4 border-outline-variant/30 border-t-stitch-primary rounded-full animate-spin mb-6"></div>
                                    <p className="font-label-lg text-on-surface animate-pulse mb-2">Analyzing Resume...</p>
                                    <p className="font-body-sm text-on-surface-variant">Checking keywords and formatting</p>
                                </div>
                            )}

                            {scanComplete && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-6 mb-8 p-6 bg-surface border border-outline-variant/20 rounded-2xl shadow-sm">
                                        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-outline-variant/20" />
                                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * score) / 100} className="text-stitch-primary transition-all duration-1000 ease-out" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="font-headline-lg font-bold text-on-surface">{score}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-label-lg font-bold text-on-surface mb-1">Good, but needs work.</h3>
                                            <p className="font-body-sm text-on-surface-variant">Your resume passes basic ATS parsing, but lacks strong quantifiable metrics.</p>
                                        </div>
                                    </div>

                                    <h4 className="font-label-lg font-bold text-on-surface mb-4">Actionable Feedback</h4>
                                    <div className="space-y-3">
                                        <div className="flex gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-label-md font-bold text-green-900 mb-1">Formatting Passed</h4>
                                                <p className="font-body-sm text-green-700 leading-relaxed">No complex tables or columns detected. ATS can read your text sequentially.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-label-md font-bold text-amber-900 mb-1">Missing Quantifiable Metrics</h4>
                                                <p className="font-body-sm text-amber-700 leading-relaxed">Only 1 of your experience bullets includes numbers (e.g., % increase, $ saved). Add more metrics to stand out.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                                            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-label-md font-bold text-red-900 mb-1">Weak Action Verbs</h4>
                                                <p className="font-body-sm text-red-700 leading-relaxed">Avoid using "Responsible for" or "Helped with". Use strong verbs like "Spearheaded", "Engineered", or "Orchestrated".</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => {
                                            setScanComplete(false);
                                            handleScan();
                                        }}
                                        className="w-full mt-8 py-3 bg-surface border border-outline-variant/30 rounded-xl font-label-md text-on-surface hover:bg-surface-variant transition-colors"
                                    >
                                        Re-scan Resume
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
