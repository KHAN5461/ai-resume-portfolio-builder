import React from 'react';
import { motion } from 'framer-motion';

export default function ExperienceBlock({ data }) {
  const experiences = data?.experiences || [
    { role: 'Senior Developer', company: 'Tech Innovators', date: '2021 - Present', description: 'Led the frontend team to build scalable micro-frontends using React and Webpack.' },
    { role: 'Full Stack Engineer', company: 'StartupX', date: '2018 - 2021', description: 'Developed REST APIs in Node.js and built responsive user interfaces.' },
    { role: 'Junior Developer', company: 'WebAgency', date: '2016 - 2018', description: 'Maintained legacy systems and implemented new features in WordPress.' }
  ];

  return (
    <div className="w-full py-20 px-6 md:px-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">Work Experience</h2>
        
        <div className="relative border-l-2 border-slate-200 ml-4 md:ml-0 md:pl-0">
          {experiences.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="mb-12 relative pl-8 md:pl-10"
            >
              {/* Timeline Node */}
              <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-[9px] top-1.5 border-4 border-white shadow-sm"></div>
              
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-900">{exp.role}</h3>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-max mt-2 md:mt-0">
                  {exp.date}
                </span>
              </div>
              <h4 className="text-lg font-medium text-slate-600 mb-4">{exp.company}</h4>
              <p className="text-slate-600 leading-relaxed max-w-2xl">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
