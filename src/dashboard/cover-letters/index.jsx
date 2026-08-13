import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Upload, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CoverLetterGenerator() {
  const [step, setStep] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI Generation
    setTimeout(() => {
      setIsGenerating(false);
      setCoverLetter(`Dear Hiring Manager,\n\nI am thrilled to apply for this position. With over 8 years of experience in product design and a proven track record of increasing user retention by 25% at Tech Innovators Inc., I am confident in my ability to deliver outstanding results for your team.\n\nMy expertise in Figma and React aligns perfectly with your requirements. I would welcome the opportunity to discuss how my unique blend of technical and creative skills can contribute to your continued success.\n\nSincerely,\nJane Doe`);
      setStep(3);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-stitch-primary/10 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full flex flex-col h-full z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
            <div>
                <h1 className="text-3xl md:text-4xl font-headline-lg font-bold mb-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stitch-primary to-purple-600 text-white flex items-center justify-center shadow-lg">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    AI Cover Letter
                </h1>
                <p className="text-on-surface-variant font-body-lg">Generate a perfectly tailored cover letter in seconds.</p>
            </div>
            <Link to="/dashboard" className="px-4 py-2 bg-surface-variant text-on-surface rounded-full font-label-md hover:bg-outline-variant/30 transition-colors">
                Back to Dashboard
            </Link>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-4 mb-12 max-w-2xl">
            <div className={`flex flex-col gap-2 flex-1 relative ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-full h-2 rounded-full ${step >= 1 ? 'bg-stitch-primary' : 'bg-surface-variant'}`}></div>
                <span className="font-label-sm font-bold text-stitch-primary">1. Select Resume</span>
            </div>
            <div className={`flex flex-col gap-2 flex-1 relative ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-full h-2 rounded-full ${step >= 2 ? 'bg-stitch-primary' : 'bg-surface-variant'}`}></div>
                <span className={`font-label-sm font-bold ${step >= 2 ? 'text-stitch-primary' : 'text-on-surface-variant'}`}>2. Job Details</span>
            </div>
            <div className={`flex flex-col gap-2 flex-1 relative ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-full h-2 rounded-full ${step >= 3 ? 'bg-stitch-primary' : 'bg-surface-variant'}`}></div>
                <span className={`font-label-sm font-bold ${step >= 3 ? 'text-stitch-primary' : 'text-on-surface-variant'}`}>3. Review</span>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-surface border border-outline-variant/30 rounded-3xl p-8 shadow-sm max-w-2xl"
                    >
                        <h2 className="text-xl font-bold mb-6">Which resume should we base this on?</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <button onClick={() => setStep(2)} className="flex items-center justify-between p-5 rounded-2xl border-2 border-outline-variant/30 hover:border-stitch-primary hover:bg-stitch-primary/5 transition-all group text-left">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[16px]">Senior Designer Role</h3>
                                        <p className="text-sm text-on-surface-variant">Last updated 2 days ago</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:text-stitch-primary transition-colors" />
                            </button>
                            <button onClick={() => setStep(2)} className="flex items-center justify-between p-5 rounded-2xl border-2 border-outline-variant/30 hover:border-stitch-primary hover:bg-stitch-primary/5 transition-all group text-left">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[16px]">Tech Lead Fallback</h3>
                                        <p className="text-sm text-on-surface-variant">Last updated 1 week ago</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:text-stitch-primary transition-colors" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-surface border border-outline-variant/30 rounded-3xl p-8 shadow-sm max-w-2xl"
                    >
                        <h2 className="text-xl font-bold mb-2">Paste the Job Description</h2>
                        <p className="text-on-surface-variant mb-6">Our AI will analyze the requirements and align your cover letter perfectly.</p>
                        
                        <textarea 
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="We are looking for a Senior Product Designer with experience in Figma, React..."
                            className="w-full h-64 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 mb-6 focus:outline-none focus:ring-2 focus:ring-stitch-primary resize-none custom-scrollbar text-on-surface"
                        />

                        <div className="flex justify-between items-center">
                            <button onClick={() => setStep(1)} className="text-on-surface-variant font-medium hover:text-on-surface px-4 py-2">Back</button>
                            
                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating || !jobDescription.trim()}
                                className="px-8 py-3 bg-gradient-to-r from-stitch-primary to-purple-600 text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                {isGenerating ? (
                                    <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div> Generating Magic...</>
                                ) : (
                                    <><Sparkles className="w-4 h-4" /> Generate Cover Letter</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col lg:flex-row gap-8 h-full"
                    >
                        {/* Editor Area */}
                        <div className="flex-1 bg-surface border border-outline-variant/30 rounded-3xl p-8 shadow-sm flex flex-col">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="w-6 h-6" /> Generated Successfully
                            </h2>
                            <textarea 
                                value={coverLetter || ''}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                className="flex-1 w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 focus:outline-none focus:ring-1 focus:ring-stitch-primary resize-none custom-scrollbar text-on-surface leading-relaxed text-lg"
                            />
                        </div>

                        {/* Actions Panel */}
                        <div className="w-full lg:w-80 bg-surface-container-low rounded-3xl p-6 border border-outline-variant/30 h-fit">
                            <h3 className="font-bold mb-4">Export Options</h3>
                            <div className="space-y-3">
                                <button className="w-full py-3 bg-stitch-primary text-white rounded-xl font-bold hover:bg-stitch-primary/90 transition-colors shadow-sm">
                                    Download as PDF
                                </button>
                                <button className="w-full py-3 bg-surface border border-outline-variant/30 text-on-surface rounded-xl font-bold hover:bg-surface-variant transition-colors">
                                    Copy to Clipboard
                                </button>
                            </div>

                            <h3 className="font-bold mt-8 mb-4">AI Iteration</h3>
                            <div className="space-y-3">
                                <button className="w-full py-2.5 bg-surface border border-outline-variant/30 text-on-surface rounded-lg font-medium hover:bg-surface-variant transition-colors text-sm flex items-center justify-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-500" /> Make it more formal
                                </button>
                                <button className="w-full py-2.5 bg-surface border border-outline-variant/30 text-on-surface rounded-lg font-medium hover:bg-surface-variant transition-colors text-sm flex items-center justify-center gap-2">
                                    <Sparkles className="w-4 h-4 text-blue-500" /> Make it shorter
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
