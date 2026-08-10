import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { updatePortfolioData } from '@/store/portfolioSlice';
import { Button } from '@/components/ui/button';

export default function SkillsForm() {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.portfolios[portfolioId]);
  
  if (!portfolioData) return null;
  const categories = portfolioData.skillsSection?.categories || [];

  const handleCategoryChange = (index, field, value) => {
    const newCategories = [...categories];
    newCategories[index] = { ...newCategories[index], [field]: value };
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

  const handleItemsChange = (index, value) => {
    const itemsArray = value.split(',').map(item => item.trim());
    handleCategoryChange(index, 'items', itemsArray);
  };

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-indigo-500 border-t-4 mt-10 bg-white'>
      <h2 className='font-bold text-lg'>Skills Section</h2>
      <p>List your technical skills grouped by category</p>

      {categories.map((category, index) => (
        <div key={index} className='border rounded p-4 mt-4 bg-zinc-50 relative'>
          <button 
            onClick={() => removeCategory(index)}
            className='absolute top-2 right-2 text-red-500 text-sm hover:underline'
          >
            Remove
          </button>
          
          <div className='grid grid-cols-1 gap-4 mt-2'>
            <div>
              <label className='text-sm font-semibold'>Category Title</label>
              <Input value={category.title} onChange={(e) => handleCategoryChange(index, 'title', e.target.value)} placeholder="e.g. Frontend" />
            </div>
            <div>
              <label className='text-sm font-semibold'>Skills (comma separated)</label>
              <Input value={category.items?.join(', ') || ""} onChange={(e) => handleItemsChange(index, e.target.value)} placeholder="React, Vue, HTML, CSS" />
            </div>
          </div>
        </div>
      ))}
      
      <Button onClick={addCategory} variant="outline" className="w-full mt-4 text-indigo-600 border-indigo-600">
        + Add Skill Category
      </Button>
    </div>
  );
}
