import React, { useContext, useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { LayoutGrid } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import GlobalApi from './../../../../service/GlobalApi'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { isAccessibleContrast } from '@/lib/contrast';

function ThemeColor() {
    const colors=[
        "#1E40AF", "#0369A1", "#0D9488", "#15803D", "#B45309",
        "#B91C1C", "#BE185D", "#4C1D95", "#0F172A", "#334155",
        "#52525B", "#6366f1", "#0ea5e9", "#10B981", "#3B82F6",
        "#FF5733", "#5733FF", "#A133FF", "#3357FF", "#0284c7"
    ]

    const dispatch = useDispatch();
    const resumeInfo = useSelector(state => state.resume.present.resumeData);
    const [selectedColor,setSelectedColor]=useState(resumeInfo?.themeColor || '#0284c7');
    const {resumeId}=useParams();
    
    const contrastInfo = isAccessibleContrast(selectedColor || '#0284c7', '#FFFFFF');

    const onColorSelect=(color)=>{
        setSelectedColor(color)
        dispatch(setResumeData({
            ...resumeInfo,
            themeColor:color
        }));
        const data={
            data:{
                themeColor:color
            }
        }
        GlobalApi.UpdateResumeDetail(resumeId,data).then(resp=>{
            toast.success('Theme Color Updated');
        });
    }

  return (
    <Popover>
  <PopoverTrigger asChild>
  <Button variant="outline" size="sm" 
          className="flex gap-2" > <LayoutGrid className="w-4 h-4" /> Theme</Button>
  </PopoverTrigger>
  <PopoverContent className="w-64 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
    <div className="flex items-center justify-between mb-3">
      <h2 className='text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider'>Theme Color</h2>
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${contrastInfo.isAccessible ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
        {contrastInfo.isAccessible ? `WCAG ${contrastInfo.level}` : 'Low Contrast'}
      </span>
    </div>
    <div className='grid grid-cols-5 gap-1 mb-3'>
        {colors.map((item,index)=>(
            <button
                type="button" 
                key={item || index}
                onClick={()=>onColorSelect(item)}
                aria-label={`Select theme color ${item}`}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
                <div 
                    className={`h-7 w-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center
                    ${selectedColor===item ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-slate-100 shadow-md' : 'border border-slate-300 dark:border-slate-700'}
                    `}
                    style={{ background: item }}
                />
            </button>
        ))}
    </div>
    {!contrastInfo.isAccessible && (
      <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2 font-medium">
        Contrast ratio ({contrastInfo.ratio}:1) is below 4.5:1. Consider choosing a darker shade for better ATS legibility.
      </p>
    )}
  </PopoverContent>
</Popover>
  )
}

export default ThemeColor