import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';

export default function ContactBlock({ data }) {
  const email = data?.email || 'hello@example.com';
  
  return (
    <div className="w-full py-24 px-6 md:px-12 bg-blue-600 text-white flex flex-col items-center justify-center text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-2xl"
      >
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
           <Mail size={32} className="text-white" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's work together</h2>
        <p className="text-xl text-blue-100 mb-10 max-w-lg mx-auto">
          Have a project in mind or just want to say hi? I'd love to hear from you.
        </p>
        
        <a 
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20 group"
        >
          {email}
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </a>
      </motion.div>
    </div>
  );
}
