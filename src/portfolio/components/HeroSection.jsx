import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection({ data }) {
  if (!data) return null;

  return (
    <section id="hero" className="w-full max-w-6xl mx-auto px-6 md:px-8 py-24 flex flex-col items-start justify-center text-left gap-8 bg-white dark:bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col gap-4 max-w-[800px]"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-indigo-600 dark:text-indigo-400 tracking-tight">
            {data.subheadline || "Senior Product Designer"}
        </h2>
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tighter leading-tight font-sans">
            {data.headline || "Designing Digital Experiences"}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mt-4 max-w-[600px] leading-relaxed">
            {data.shortBio || "I help early-stage startups and enterprise teams build functional, beautiful products that scale. My approach combines systematic thinking with high-end visual execution to deliver interfaces that feel as good as they look."}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="flex flex-col sm:flex-row items-center gap-4 mt-6 w-full sm:w-auto"
      >
        {data.primaryCta && (
          <a 
            href={data.primaryCta.link || "#projects"}
            className="bg-indigo-600 text-white font-medium px-8 py-4 rounded-full hover:scale-95 hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center w-full sm:w-auto shadow-sm"
          >
            {data.primaryCta.text || "View My Work"}
          </a>
        )}
        {data.secondaryCta && (
          <a 
            href={data.secondaryCta.link || "#contact"}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium px-8 py-4 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex items-center justify-center w-full sm:w-auto"
          >
            {data.secondaryCta.text || "Contact Me"}
          </a>
        )}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-full"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
        <span className="text-xs font-mono font-medium text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
            Available for freelance opportunities
        </span>
      </motion.div>
    </section>
  );
}
