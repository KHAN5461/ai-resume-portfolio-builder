import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutTemplate, Home, User, Briefcase, Wrench, Mail } from 'lucide-react';
import HeroForm from './forms/HeroForm';
import AboutForm from './forms/AboutForm';
import ProjectsForm from './forms/ProjectsForm';
import SkillsForm from './forms/SkillsForm';
import ContactForm from './forms/ContactForm';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioFormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const { portfolioId } = useParams();

  const navItems = [
    { id: 1, label: 'Hero', icon: <Home className="w-4 h-4" /> },
    { id: 2, label: 'About', icon: <User className="w-4 h-4" /> },
    { id: 3, label: 'Projects', icon: <Briefcase className="w-4 h-4" /> },
    { id: 4, label: 'Skills', icon: <Wrench className="w-4 h-4" /> },
    { id: 5, label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className='flex flex-col gap-4 mb-6 sticky top-0 bg-surface-container-lowest z-10 pb-4 border-b border-outline-variant/30'>
        <div className='flex justify-between items-center'>
          <Link to={'/dashboard'}>
            <Button variant="outline" size="sm" className="gap-2"><LayoutTemplate className="w-4 h-4"/> Theme</Button>
          </Link>
          <span className="text-sm font-medium text-on-surface-variant bg-surface-container py-1 px-3 rounded-full">Section {activeFormIndex} of 5</span>
        </div>
        
        {/* Stepper Navigation */}
        <div className="flex bg-surface-container-low p-1 rounded-lg w-full overflow-x-auto custom-scrollbar shadow-inner">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFormIndex(item.id)}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap flex-1 justify-center
                ${activeFormIndex === item.id 
                  ? 'bg-surface shadow-sm text-stitch-primary' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50'
                }`}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Forms Pagination with Animation */}
      <div className="flex-1 overflow-visible relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFormIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeFormIndex === 1 && <HeroForm />}
            {activeFormIndex === 2 && <AboutForm />}
            {activeFormIndex === 3 && <ProjectsForm />}
            {activeFormIndex === 4 && <SkillsForm />}
            {activeFormIndex === 5 && <ContactForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
