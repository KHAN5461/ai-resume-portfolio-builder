import React from 'react';
import { motion } from 'framer-motion';

export default function SkillsBlock({ data }) {
  const skills = data?.skills || ['React', 'Next.js', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Framer Motion', 'GraphQL', 'Python', 'Docker'];
  
  return (
    <div className="w-full py-20 px-6 md:px-12 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Tech Stack</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-12">
          Technologies and tools I work with to bring ideas to life.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="px-6 py-3 bg-slate-800 border border-slate-700 rounded-2xl shadow-sm text-slate-200 font-medium cursor-default"
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
