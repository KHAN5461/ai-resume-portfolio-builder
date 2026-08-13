import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function HeroAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto h-[400px] bg-surface-container-low rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden mt-12 md:mt-0">
      {/* Fake Header */}
      <div className="h-8 border-b border-outline-variant/30 bg-surface-container-lowest flex items-center px-4 gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
      </div>
      
      {/* Editor layout */}
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-[120px] bg-surface border-r border-outline-variant/30 p-4">
          <div className="h-4 w-full bg-outline-variant/20 rounded mb-4"></div>
          <div className={`h-8 w-full rounded mb-2 transition-colors ${step >= 0 ? 'bg-stitch-primary/20' : 'bg-outline-variant/10'}`}></div>
          <div className={`h-8 w-full rounded mb-2 transition-colors ${step >= 1 ? 'bg-stitch-primary/20' : 'bg-outline-variant/10'}`}></div>
          <div className={`h-8 w-full rounded mb-2 transition-colors ${step >= 2 ? 'bg-stitch-primary/20' : 'bg-outline-variant/10'}`}></div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-6 relative bg-surface-container-lowest">
          <motion.div 
            className="w-full h-full bg-white shadow-sm border border-outline-variant/20 p-4 relative overflow-hidden"
            animate={{ 
                rotateY: step === 3 ? 15 : 0, 
                rotateX: step === 3 ? 10 : 0,
                scale: step === 3 ? 1.05 : 1 
            }}
            transition={{ duration: 0.5 }}
          >
             {/* Name */}
             <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: step >= 0 ? '60%' : '0%' }}
                className="h-6 bg-stitch-primary/40 rounded mb-4"
             />
             
             {/* Info */}
             <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: step >= 0 ? '80%' : '0%' }}
                className="h-3 bg-outline-variant/30 rounded mb-6"
             />

             {/* Experience Block */}
             <div className="mb-4">
                 <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: step >= 1 ? '40%' : '0%' }}
                    className="h-4 bg-outline-variant/50 rounded mb-2"
                 />
                 <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: step >= 1 ? '100%' : '0%' }}
                    className="h-2 bg-outline-variant/20 rounded mb-1"
                 />
                 <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: step >= 1 ? '90%' : '0%' }}
                    className="h-2 bg-outline-variant/20 rounded mb-1"
                 />
                 <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: step >= 1 ? '95%' : '0%' }}
                    className="h-2 bg-outline-variant/20 rounded"
                 />
             </div>

             {/* Skills Block */}
             <div className="flex gap-2">
                 <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: step >= 2 ? 1 : 0 }}
                    className="h-6 w-16 bg-stitch-primary/20 rounded-full"
                 />
                 <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: step >= 2 ? 1 : 0 }}
                    transition={{ delay: 0.1 }}
                    className="h-6 w-20 bg-stitch-primary/20 rounded-full"
                 />
                 <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: step >= 2 ? 1 : 0 }}
                    transition={{ delay: 0.2 }}
                    className="h-6 w-14 bg-stitch-primary/20 rounded-full"
                 />
             </div>

             <AnimatePresence>
                {step === 3 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10"
                    >
                        <div className="bg-green-500 text-white font-bold py-2 px-4 rounded-xl shadow-lg flex items-center gap-2">
                            <span className="material-symbols-outlined">check_circle</span>
                            ATS Score: 98%
                        </div>
                    </motion.div>
                )}
             </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
