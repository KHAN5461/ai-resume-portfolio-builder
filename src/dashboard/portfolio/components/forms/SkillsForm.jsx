import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { updatePortfolioData } from '@/store/portfolioSlice';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Accordion from './Accordion';

const SkillsForm = () => {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.present.portfolios[portfolioId]);
  
  if (!portfolioData) return null;
  const categories = portfolioData.skillsSection?.categories || [];

  const handleCategoryChange = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = { ...newCategories[index], title: value };
    dispatch(updatePortfolioData({ id: portfolioId, data: { skillsSection: { categories: newCategories } } }));
  };

  const handleSkillsChange = (index, value) => {
    const skillsArray = value.split(',').map(skill => skill.trim());
    const newCategories = [...categories];
    newCategories[index] = { ...newCategories[index], items: skillsArray };
    dispatch(updatePortfolioData({ id: portfolioId, data: { skillsSection: { categories: newCategories } } }));
  };

  const addCategory = () => {
    const newCategories = [...categories, { title: "", items: [] }];
    dispatch(updatePortfolioData({ id: portfolioId, data: { skillsSection: { categories: newCategories } } }));
  };

  const removeCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    dispatch(updatePortfolioData({ id: portfolioId, data: { skillsSection: { categories: newCategories } } }));
  };

  return (
    <div className='space-y-6'>
      <div className="flex justify-between items-center">
         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Skill Categories</h4>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-gray-200 dark:border-slate-700/50">
           <span className="material-symbols-outlined text-[32px] text-gray-300 dark:text-gray-600 mb-1 block">construction</span>
           <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-300">No Skills Added</h3>
           <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add categories like "Frontend" or "Backend".</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {categories.map((cat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative group">
                  <button 
                    onClick={() => removeCategory(index)}
                    className='absolute top-2 right-12 z-10 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors opacity-0 group-hover:opacity-100'
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Accordion title={cat.title || `Category ${index + 1}`} defaultOpen={index === categories.length - 1}>
                    <div className='space-y-3'>
                      <div className="space-y-1.5">
                        <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>Category Title</label>
                        <Input value={cat.title || ""} onChange={(e) => handleCategoryChange(index, e.target.value)} placeholder="e.g. Frontend Development" className="h-8 text-xs bg-white dark:bg-slate-900" />
                      </div>
                      <div className="space-y-1.5">
                        <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>Skills (comma separated)</label>
                        <Input value={cat.items?.join(', ') || ""} onChange={(e) => handleSkillsChange(index, e.target.value)} placeholder="React, Vue, HTML, CSS" className="h-8 text-xs bg-white dark:bg-slate-900" />
                      </div>
                    </div>
                  </Accordion>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      <button onClick={addCategory} className="w-full py-2 bg-white dark:bg-slate-800 border border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
        + Add New Category
      </button>
    </div>
  );
}

export default React.memo(SkillsForm);
