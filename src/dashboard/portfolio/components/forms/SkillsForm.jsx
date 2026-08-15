import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { updatePortfolioData } from '@/store/portfolioSlice';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className='p-5 shadow-lg rounded-lg border-t-indigo-500 border-t-4 mt-10 bg-white'>
      <h2 className='font-bold text-lg'>Skills Section</h2>
      <p>Categorize your technical skills</p>

      {categories.length === 0 ? (
        <div className="text-center py-8 bg-zinc-50 rounded-lg mt-4 border border-dashed border-zinc-300">
           <span className="material-symbols-outlined text-4xl text-zinc-400 mb-2">construction</span>
           <h3 className="font-semibold text-zinc-700">No Skills Added</h3>
           <p className="text-sm text-zinc-500 max-w-xs mx-auto mb-4">Add categories like "Frontend" or "Backend" and list your skills.</p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {categories.map((cat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.3 }}
              >
                <div className='border rounded p-4 bg-zinc-50 relative'>
                  <button 
                    onClick={() => removeCategory(index)}
                    className='absolute top-2 right-2 text-red-500 text-sm hover:underline flex items-center gap-1'
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Remove
                  </button>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                    <div>
                      <label className='text-sm font-semibold'>Category Title</label>
                      <Input value={cat.title || ""} onChange={(e) => handleCategoryChange(index, e.target.value)} placeholder="e.g. Frontend Development" />
                    </div>
                    <div>
                      <label className='text-sm font-semibold'>Skills (comma separated)</label>
                      <Input value={cat.items?.join(', ') || ""} onChange={(e) => handleSkillsChange(index, e.target.value)} placeholder="React, Vue, HTML, CSS" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      <Button onClick={addCategory} variant="outline" className="w-full mt-4 text-indigo-600 border-indigo-600">
        + Add New Category
      </Button>
    </div>
  );
}

export default React.memo(SkillsForm);
