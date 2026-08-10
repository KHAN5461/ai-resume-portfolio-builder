import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateAboutSection } from '@/store/portfolioSlice';

export default function AboutForm() {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.portfolios[portfolioId]);
  
  if (!portfolioData) return null;
  const aboutData = portfolioData.aboutSection;

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateAboutSection({ id: portfolioId, data: { [name]: value } }));
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...(aboutData.stats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    dispatch(updateAboutSection({ id: portfolioId, data: { stats: newStats } }));
  };

  const addStat = () => {
    const newStats = [...(aboutData.stats || []), { value: "", label: "" }];
    dispatch(updateAboutSection({ id: portfolioId, data: { stats: newStats } }));
  };

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-indigo-500 border-t-4 mt-10 bg-white'>
      <h2 className='font-bold text-lg'>About Section</h2>
      <p>Edit your bio and key statistics</p>

      <div className='grid grid-cols-1 gap-4 mt-5'>
        <div>
          <label className='text-sm font-semibold'>Section Title</label>
          <Input name="bioTitle" value={aboutData.bioTitle} onChange={handleChange} placeholder="e.g. About Me" />
        </div>
        <div>
          <label className='text-sm font-semibold'>Bio Description</label>
          <Textarea name="bioDescription" value={aboutData.bioDescription} onChange={handleChange} placeholder="Tell your story..." className="h-32" />
        </div>
        
        <div className='border-t pt-4 mt-2'>
          <label className='text-sm font-semibold mb-2 block'>Key Statistics</label>
          {(aboutData.stats || []).map((stat, index) => (
            <div key={index} className='flex gap-2 mb-2'>
              <Input 
                value={stat.value} 
                onChange={(e) => handleStatChange(index, 'value', e.target.value)} 
                placeholder="Value (e.g. 5+)" 
                className="w-1/3"
              />
              <Input 
                value={stat.label} 
                onChange={(e) => handleStatChange(index, 'label', e.target.value)} 
                placeholder="Label (e.g. Years Experience)" 
                className="flex-grow"
              />
            </div>
          ))}
          <button 
            onClick={addStat}
            className='text-sm text-indigo-600 mt-2 font-medium hover:underline'
          >
            + Add Statistic
          </button>
        </div>
      </div>
    </div>
  );
}
