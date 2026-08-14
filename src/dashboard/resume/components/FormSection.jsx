import React, { useState } from 'react'
import PersonalDetail from './forms/PersonalDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, User, FileText, Briefcase, GraduationCap, Sparkles } from 'lucide-react'
import Summery from './forms/Summery';
import Experience from './forms/Experience';
import Education from './forms/Education';
import Skills from './forms/Skills';
import { Navigate, useParams } from 'react-router-dom';
import ThemeColor from './ThemeColor';
import MagicImportModal from './MagicImportModal';
import { motion, AnimatePresence } from 'framer-motion';

function FormSection() {
  const [activeFormIndex,setActiveFormIndex]=useState(1);
  const [enableNext,setEnableNext]=useState(true);
  const {resumeId}=useParams();
  
  const steps = [
    { id: 1, name: 'Personal', icon: User },
    { id: 2, name: 'Summary', icon: FileText },
    { id: 3, name: 'Experience', icon: Briefcase },
    { id: 4, name: 'Education', icon: GraduationCap },
    { id: 5, name: 'Skills', icon: Sparkles },
  ];
  
  return (
    <div className="flex flex-col gap-6 h-full">
        <div className='flex justify-center items-center py-2 shrink-0'>
          <div className="flex bg-surface p-2 rounded-full border border-outline-variant/30 shadow-sm items-center gap-1 md:gap-2">
             {steps.map((step) => {
                const Icon = step.icon;
                const isActive = activeFormIndex === step.id;
                const isCompleted = activeFormIndex > step.id;
                
                return (
                   <button 
                     key={step.id}
                     onClick={() => setActiveFormIndex(step.id)}
                     className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 outline-none ${isActive ? 'bg-stitch-primary text-white shadow-md shadow-stitch-primary/20' : isCompleted ? 'hover:bg-surface-variant text-stitch-primary/80' : 'hover:bg-surface-variant text-on-surface-variant/60'}`}
                   >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                      {isActive && (
                          <span className="text-sm font-bold tracking-wide">
                            {step.name}
                          </span>
                      )}
                   </button>
                )
             })}
          </div>
        </div>
        
        {/* Form Components Wrapper */}
        <motion.div layout className="bg-surface rounded-xl border border-outline-variant/30 shadow-sm p-4 flex-1 overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
                key={`guided-step-${activeFormIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                {activeFormIndex==1?  
                <PersonalDetail enabledNext={(v)=>setEnableNext(v)} handleNext={() => setActiveFormIndex(2)} handlePrev={null} />
                :activeFormIndex==2?
                      <Summery  enabledNext={(v)=>setEnableNext(v)} handleNext={() => setActiveFormIndex(3)} handlePrev={() => setActiveFormIndex(1)} />
                :activeFormIndex==3?
                  <Experience handleNext={() => setActiveFormIndex(4)} handlePrev={() => setActiveFormIndex(2)} />  
                  :activeFormIndex==4?
                  <Education handleNext={() => setActiveFormIndex(5)} handlePrev={() => setActiveFormIndex(3)} />
                  :activeFormIndex==5?
                  <Skills handleNext={null} handlePrev={() => setActiveFormIndex(4)} />
                  :null
                }
            </motion.div>
          </AnimatePresence>
        </motion.div>
    </div>
  )
}

export default FormSection