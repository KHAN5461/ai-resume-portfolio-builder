import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { Brain, LoaderCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { AIChatSession } from './../../../../../service/AIModal';
import { motion, AnimatePresence } from 'framer-motion';

const prompt="Job Title: {jobTitle} , Depends on job title give me list of  summery for 3 experience level, Mid Level and Freasher level in 3 -4 lines in array format, With summery and experience_level Field in JSON Format"
function Summery({enabledNext}) {
    const dispatch = useDispatch();
    const resumeInfo = useSelector(state => state.resume.resumeData);
    const [summery,setSummery]=useState();
    const [loading,setLoading]=useState(false);
    const params=useParams();
    const [aiGeneratedSummeryList,setAiGenerateSummeryList]=useState();
    useEffect(()=>{
        if (summery) {
            dispatch(setResumeData({
                ...resumeInfo,
                summery:summery
            }));
        }
    },[summery])

    const GenerateSummeryFromAI=async()=>{
        setLoading(true)
        const PROMPT=prompt.replace('{jobTitle}',resumeInfo?.jobTitle);
        console.log(PROMPT);
        const result=await AIChatSession.sendMessage(PROMPT);
        console.log(JSON.parse(result.response.text()))
       
        setAiGenerateSummeryList(JSON.parse(result.response.text()))
        setLoading(false);
    }

    const onSave=(e)=>{
        e.preventDefault();
       
        setLoading(true)
        const data={
            data:{
                summery:summery
            }
        }
        GlobalApi.UpdateResumeDetail(params?.resumeId,data).then(resp=>{
            console.log(resp);
            enabledNext(true);
            setLoading(false);
            toast("Details updated")
        },(error)=>{
            setLoading(false);
        })
    }
    return (
    <div>
         <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Summery</h2>
        <p>Add Summery for your job title</p>

        <form className='mt-7' onSubmit={onSave}>
            <div className='flex justify-between items-end'>
                <label className='font-label-md'>Add Summary</label>
                <Button 
                  variant="outline" 
                  onClick={GenerateSummeryFromAI} 
                  type="button" 
                  size="sm" 
                  disabled={loading}
                  className="bg-gradient-to-r from-stitch-primary to-purple-600 text-white border-0 hover:from-stitch-primary/90 hover:to-purple-600/90 hover:scale-105 transition-all shadow-sm flex gap-2"
                > 
                  {loading ? <LoaderCircle className='h-4 w-4 animate-spin' /> : <Sparkles className='h-4 w-4' />}  
                  {loading ? 'Generating...' : 'Magic Generate'}
                </Button>
            </div>
            <Textarea className="mt-5" required
            value={summery}
                defaultValue={summery?summery:(resumeInfo?.summery || resumeInfo?.summary)}
            onChange={(e)=>setSummery(e.target.value)}
            />
            <div className='mt-2 flex justify-end'>
            <Button type="submit"
                disabled={loading}>
                    {loading?<LoaderCircle className='animate-spin' />:'Save'}
                    </Button>
            </div>
        </form>
        </div>

        
       <AnimatePresence>
         {aiGeneratedSummeryList && (
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className='mt-8'
           >
                <h2 className='font-headline-sm text-lg font-bold mb-4 flex items-center gap-2'>
                  <Sparkles className="w-5 h-5 text-stitch-primary" /> 
                  AI Suggestions
                </h2>
                <div className="flex flex-col gap-4">
                  {aiGeneratedSummeryList?.map((item,index)=>(
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index} 
                        onClick={()=>setSummery(item?.summary)}
                        className={`p-5 shadow-sm border rounded-xl cursor-pointer transition-all hover:shadow-md group ${summery === item?.summary ? 'border-stitch-primary bg-stitch-primary/5' : 'border-outline-variant/40 bg-surface-container-lowest hover:border-stitch-primary/30'}`}
                      >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className='font-label-md font-bold text-stitch-primary bg-stitch-primary/10 px-3 py-1 rounded-full inline-block'>
                              Level: {item?.experience_level}
                            </h3>
                            {summery === item?.summary && <CheckCircle2 className="w-5 h-5 text-stitch-primary" />}
                          </div>
                          <p className="font-body-md text-on-surface-variant leading-relaxed">{item?.summary}</p>
                      </motion.div>
                  ))}
                </div>
            </motion.div>
         )}
       </AnimatePresence>

    </div>
  )
}

export default Summery