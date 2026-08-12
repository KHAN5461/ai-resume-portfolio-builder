import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateHeroSection } from '@/store/portfolioSlice';

export default function HeroForm() {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.portfolios[portfolioId]);
  
  if (!portfolioData) return null;
  const heroData = portfolioData.heroSection || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateHeroSection({ id: portfolioId, data: { [name]: value } }));
  };

  const handleCtaChange = (ctaKey, field, value) => {
    dispatch(updateHeroSection({ 
      id: portfolioId, 
      data: { 
        [ctaKey]: { ...heroData[ctaKey], [field]: value } 
      } 
    }));
  };

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-indigo-500 border-t-4 mt-10 bg-white'>
      <h2 className='font-bold text-lg'>Hero Section</h2>
      <p>Edit the main landing section of your portfolio</p>

      <div className='grid grid-cols-1 gap-4 mt-5'>
        <div>
          <label className='text-sm font-semibold'>Greeting</label>
          <Input name="greeting" value={heroData.greeting || ""} onChange={handleChange} placeholder="e.g. Hello World" />
        </div>
        <div>
          <label className='text-sm font-semibold'>Headline</label>
          <Input name="headline" value={heroData.headline || ""} onChange={handleChange} placeholder="e.g. I build things for the web" />
        </div>
        <div>
          <label className='text-sm font-semibold'>Subheadline</label>
          <Textarea name="subheadline" value={heroData.subheadline || ""} onChange={handleChange} placeholder="Brief introduction..." />
        </div>
        
        <div className='grid grid-cols-2 gap-4 border-t pt-4 mt-2'>
          <div>
            <label className='text-sm font-semibold'>Primary CTA Text</label>
            <Input value={heroData.primaryCta?.text || ""} onChange={(e) => handleCtaChange('primaryCta', 'text', e.target.value)} placeholder="e.g. View Resume" />
          </div>
          <div>
            <label className='text-sm font-semibold'>Primary CTA Link</label>
            <Input value={heroData.primaryCta?.link || ""} onChange={(e) => handleCtaChange('primaryCta', 'link', e.target.value)} placeholder="e.g. #projects" />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-semibold'>Secondary CTA Text</label>
            <Input value={heroData.secondaryCta?.text || ""} onChange={(e) => handleCtaChange('secondaryCta', 'text', e.target.value)} placeholder="e.g. Contact Me" />
          </div>
          <div>
            <label className='text-sm font-semibold'>Secondary CTA Link</label>
            <Input value={heroData.secondaryCta?.link || ""} onChange={(e) => handleCtaChange('secondaryCta', 'link', e.target.value)} placeholder="e.g. mailto:email@example.com" />
          </div>
        </div>
        
        <div className='border-t pt-4 mt-2'>
          <label className='text-sm font-semibold'>Terminal Code Snippet</label>
          <Textarea name="terminalCodeSnippet" value={heroData.terminalCodeSnippet || ""} onChange={handleChange} placeholder="npm install awesome-developer" className="font-mono bg-zinc-900 text-green-400 mt-2" />
        </div>
      </div>
    </div>
  );
}
