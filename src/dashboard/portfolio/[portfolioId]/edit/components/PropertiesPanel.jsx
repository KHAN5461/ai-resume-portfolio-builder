import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateBlock, updatePortfolioData } from '@/store/portfolioSlice';
import { Settings2, Type, Link, Image as ImageIcon, Paintbrush, Layout } from 'lucide-react';

export default function PropertiesPanel({ portfolioId, activeBlockId, blocks, siteConfig }) {
  const dispatch = useDispatch();
  
  const handleThemeChange = (key, value) => {
    dispatch(updatePortfolioData({
      id: portfolioId,
      data: { siteConfig: { ...siteConfig, [key]: value } }
    }));
  };

  if (!activeBlockId) {
    return (
      <div className="flex flex-col h-full bg-surface-container">
        <div className="p-4 border-b border-outline-variant">
          <h2 className="text-stitch-primary font-medium text-lg flex items-center gap-2">
            <Paintbrush size={20} /> Global Theme
          </h2>
          <p className="text-outline text-xs mt-1">Configure your portfolio's base design</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-outline uppercase tracking-wider flex items-center gap-1.5">
              <Paintbrush size={14} /> Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={siteConfig?.accentColor || '#6366f1'} 
                onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <span className="text-on-surface font-mono text-sm bg-surface-container-high px-3 py-2 rounded-md border border-outline-variant">
                {siteConfig?.accentColor || '#6366f1'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-outline uppercase tracking-wider flex items-center gap-1.5">
              <Type size={14} /> Font Family
            </label>
            <select 
              value={siteConfig?.fontFamily || 'inter'}
              onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
              className="w-full bg-surface-container-high border border-outline-variant text-on-surface rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#c0c1ff]"
            >
              <option value="inter">Inter (Modern)</option>
              <option value="playfair">Playfair Display (Elegant)</option>
              <option value="fira-code">Fira Code (Developer)</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  const block = blocks.find(b => b.id === activeBlockId);
  if (!block) return null;

  const handleChange = (key, value) => {
    dispatch(updateBlock({
      portfolioId,
      blockId: activeBlockId,
      data: { [key]: value }
    }));
  };

  // We can render different form fields based on block.type
  return (
    <div className="flex flex-col h-full bg-surface-container">
      <div className="p-4 border-b border-outline-variant">
        <h2 className="text-stitch-primary font-medium text-lg flex items-center gap-2">
          <Settings2 size={20} /> Block Properties
        </h2>
        <p className="text-outline text-xs mt-1">Editing: <span className="text-on-surface font-semibold">{block.type}</span></p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
        {block.type === 'HeroSection' && (
          <>
            <FormInput 
              label="Headline" 
              icon={<Type size={14} />} 
              value={block.data?.headline || ''} 
              onChange={(e) => handleChange('headline', e.target.value)} 
            />
            <FormTextarea 
              label="Subheadline" 
              icon={<Type size={14} />} 
              value={block.data?.subheadline || ''} 
              onChange={(e) => handleChange('subheadline', e.target.value)} 
            />
          </>
        )}
        
        {block.type === 'AboutSection' && (
          <>
            <FormTextarea 
              label="Bio" 
              icon={<Type size={14} />} 
              value={block.data?.bio || ''} 
              onChange={(e) => handleChange('bio', e.target.value)} 
            />
          </>
        )}

        {block.type === 'ContactForm' && (
          <>
            <FormInput 
              label="Contact Email" 
              icon={<Type size={14} />} 
              value={block.data?.email || ''} 
              onChange={(e) => handleChange('email', e.target.value)} 
            />
          </>
        )}
        
        {!['HeroSection', 'AboutSection', 'ContactForm'].includes(block.type) && (
           <div className="text-outline text-sm text-center p-4 bg-surface-container-high rounded-lg border border-outline-variant">
              Property controls for {block.type} will appear here soon!
           </div>
        )}
      </div>
    </div>
  );
}

// Reusable UI components for the panel
function FormInput({ label, icon, value, onChange }) {
  const [localValue, setLocalValue] = useState(value);

  // Sync from props if external change happens
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce to Redux
  useEffect(() => {
    if (localValue === value) return;
    const timeoutId = setTimeout(() => {
      onChange({ target: { value: localValue } });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localValue, onChange, value]);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-outline uppercase tracking-wider flex items-center gap-1.5">
        {icon} {label}
      </label>
      <input 
        type="text" 
        value={localValue} 
        onChange={(e) => setLocalValue(e.target.value)}
        className="w-full bg-surface-container-high border border-outline-variant text-on-surface rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#c0c1ff] transition-colors"
      />
    </div>
  );
}

function FormTextarea({ label, icon, value, onChange }) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (localValue === value) return;
    const timeoutId = setTimeout(() => {
      onChange({ target: { value: localValue } });
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localValue, onChange, value]);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-outline uppercase tracking-wider flex items-center gap-1.5">
        {icon} {label}
      </label>
      <textarea 
        value={localValue} 
        onChange={(e) => setLocalValue(e.target.value)}
        rows={4}
        className="w-full bg-surface-container-high border border-outline-variant text-on-surface rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#c0c1ff] transition-colors resize-none custom-scrollbar"
      />
    </div>
  );
}
