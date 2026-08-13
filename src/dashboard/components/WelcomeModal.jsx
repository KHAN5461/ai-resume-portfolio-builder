import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, FileSearch, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Check if user has seen this
        const hasSeenTour = localStorage.getItem('sparkfolio_tour_seen');
        if (!hasSeenTour) {
            // Add a small delay for a dramatic entrance
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('sparkfolio_tour_seen', 'true');
    };

    const nextStep = () => {
        if (step < 2) setStep(step + 1);
        else handleClose();
    };

    const steps = [
        {
            icon: <Sparkles className="w-12 h-12 text-stitch-primary mb-4" />,
            title: "Welcome to Sparkfolio",
            description: "Build your dream resume in minutes. Use our Magic Import tool to instantly convert your LinkedIn profile into a beautiful, ATS-friendly document."
        },
        {
            icon: <FileSearch className="w-12 h-12 text-stitch-primary mb-4" />,
            title: "The ATS Roast Panel",
            description: "Don't guess if your resume is good. Our built-in ATS checker will analyze your keywords and formatting in real-time, giving you actionable feedback."
        },
        {
            icon: <Download className="w-12 h-12 text-stitch-primary mb-4" />,
            title: "Premium Exports",
            description: "When you're ready, launch your resume. Download pixel-perfect PDFs or share a live link with recruiters instantly."
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                        onClick={handleClose}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-surface-container-lowest rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-8 pb-10 flex flex-col items-center text-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="w-24 h-24 bg-stitch-primary/10 rounded-full flex items-center justify-center mb-6">
                                            {steps[step].icon}
                                        </div>
                                        <h2 className="text-2xl font-bold font-headline-sm text-on-surface mb-4">
                                            {steps[step].title}
                                        </h2>
                                        <p className="text-on-surface-variant font-body-md leading-relaxed">
                                            {steps[step].description}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>

                                <div className="flex gap-2 mt-8 mb-8">
                                    {[0, 1, 2].map((i) => (
                                        <div 
                                            key={i} 
                                            className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-stitch-primary' : 'w-2 bg-outline-variant/30'}`}
                                        />
                                    ))}
                                </div>

                                <Button 
                                    onClick={nextStep}
                                    className="w-full h-12 bg-stitch-primary hover:bg-stitch-primary/90 text-white rounded-xl font-label-md text-base"
                                >
                                    {step === 2 ? "Get Started" : "Next"}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
