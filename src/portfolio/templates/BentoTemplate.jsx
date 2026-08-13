import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ExternalLink, MapPin, Building2, Calendar, FileText } from 'lucide-react';

export default function BentoTemplate({ portfolioData }) {
  const { 
    personalInfo = {}, 
    projects = [], 
    experience = [], 
    education = [], 
    skills = [] 
  } = portfolioData;

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
    <div className="min-h-screen bg-[#F7F7F8] p-4 md:p-8 lg:p-12 font-sans text-slate-900">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]"
      >
        {/* Intro Box (Large) */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm flex flex-col justify-center border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 relative z-10">
            Hi, I'm {personalInfo.firstName || 'Jane'} {personalInfo.lastName || 'Doe'} 👋
          </h1>
          <p className="text-xl text-slate-600 mb-6 font-medium relative z-10">
            {personalInfo.jobTitle || 'Product Designer & Developer'}
          </p>
          <p className="text-slate-500 max-w-md relative z-10">
            {personalInfo.summary || 'I build digital experiences that are beautiful, accessible, and high-performing.'}
          </p>
        </motion.div>

        {/* Profile Photo */}
        <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-1 bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100 flex items-center justify-center hover:scale-[1.02] transition-transform">
          <div className="w-full h-full rounded-[1.5rem] bg-slate-100 overflow-hidden relative">
            {personalInfo.profileImage ? (
                <img src={personalInfo.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[var(--accent)] to-purple-400 opacity-20"></div>
            )}
          </div>
        </motion.div>

        {/* Contact/Social Box */}
        <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-1 bg-[var(--accent)] rounded-[2rem] p-6 shadow-md text-white flex flex-col justify-between hover:scale-[1.02] transition-transform">
          <div>
            <h3 className="text-xl font-bold mb-4">Let's Connect</h3>
            <div className="flex flex-col gap-3">
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm font-medium truncate">{personalInfo.email}</span>
                </a>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm font-medium truncate">{personalInfo.location}</span>
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
        {projects.length > 0 && (
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2 bg-slate-900 rounded-[2rem] p-8 shadow-sm text-white flex flex-col justify-between hover:shadow-xl transition-shadow group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            {projects[0].imageUrl && <img src={projects[0].imageUrl} alt={projects[0].title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />}
            
            <div className="relative z-20 mb-12">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Featured Project</span>
            </div>
            <div className="relative z-20">
              <h3 className="text-3xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">{projects[0].title}</h3>
              <p className="text-slate-300 max-w-md line-clamp-2 mb-4">{projects[0].description}</p>
              {projects[0].link && (
                <a href={projects[0].link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold hover:underline">
                  View Project <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* Experience Box */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[var(--accent)]" /> Experience
          </h3>
          <div className="flex flex-col gap-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {experience.slice(0, 3).map((exp, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <span className="font-bold text-slate-400 text-xl">{idx + 1}</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">{exp.title}</h4>
                  <p className="text-slate-500 font-medium">{exp.companyName}</p>
                  <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills Marquee Box */}
        <motion.div variants={itemVariants} className="md:col-span-4 lg:col-span-4 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex items-center overflow-hidden">
            <div className="font-bold text-xl mr-8 whitespace-nowrap shrink-0 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--accent)]" /> Core Tech
            </div>
            <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2 pt-2">
                {skills.map((skill, idx) => (
                    <div key={idx} className="px-6 py-3 rounded-full bg-slate-50 border border-slate-100 font-semibold text-slate-700 whitespace-nowrap shadow-sm hover:scale-105 transition-transform hover:border-[var(--accent)] hover:text-[var(--accent)]">
                        {skill.name}
                    </div>
                ))}
            </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
