import React from 'react';
import { motion } from 'framer-motion';

export default function ContactSection({ data }) {
  if (!data) return null;

  return (
    <section id="contact" className="w-full max-w-6xl mx-auto px-6 md:px-8 py-32 bg-white dark:bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8"
      >
        <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
          {data.heading || "Get In Touch"}
        </span>
        
        <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
          Let's build something together.
        </h2>
        
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
          {data.subheading || "I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!"}
        </p>
        
        <div className="pt-8">
          {data.email && (
            <a 
              href={`mailto:${data.email}`}
              className="inline-flex items-center justify-center px-10 py-5 bg-indigo-600 text-white font-semibold text-lg rounded-full hover:bg-indigo-700 hover:scale-95 hover:shadow-lg transition-all duration-200 ease-out"
            >
              Say Hello
            </a>
          )}
        </div>
        
        {data.socialLinks && data.socialLinks.length > 0 && (
          <div className="mt-16 flex flex-wrap justify-center gap-8">
            {data.socialLinks.map((link, idx) => (
              <a 
                key={idx} 
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-mono text-sm uppercase tracking-wider font-semibold"
              >
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
