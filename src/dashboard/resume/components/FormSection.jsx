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

function FormSection() {
  const [activeFormIndex,setActiveFormIndex]=useState(1);
  const [enableNext,setEnableNext]=useState(true);
  const {resumeId}=useParams();
  
  return (
    <div className="flex flex-col gap-6 h-full">
        <div className='flex justify-between items-center bg-surface p-4 rounded-xl border border-outline-variant/30 shadow-sm shrink-0'>
          <div className='flex gap-2 items-center'>
             <ThemeColor/>
             <MagicImportModal />
          </div>
          <div className='flex gap-2'>
            {activeFormIndex>1
            &&<Button size="sm" variant="outline"
            className="border-outline-variant/50 text-on-surface-variant hover:text-stitch-primary h-8"
            onClick={()=>setActiveFormIndex(activeFormIndex-1)}> <ArrowLeft className="w-4 h-4"/> </Button> }
            
            <Button 
            disabled={!enableNext}
            className="flex gap-2 bg-stitch-primary hover:bg-stitch-primary/90 text-on-primary rounded-lg h-8 px-4" size="sm"
            onClick={()=>setActiveFormIndex(activeFormIndex+1)}
            > Next 
            <ArrowRight className="w-4 h-4"/> </Button>
          </div>
        </div>
        
        {/* Form Components Wrapper */}
        <div className="bg-surface rounded-xl border border-outline-variant/30 shadow-sm p-4 flex-1">
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
        </div>
    </div>
  )
}

export default FormSection