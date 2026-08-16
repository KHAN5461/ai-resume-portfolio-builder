import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const LOADING_STEPS = [
  "Parsing developer profile & prompt intent...",
  "Selecting optimal UI template matrix...",
  "Generating structured JSON layout...",
  "Assembling responsive canvas components...",
  "Applying final polish & design tokens..."
];

// Blueprint wireframe block configs for the shimmer animation
const BLUEPRINT_BLOCKS = [
  { label: 'Navigation', width: 'w-full', height: 'h-6' },
  { label: 'Hero Block', width: 'w-full', height: 'h-20' },
  { label: 'Grid Section', width: 'w-full', height: 'h-14', isGrid: true },
  { label: 'Footer', width: 'w-full', height: 'h-6' },
];

export default function GenerativeCanvasLoader() {
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleBlocks, setVisibleBlocks] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(stepInterval);
  }, []);

  // Sequentially reveal blueprint blocks
  useEffect(() => {
    const blockInterval = setInterval(() => {
      setVisibleBlocks((prev) => (prev < BLUEPRINT_BLOCKS.length ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(blockInterval);
  }, []);

  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-center p-6">

      {/* Pulsing Aura */}
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/50 text-white">
          <Sparkles size={28} className="animate-[spin_3s_linear_infinite]" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-white tracking-wide mb-2">Synthesizing Canvas</h2>

      {/* Step Cycle Text */}
      <div className="h-6 overflow-hidden relative mb-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-mono text-indigo-400 absolute inset-0 flex items-center justify-center"
          >
            {LOADING_STEPS[currentStep]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Interactive Blueprint Shimmer */}
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 p-5 flex flex-col gap-3 shadow-inner">
        {BLUEPRINT_BLOCKS.map((block, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0.05 }}
            animate={{ opacity: idx < visibleBlocks ? 0.6 : 0.05 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            {block.isGrid ? (
              <div className="grid grid-cols-3 gap-2">
                <div className="h-12 bg-slate-800/40 rounded-lg animate-pulse" />
                <div className="h-12 bg-slate-800/40 rounded-lg animate-pulse delay-75" />
                <div className="h-12 bg-slate-800/40 rounded-lg animate-pulse delay-150" />
              </div>
            ) : (
              <div className={`${block.width} ${block.height} bg-slate-800/40 rounded-lg animate-pulse flex items-center justify-center`}>
                <span className="text-[10px] text-slate-600 font-mono">{block.label}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

    </div>
  );
}
