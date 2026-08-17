import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ExternalLink, MapPin, User, FileText } from 'lucide-react';

export default function BentoTemplate({ portfolioData }) {
  if (!portfolioData) return null;
  const { 
    heroSection = {}, 
    aboutSection = {}, 
    projectsSection = [], 
    skillsSection = {},
    contactSection = {} 
  } = portfolioData;

  // Flatten skills from categories
  const flatSkills = skillsSection?.categories?.flatMap(c => c.skills) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] dark:bg-slate-950 p-4 md:p-8 lg:p-12 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]"
      >
        {/* Intro Box (Large) */}
        <motion.div id="hero" variants={itemVariants} className="md:col-span-2 lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm flex flex-col justify-center border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 relative z-10 text-slate-900 dark:text-white">
            {heroSection.greeting || "Hi there 👋"}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-6 font-medium relative z-10">
            {heroSection.headline || 'Product Designer & Developer'}
          </p>
          <p className="text-slate-500 dark:text-slate-400 max-w-md relative z-10 leading-relaxed">
            {heroSection.subheadline || 'I build digital experiences that are beautiful, accessible, and high-performing.'}
          </p>
        </motion.div>

        {/* Profile / Decorative Photo */}
        <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-1 bg-white dark:bg-slate-900 rounded-[2rem] p-2 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center hover:scale-[1.02] transition-transform">
          <div className="w-full h-full rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 overflow-hidden relative flex items-center justify-center">
            {contactSection.email ? (
               <div className="text-6xl font-black text-slate-300 dark:text-slate-600">
                  {heroSection.greeting?.substring(0, 1) || 'A'}
               </div>
            ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[var(--accent)] to-purple-400 opacity-20 dark:opacity-40"></div>
            )}
          </div>
        </motion.div>

        {/* Contact/Social Box */}
        <motion.div id="contact" variants={itemVariants} className="md:col-span-1 lg:col-span-1 bg-[var(--accent)] rounded-[2rem] p-6 shadow-md text-white flex flex-col justify-between hover:scale-[1.02] transition-transform">
          <div>
            <h3 className="text-xl font-bold mb-4">{contactSection.heading || "Let's Connect"}</h3>
            <div className="flex flex-col gap-3">
              {contactSection.email && (
                <a href={`mailto:${contactSection.email}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm font-medium truncate">{contactSection.email}</span>
                </a>
              )}
              {contactSection.subheading && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-medium opacity-90">{contactSection.subheading}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"><Github className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm"><Twitter className="w-5 h-5" /></a>
          </div>
        </motion.div>

        {/* Featured Project */}
        {projectsSection.length > 0 && (
          <motion.div id="projects" variants={itemVariants} className="md:col-span-2 lg:col-span-2 bg-slate-900 rounded-[2rem] p-8 shadow-sm text-white flex flex-col justify-between hover:shadow-xl transition-shadow group relative overflow-hidden border border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-slate-900/40 z-10"></div>
            {projectsSection[0].thumbnailUrl && <img src={projectsSection[0].thumbnailUrl} alt={projectsSection[0].title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />}
            
            <div className="relative z-20 mb-12">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Featured Project</span>
            </div>
            <div className="relative z-20">
              <h3 className="text-3xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">{projectsSection[0].title}</h3>
              <p className="text-slate-300 max-w-md line-clamp-2 mb-4">{projectsSection[0].description || projectsSection[0].tagline}</p>
              {projectsSection[0].liveUrl && (
                <a href={projectsSection[0].liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold hover:underline text-[var(--accent)] hover:text-white transition-colors">
                  View Project <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* About Box (Replaced Experience) */}
        <motion.div id="about" variants={itemVariants} className="md:col-span-2 lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow flex flex-col">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
            <User className="w-6 h-6 text-[var(--accent)]" /> {aboutSection.bioTitle || "About Me"}
          </h3>
          <div className="flex flex-col gap-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
             <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
               {aboutSection.bioDescription || "A passionate creative who loves to build things."}
             </p>
          </div>
        </motion.div>

        {/* Skills Marquee Box */}
        {flatSkills.length > 0 && (
            <motion.div id="skills" variants={itemVariants} className="md:col-span-4 lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center overflow-hidden">
                <div className="font-bold text-xl mr-8 whitespace-nowrap shrink-0 flex items-center gap-2 text-slate-900 dark:text-white">
                    <FileText className="w-5 h-5 text-[var(--accent)]" /> Core Tech
                </div>
                <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2 pt-2">
                    {flatSkills.map((skill, idx) => (
                        <div key={idx} className="px-6 py-3 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap shadow-sm hover:scale-105 transition-transform hover:border-[var(--accent)] hover:text-[var(--accent)]">
                            {skill}
                        </div>
                    ))}
                </div>
            </motion.div>
        )}

      </motion.div>
    </div>
  );
}
