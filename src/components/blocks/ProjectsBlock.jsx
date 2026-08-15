import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Code2, PlayCircle, BookOpen } from 'lucide-react';

export default function ProjectsBlock({ data }) {
  const projects = data?.projects || [
    { title: 'Project One', description: 'A brief description of this awesome project.', tags: ['React', 'Tailwind'], status: 'Active' },
    { title: 'Project Two', description: 'Another cool thing I built recently.', tags: ['Next.js', 'Node.js'], status: 'Maintenance' },
    { title: 'Project Three', description: 'Exploring modern web animation techniques.', tags: ['Framer', 'CSS'], status: 'Open Source' },
  ];

  const layout = data?.config?.layout || 'grid';

  if (layout === 'bento') {
    return (
      <div className="w-full py-20 px-6 md:px-12 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Selected Work</h2>
            <p className="text-slate-600 max-w-2xl text-lg">Bento grid showcasing my most impactful projects.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {projects.map((proj, idx) => {
              // Make the first project span 2 columns and 2 rows, others 1x1 or 2x1 based on index
              const isFeatured = idx === 0;
              const isWide = idx === 1;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-all group flex flex-col relative overflow-hidden ${isFeatured ? 'md:col-span-2 md:row-span-2' : isWide ? 'md:col-span-2 md:row-span-1' : 'md:col-span-1 md:row-span-1'}`}
                >
                  <div className="absolute top-6 right-6">
                    {proj.status && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-sm border border-green-200">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {proj.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 mt-10">
                    <h3 className={`${isFeatured ? 'text-3xl' : 'text-xl'} font-bold text-slate-900 mb-3`}>{proj.title}</h3>
                    <p className={`text-slate-600 ${isFeatured ? 'text-lg line-clamp-3' : 'text-sm line-clamp-2'} mb-6`}>{proj.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {proj.tags?.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-6">
                    <button className="p-2 bg-slate-900 text-white rounded-full hover:scale-110 transition-transform"><ExternalLink size={18} /></button>
                    <button className="p-2 bg-slate-100 text-slate-600 rounded-full hover:scale-110 transition-transform"><Github size={18} /></button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'story') {
    return (
      <div className="w-full py-24 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Case Studies</h2>
            <p className="text-slate-600 text-lg">A deep dive into the engineering decisions behind my work.</p>
          </div>
          
          <div className="space-y-24">
            {projects.map((proj, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative pl-8 md:pl-0"
              >
                {/* Timeline connector on mobile */}
                <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-slate-200"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  <div className="md:col-span-5 md:sticky top-24">
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">{proj.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {proj.tags?.map(tag => (
                        <span key={tag} className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <div className="flex gap-4 mb-8">
                      <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors">
                        <PlayCircle size={18} /> View Demo
                      </a>
                      <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
                        <Code2 size={18} /> Source
                      </a>
                    </div>
                  </div>
                  
                  <div className="md:col-span-7 space-y-8">
                    <div>
                      <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-2">
                        <span className="text-blue-600"><BookOpen size={20} /></span> The Problem
                      </h4>
                      <p className="text-slate-600 leading-relaxed">{proj.description}</p>
                    </div>
                    
                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                      <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-2">💡 Key Insight</h4>
                      <p className="text-amber-900/80 leading-relaxed">
                        To scale the architecture effectively, we needed to move away from a monolithic state tree to a distributed edge-computing model, reducing latency by 40%.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-3">The Solution</h4>
                      <div className="w-full h-64 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative group cursor-pointer">
                        <div className="absolute inset-0 bg-slate-800/10 group-hover:bg-transparent transition-colors flex items-center justify-center">
                           <PlayCircle size={48} className="text-white drop-shadow-md opacity-80 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-20 px-6 md:px-12 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Selected Work</h2>
          <p className="text-slate-600 max-w-2xl">Here are some of my recent projects that showcase my skills and experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group flex flex-col h-full"
            >
              <div className="w-full h-48 bg-slate-100 rounded-xl mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100 group-hover:scale-105 transition-transform duration-500"></div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">{proj.title}</h3>
              <p className="text-slate-600 mb-6 flex-1">{proj.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {proj.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors">
                  <ExternalLink size={16} /> Live Demo
                </a>
                <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                  <Github size={16} /> Code
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
