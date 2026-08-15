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
    <div className='p-5 shadow-lg rounded-lg border-t-indigo-500 border-t-4 mt-10 bg-white'>
      <h2 className='font-bold text-lg'>About Section</h2>
      <p>Tell visitors about yourself</p>

      <div className='mt-4 flex flex-col gap-4'>
        <div>
          <ImageDropzone 
            label="Profile Image" 
            value={aboutSection.profileImage || ""} 
            onChange={(val) => handleChange({ target: { name: 'profileImage', value: val }})} 
          />
        </div>
        <div>
          <label className='text-sm font-semibold'>Bio Title</label>
          <Input name="bioTitle" value={aboutSection.bioTitle || ""} onChange={handleChange} placeholder="e.g. A bit about my journey" />
        </div>
        <div>
          <label className='text-sm font-semibold'>Bio Description</label>
          <div className="bg-white border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all mt-1">
            <EditorProvider>
              <Editor value={aboutSection.bioDescription || ""} onChange={handleChange} name="bioDescription" className="min-h-[150px] p-4 text-gray-800 bg-transparent focus:outline-none text-sm">
                <Toolbar className="bg-gray-50 border-b border-gray-200 px-2 py-1 flex gap-1 flex-wrap items-center">
                  <div className="flex gap-1 bg-white rounded-md p-1 shadow-sm border border-gray-200">
                    <BtnBold className="hover:bg-indigo-100 rounded p-1" />
                    <BtnItalic className="hover:bg-indigo-100 rounded p-1" />
                    <BtnUnderline className="hover:bg-indigo-100 rounded p-1" />
                  </div>
                  <Separator className="mx-1 h-5 bg-gray-300 w-px" />
                  <div className="flex gap-1 bg-white rounded-md p-1 shadow-sm border border-gray-200">
                    <BtnNumberedList className="hover:bg-indigo-100 rounded p-1" />
                    <BtnBulletList className="hover:bg-indigo-100 rounded p-1" />
                  </div>
                  <Separator className="mx-1 h-5 bg-gray-300 w-px" />
                  <div className="flex gap-1 bg-white rounded-md p-1 shadow-sm border border-gray-200">
                    <BtnLink className="hover:bg-indigo-100 rounded p-1" />
                  </div>
                </Toolbar>
              </Editor>
            </EditorProvider>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-md mb-2">Stats (Optional)</h3>
        <AnimatePresence initial={false}>
          {(aboutSection.stats || []).map((stat, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.3 }}
            >
              <div className='flex gap-2 mb-2 items-center'>
                <Input value={stat.value || ""} onChange={(e) => handleStatChange(index, 'value', e.target.value)} placeholder="Value (e.g. 5+)" />
                <Input value={stat.label || ""} onChange={(e) => handleStatChange(index, 'label', e.target.value)} placeholder="Label (e.g. Years Experience)" />
                <Button variant="destructive" size="sm" onClick={() => removeStat(index)}>
                   <span className="material-symbols-outlined text-[16px]">delete</span>
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <Button onClick={addStat} variant="outline" className="w-full mt-2 text-indigo-600 border-indigo-600">
          + Add Stat
        </Button>
      </div>
    </div>
  );
}

export default React.memo(AboutForm);
