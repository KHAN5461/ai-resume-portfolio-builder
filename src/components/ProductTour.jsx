import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const TOUR_STEPS = [
    {
        id: 'cmd-k',
        target: 'body', // We'll just show it centered
        title: 'Meet your new superpower',
        content: 'Press Cmd/Ctrl + K anywhere in the app to instantly search, navigate, or create new documents without touching your mouse.',
        position: 'center'
    },
    {
        id: 'magic-import',
        target: '#tour-magic-import',
        title: 'Magic Import',
        content: 'Import your existing LinkedIn profile or old PDF resume and let our AI instantly format it into a stunning document.',
        position: 'bottom'
    },
    {
        id: 'folders',
        target: '#tour-folders',
        title: 'Organize like a Pro',
        content: 'Keep your tailored resumes organized by industry, job type, or status using the new folder system.',
        position: 'right'
    }
];

export function ProductTour() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Only show on dashboard and if they haven't seen it
        const hasSeenTour = localStorage.getItem('hasSeenProductTourV8');
        if (!hasSeenTour && location.pathname === '/dashboard') {
            // Slight delay so the page loads first
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [location]);

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('hasSeenProductTourV8', 'true');
    };

    if (!isVisible) return null;

    const step = TOUR_STEPS[currentStep];

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto"
                    />

                    {/* Tooltip Dialog */}
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="relative z-10 w-full max-w-sm bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden pointer-events-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-headline-sm font-bold text-on-surface text-lg">{step.title}</h3>
                                <button onClick={handleClose} className="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 p-1 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="font-body-md text-on-surface-variant mb-8 leading-relaxed">
                                {step.content}
                            </p>
                            
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex gap-1.5">
                                    {TOUR_STEPS.map((s, idx) => (
                                        <div 
                                            key={s.id} 
                                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-4 bg-stitch-primary' : 'w-1.5 bg-outline-variant/50'}`}
                                        />
                                    ))}
                                </div>
                                
                                <button 
                                    onClick={handleNext}
                                    className="flex items-center gap-2 bg-stitch-primary text-white px-5 py-2.5 rounded-xl font-label-md hover:bg-stitch-primary/90 active:scale-95 transition-all shadow-md"
                                >
                                    {currentStep === TOUR_STEPS.length - 1 ? (
                                        <>Got it <Check className="w-4 h-4" /></>
                                    ) : (
                                        <>Next <ChevronRight className="w-4 h-4" /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
