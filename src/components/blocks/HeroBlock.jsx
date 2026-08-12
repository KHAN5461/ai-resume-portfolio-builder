import React from 'react';
import { motion } from 'framer-motion';

export default function HeroBlock({ data }) {
  const headline = data?.headline || "Hi, I'm a Developer";
  const subheadline = data?.subheadline || "I build amazing things and craft beautiful digital experiences.";
  const ctaText = data?.primaryCta?.text || "Let's Talk";
  
  return (
    <div className="w-full py-24 px-6 md:px-12 flex flex-col items-center justify-center text-center bg-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl"
      >
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-6 border border-blue-100">
          Available for work
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          {headline}
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          {subheadline}
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
            {ctaText}
          </button>
          <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-medium hover:bg-slate-50 transition-colors">
            View Projects
          </button>
        </div>
      </motion.div>
    </div>
  );
}
