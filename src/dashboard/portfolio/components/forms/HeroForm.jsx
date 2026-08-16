import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateHeroSection } from '@/store/portfolioSlice';

const HeroForm = () => {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.present.portfolios[portfolioId]);
  
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
    <div className='space-y-6'>
      {/* Primary Content Group */}
      <div className="space-y-4">
         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Primary Content</h4>
         
         <div className="space-y-1.5">
           <label className='text-[13px] font-semibold text-gray-700 dark:text-gray-300'>Greeting</label>
           <Input name="greeting" value={heroData.greeting || ""} onChange={handleChange} placeholder="e.g. Hello World" className="h-9 text-sm" />
         </div>
         
         <div className="space-y-1.5">
           <label className='text-[13px] font-semibold text-gray-700 dark:text-gray-300'>Headline</label>
           <Input name="headline" value={heroData.headline || ""} onChange={handleChange} placeholder="e.g. I build things for the web" className="h-9 text-sm" />
         </div>
         
         <div className="space-y-1.5">
           <label className='text-[13px] font-semibold text-gray-700 dark:text-gray-300'>Subheadline</label>
           <Textarea name="subheadline" value={heroData.subheadline || ""} onChange={handleChange} placeholder="Brief introduction..." className="text-sm resize-none h-24 custom-scrollbar" />
         </div>
      </div>
        
      {/* Call to Actions Group */}
      <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Call to Actions</h4>
         
         <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl space-y-3 border border-gray-100 dark:border-slate-700/50">
            <h5 className="text-[11px] font-bold text-gray-500 uppercase">Primary Button</h5>
            <div className='grid grid-cols-2 gap-3'>
              <div className="space-y-1.5">
                <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>Text</label>
                <Input value={heroData.primaryCta?.text || ""} onChange={(e) => handleCtaChange('primaryCta', 'text', e.target.value)} placeholder="View Resume" className="h-8 text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>Link</label>
                <Input value={heroData.primaryCta?.link || ""} onChange={(e) => handleCtaChange('primaryCta', 'link', e.target.value)} placeholder="#projects" className="h-8 text-xs" />
              </div>
            </div>
         </div>

         <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl space-y-3 border border-gray-100 dark:border-slate-700/50">
            <h5 className="text-[11px] font-bold text-gray-500 uppercase">Secondary Button</h5>
            <div className='grid grid-cols-2 gap-3'>
              <div className="space-y-1.5">
                <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>Text</label>
                <Input value={heroData.secondaryCta?.text || ""} onChange={(e) => handleCtaChange('secondaryCta', 'text', e.target.value)} placeholder="Contact Me" className="h-8 text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>Link</label>
                <Input value={heroData.secondaryCta?.link || ""} onChange={(e) => handleCtaChange('secondaryCta', 'link', e.target.value)} placeholder="mailto:..." className="h-8 text-xs" />
              </div>
            </div>
         </div>
      </div>
        
      {/* Code Snippet Group */}
      <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Terminal Snippet</h4>
         <div className="space-y-1.5">
           <Textarea name="terminalCodeSnippet" value={heroData.terminalCodeSnippet || ""} onChange={handleChange} placeholder="npm install awesome-developer" className="font-mono bg-zinc-900 text-emerald-400 border-zinc-800 text-xs h-20 resize-none custom-scrollbar" />
         </div>
      </div>
    </div>
  );
}

export default React.memo(HeroForm);
