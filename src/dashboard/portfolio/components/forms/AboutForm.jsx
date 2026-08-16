import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updatePortfolioData } from '@/store/portfolioSlice';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic, BtnLink, BtnNumberedList, BtnStrikeThrough, BtnStyles, BtnUnderline, Editor, EditorProvider, HtmlButton, Separator, Toolbar } from 'react-simple-wysiwyg';
import ImageDropzone from './ImageDropzone';

const AboutForm = () => {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.present.portfolios[portfolioId]);
  
  if (!portfolioData) return null;
  const { aboutSection = {} } = portfolioData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updatePortfolioData({
      id: portfolioId,
      data: {
        aboutSection: { ...aboutSection, [name]: value }
      }
    }));
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...(aboutSection.stats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    dispatch(updatePortfolioData({ id: portfolioId, data: { aboutSection: { ...aboutSection, stats: newStats } } }));
  };

  const addStat = () => {
    const newStats = [...(aboutSection.stats || []), { value: "", label: "" }];
    dispatch(updatePortfolioData({ id: portfolioId, data: { aboutSection: { ...aboutSection, stats: newStats } } }));
  };

  const removeStat = (index) => {
    const newStats = (aboutSection.stats || []).filter((_, i) => i !== index);
    dispatch(updatePortfolioData({ id: portfolioId, data: { aboutSection: { ...aboutSection, stats: newStats } } }));
  };

  return (
    <div className='space-y-6'>
      {/* Profile & Bio Group */}
      <div className="space-y-4">
         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profile & Bio</h4>
         
         <div className="space-y-1.5">
           <label className='text-[13px] font-semibold text-gray-700 dark:text-gray-300'>Profile Image</label>
           <ImageDropzone 
             label="Upload Image" 
             value={aboutSection.profileImage || ""} 
             onChange={(val) => handleChange({ target: { name: 'profileImage', value: val }})} 
           />
         </div>

         <div className="space-y-1.5">
           <label className='text-[13px] font-semibold text-gray-700 dark:text-gray-300'>Bio Title</label>
           <Input name="bioTitle" value={aboutSection.bioTitle || ""} onChange={handleChange} placeholder="e.g. A bit about my journey" className="h-9 text-sm" />
         </div>

         <div className="space-y-1.5">
           <label className='text-[13px] font-semibold text-gray-700 dark:text-gray-300'>Bio Description</label>
           <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
             <EditorProvider>
               <Editor value={aboutSection.bioDescription || ""} onChange={handleChange} name="bioDescription" className="min-h-[150px] p-4 text-gray-800 dark:text-gray-200 bg-transparent focus:outline-none text-sm custom-scrollbar">
                 <Toolbar className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700 px-2 py-1 flex gap-1 flex-wrap items-center">
                   <div className="flex gap-1 bg-white dark:bg-slate-800 rounded-md p-1 shadow-sm border border-gray-200 dark:border-slate-700">
                     <BtnBold className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded p-1 transition-colors" />
                     <BtnItalic className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded p-1 transition-colors" />
                     <BtnUnderline className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded p-1 transition-colors" />
                   </div>
                   <Separator className="mx-1 h-5 bg-gray-300 dark:bg-slate-600 w-px" />
                   <div className="flex gap-1 bg-white dark:bg-slate-800 rounded-md p-1 shadow-sm border border-gray-200 dark:border-slate-700">
                     <BtnNumberedList className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded p-1 transition-colors" />
                     <BtnBulletList className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded p-1 transition-colors" />
                   </div>
                   <Separator className="mx-1 h-5 bg-gray-300 dark:bg-slate-600 w-px" />
                   <div className="flex gap-1 bg-white dark:bg-slate-800 rounded-md p-1 shadow-sm border border-gray-200 dark:border-slate-700">
                     <BtnLink className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded p-1 transition-colors" />
                   </div>
                 </Toolbar>
               </Editor>
             </EditorProvider>
           </div>
         </div>
      </div>

      {/* Stats Group */}
      <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
         <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Key Stats (Optional)</h4>
            <button onClick={addStat} className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 uppercase tracking-wider transition-colors bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md">
              + Add Stat
            </button>
         </div>
         
         <div className="space-y-3">
           <AnimatePresence initial={false}>
             {(aboutSection.stats || []).map((stat, index) => (
               <motion.div 
                 key={index} 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                 transition={{ duration: 0.3 }}
               >
                 <div className='flex gap-2 items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50'>
                   <Input value={stat.value || ""} onChange={(e) => handleStatChange(index, 'value', e.target.value)} placeholder="Value (e.g. 5+)" className="h-8 text-xs bg-white dark:bg-slate-900" />
                   <Input value={stat.label || ""} onChange={(e) => handleStatChange(index, 'label', e.target.value)} placeholder="Label (e.g. Years Exp)" className="h-8 text-xs bg-white dark:bg-slate-900" />
                   <button onClick={() => removeStat(index)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors">
                      <span className="material-symbols-outlined text-[18px] leading-none block">delete</span>
                   </button>
                 </div>
               </motion.div>
             ))}
           </AnimatePresence>
           {(aboutSection.stats || []).length === 0 && (
              <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-4 italic bg-gray-50 dark:bg-slate-800/30 rounded-lg border border-dashed border-gray-200 dark:border-slate-700/50">
                 No stats added. Click "+ Add Stat" above.
              </p>
           )}
         </div>
      </div>
    </div>
  );
}

export default React.memo(AboutForm);
