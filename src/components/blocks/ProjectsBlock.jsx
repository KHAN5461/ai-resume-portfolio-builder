import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

export default function ProjectsBlock({ data }) {
  const projects = data?.projects || [
    { title: 'Project One', description: 'A brief description of this awesome project.', tags: ['React', 'Tailwind'] },
    { title: 'Project Two', description: 'Another cool thing I built recently.', tags: ['Next.js', 'Node.js'] },
    { title: 'Project Three', description: 'Exploring modern web animation techniques.', tags: ['Framer', 'CSS'] },
  ];

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
                {proj.tags.map(tag => (
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
