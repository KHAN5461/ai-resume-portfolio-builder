import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Upload, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../../auth.jsx';
import GlobalApi from '../../service/GlobalApi';
import { AIChatSession } from '../../service/AIModal';

export default function CoverLetterGenerator() {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
        GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress).then(resp => {
            setResumes(resp.data.data);
        });
    }
  }, [user]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Write a professional cover letter for the following job description:\n${jobDescription}\n\nBased on my resume details:\n${JSON.stringify({
        title: selectedResume.title,
        summary: selectedResume.summary || selectedResume.summery,
        experience: selectedResume.experience || selectedResume.Experience,
        education: selectedResume.education,
        skills: selectedResume.skills,
        firstName: selectedResume.firstName,
        lastName: selectedResume.lastName,
        email: selectedResume.email,
        phone: selectedResume.phone
      })}\n\nDo not include placeholders like [Your Name] if the information is available, use the details provided. Just return the text of the cover letter, no markdown blocks.`;
      
      const result = await AIChatSession.sendMessage(prompt);
      setCoverLetter(result.response.text());
      setStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
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
                        {resumes.length === 0 ? (
                            <p className="text-on-surface-variant">No resumes found. Please create a resume first.</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {resumes.map((resume, index) => (
                                    <button key={resume.documentId || index} onClick={() => { setSelectedResume(resume); setStep(2); }} className="flex items-center justify-between p-5 rounded-2xl border-2 border-outline-variant/30 hover:border-stitch-primary hover:bg-stitch-primary/5 transition-all group text-left">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[16px]">{resume.title || "Untitled Resume"}</h3>
                                                <p className="text-sm text-on-surface-variant line-clamp-1">{resume.summary || resume.summery || "No summary provided."}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:text-stitch-primary transition-colors shrink-0" />
                                    </button>
                                ))}
                            </div>
                        )}
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
                        <p className="text-on-surface-variant mb-6">Our AI will analyze the requirements and align your cover letter perfectly with your {selectedResume?.title} resume.</p>
                        
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
                                <button className="w-full py-3 bg-surface border border-outline-variant/30 text-on-surface rounded-xl font-bold hover:bg-surface-variant transition-colors"
                                    onClick={() => {
                                        navigator.clipboard.writeText(coverLetter);
                                        alert("Copied to clipboard!");
                                    }}
                                >
                                    Copy to Clipboard
                                </button>
                            </div>

                            <h3 className="font-bold mt-8 mb-4">AI Iteration</h3>
                            <div className="space-y-3">
                                <button onClick={async () => {
                                    setIsGenerating(true);
                                    const result = await AIChatSession.sendMessage(`Rewrite this cover letter to be more formal: ${coverLetter}`);
                                    setCoverLetter(result.response.text());
                                    setIsGenerating(false);
                                }} className="w-full py-2.5 bg-surface border border-outline-variant/30 text-on-surface rounded-lg font-medium hover:bg-surface-variant transition-colors text-sm flex items-center justify-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-500" /> Make it more formal
                                </button>
                                <button onClick={async () => {
                                    setIsGenerating(true);
                                    const result = await AIChatSession.sendMessage(`Rewrite this cover letter to be significantly shorter and concise: ${coverLetter}`);
                                    setCoverLetter(result.response.text());
                                    setIsGenerating(false);
                                }} className="w-full py-2.5 bg-surface border border-outline-variant/30 text-on-surface rounded-lg font-medium hover:bg-surface-variant transition-colors text-sm flex items-center justify-center gap-2">
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
