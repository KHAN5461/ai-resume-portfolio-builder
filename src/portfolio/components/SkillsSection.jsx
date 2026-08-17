import React from 'react';
import { motion } from 'framer-motion';

export default function SkillsSection({ data }) {
  if (!data || !data.categories || data.categories.length === 0) return null;

  return (
    <section id="skills" className="w-full py-16 md:py-24 bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-100 dark:border-slate-800/50 transition-colors">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-8">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col gap-4"
      >
        <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
          {data.heading || "Technical Arsenal"}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          Tools & Technologies
        </h2>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.categories.map((category, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-6"
          >
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              {category.categoryName}
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {category.skills?.map((skill, sIdx) => (
                <span 
                  key={sIdx} 
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors cursor-default shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
}
