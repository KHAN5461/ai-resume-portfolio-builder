import React, { useState } from 'react'
import PersonalDetail from './forms/PersonalDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
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
  const [isExpertMode, setIsExpertMode] = useState(false);
  const {resumeId}=useParams();
  
  return (
    <div className="flex flex-col gap-6 h-full">
        <div className='flex justify-between items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm shrink-0'>
          {/* Mode Switcher */}
          <div className="flex bg-surface-variant/30 rounded-full p-1 gap-1 border border-outline-variant/20 mr-4">
            <button 
              onClick={() => setIsExpertMode(false)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-label-sm transition-colors ${!isExpertMode ? 'bg-white text-stitch-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Guided
            </button>
            <button 
              onClick={() => setIsExpertMode(true)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-label-sm transition-colors ${isExpertMode ? 'bg-white text-stitch-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Expert
            </button>
          </div>

          {/* Stepper Progress */}
          {!isExpertMode && (
              <div className="flex-1 mr-4 hidden md:flex items-center">
                 {[1, 2, 3, 4, 5].map((step, index) => (
                    <React.Fragment key={step}>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-[14px] font-bold transition-colors ${activeFormIndex === step ? 'bg-stitch-primary text-white shadow-md' : activeFormIndex > step ? 'bg-stitch-primary/20 text-stitch-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                          {activeFormIndex > step ? <span className="material-symbols-outlined text-[16px] font-bold">check</span> : step}
                       </div>
                       {index < 4 && (
                          <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${activeFormIndex > step ? 'bg-stitch-primary/30' : 'bg-surface-variant'}`}></div>
                       )}
                    </React.Fragment>
                 ))}
              </div>
          )}
          
          <div className='flex gap-2 items-center flex-shrink-0'>
             <ThemeColor/>
             <MagicImportModal />
          </div>
          
          {!isExpertMode && (
            <div className='flex gap-2 ml-4 flex-shrink-0'>
              {activeFormIndex>1
              &&<Button size="sm" variant="outline"
              className="border-outline-variant/50 text-on-surface-variant hover:text-stitch-primary hover:bg-surface-variant h-9 rounded-lg"
              onClick={()=>setActiveFormIndex(activeFormIndex-1)}> <ArrowLeft className="w-4 h-4 mr-1"/> Prev</Button> }
              
              <Button 
              disabled={!enableNext}
              className="flex gap-1 bg-stitch-primary hover:bg-stitch-primary/90 text-on-primary rounded-lg h-9 px-4 shadow-sm" size="sm"
              onClick={()=>setActiveFormIndex(activeFormIndex+1)}
              > Next 
              <ArrowRight className="w-4 h-4 ml-1"/> </Button>
            </div>
          )}
        </div>
        
        {/* Form Components Wrapper */}
        <motion.div layout className="bg-surface rounded-xl border border-outline-variant/30 shadow-sm p-4 flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {isExpertMode ? (
                <motion.div 
                    key="expert-mode"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-12 pb-12"
                >
                    <div id="personal"><PersonalDetail enabledNext={(v)=>setEnableNext(v)} /></div>
                    <div className="w-full h-px bg-outline-variant/20"></div>
                    <div id="summary"><Summery enabledNext={(v)=>setEnableNext(v)} /></div>
                    <div className="w-full h-px bg-outline-variant/20"></div>
                    <div id="experience"><Experience /></div>
                    <div className="w-full h-px bg-outline-variant/20"></div>
                    <div id="education"><Education /></div>
                    <div className="w-full h-px bg-outline-variant/20"></div>
                    <div id="skills"><Skills /></div>
                </motion.div>
            ) : (
                <motion.div
                    key={`guided-step-${activeFormIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeFormIndex==1?  
                    <PersonalDetail enabledNext={(v)=>setEnableNext(v)} />
                    :activeFormIndex==2?
                          <Summery  enabledNext={(v)=>setEnableNext(v)} />
                    :activeFormIndex==3?
                      <Experience />  
                      :activeFormIndex==4?
                      <Education/>
                      :activeFormIndex==5?
                      <Skills/>
                      :activeFormIndex==6?
                      <Navigate to={'/my-resume/'+resumeId+"/view"}/>
                    :null
                    }
                </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
    </div>
  )
}

export default FormSection