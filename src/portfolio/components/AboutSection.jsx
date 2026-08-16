import React from 'react';
import { motion } from 'framer-motion';

export default function AboutSection({ data }) {
  if (!data) return null;

  return (
    <section id="about" className="w-full max-w-6xl mx-auto px-6 md:px-8 py-24 bg-white dark:bg-slate-950">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
        
        {/* Left Column: Typography & Narrative */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="md:col-span-7 flex flex-col gap-8"
        >
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              {data.bioTitle || "About Me"}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              {data.heading || "Bridging design and engineering."}
            </h1>
          </div>
          
          <div className="text-lg text-slate-600 dark:text-slate-400 flex flex-col gap-6 max-w-3xl leading-relaxed">
            {data.bioDescription ? (
               data.bioDescription.split('\\n').map((paragraph, idx) => (
                 <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
               ))
            ) : (
               <>
                 <p>
                    I am a multidisciplinary product designer and front-end developer focused on creating intuitive, high-performance digital experiences. With a background rooted in both visual communication and computer science, I approach problem-solving from a holistic perspective.
                 </p>
                 <p>
                    Over the past decade, I have collaborated with early-stage startups and global enterprises to build design systems, streamline complex workflows, and launch products that resonate with users.
                 </p>
               </>
            )}
          </div>

          <div className="pt-4">
            <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-slate-900 dark:hover:text-white transition-colors group">
              Get In Touch
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Right Column: Visuals & Stats */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:col-span-5 flex flex-col gap-8"
        >
          {data.profileImage && (
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <img 
                src={data.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover filter grayscale-[20%] hover:grayscale-0 transition-all duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
            </div>
          )}

          {data.stats && data.stats.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {data.stats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className={`p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all duration-200 flex flex-col gap-2 ${idx === 2 ? 'col-span-2 bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-500/30' : ''}`}
                >
                  <span className={`text-3xl font-bold ${idx === 2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                    {stat.value}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
