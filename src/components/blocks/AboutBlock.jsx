import React from 'react';
import { motion } from 'framer-motion';

export default function AboutBlock({ data }) {
  const bio = data?.bio || "I am a passionate software engineer dedicated to crafting elegant solutions to complex problems. With a strong foundation in modern web technologies, I love building products that are not only functional but also beautiful and intuitive.";
  const stats = data?.stats || [
    { label: 'Years Experience', value: '5+' },
    { label: 'Projects Completed', value: '40+' },
    { label: 'Happy Clients', value: '20+' }
  ];

  return (
    <div className="w-full py-20 px-6 md:px-12 bg-white">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">About Me</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            {bio}
          </p>
          
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-100">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl font-extrabold text-blue-600 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full md:w-[400px] h-[500px] bg-slate-100 rounded-3xl overflow-hidden relative shadow-sm border border-slate-200"
        >
           {/* Placeholder for an Image */}
           <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center">
              <span className="text-slate-400 font-medium">Your Photo</span>
           </div>
        </motion.div>

      </div>
    </div>
  );
}
