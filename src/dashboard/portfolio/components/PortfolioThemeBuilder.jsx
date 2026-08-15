import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getContrastRatio, adjustColorForContrast } from '@/lib/colorUtils';

export default function PortfolioThemeBuilder() {
  const [isOpen, setIsOpen] = useState(false);
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.portfolios[portfolioId]);

  const currentTheme = portfolioData?.siteConfig?.themePreset || 'bento';
  const currentAccent = portfolioData?.siteConfig?.accentColor || '#6366f1';
  const themeMode = portfolioData?.siteConfig?.themeMode || 'light';
  
  const bgColor = themeMode === 'dark' ? '#020617' : '#FFFFFF';
  const contrastRatio = getContrastRatio(currentAccent, bgColor);
  const isLowContrast = contrastRatio < 4.5;

  const handleAutoAdjust = () => {
      const adjustedColor = adjustColorForContrast(currentAccent, bgColor);
      handleUpdate('accentColor', adjustedColor);
  };

  const presets = ['bento', 'modern', 'minimalist', 'creative'];
  const colors = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Rose', value: '#e11d48' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Sky', value: '#0ea5e9' },
  ];

  const handleUpdate = (key, value) => {
      dispatch({
          type: 'portfolio/updatePortfolioData',
          payload: {
              id: portfolioId,
              data: {
                  ...portfolioData,
                  siteConfig: {
                      ...portfolioData?.siteConfig,
                      [key]: value
                  }
              }
          }
      });
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant/30 rounded-md bg-surface text-on-surface text-sm font-medium hover:bg-surface-variant transition-colors shadow-sm"
      >
        <Palette className="w-4 h-4 text-stitch-primary" />
        Theme Options
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px]" onClick={() => setIsOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-12 left-0 w-[300px] bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 z-50 p-5"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-on-surface">Dynamic Theming</h3>
                <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:bg-surface-variant p-1 rounded-full"><X className="w-4 h-4"/></button>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-on-surface-variant block mb-3">Layout Architecture</label>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map(p => (
                    <button 
                      key={p} 
                      onClick={() => handleUpdate('themePreset', p)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium capitalize border transition-all ${currentTheme === p ? 'border-stitch-primary bg-stitch-primary/10 text-stitch-primary' : 'border-outline-variant/30 text-on-surface hover:border-outline-variant'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-on-surface-variant block mb-3">HSL Accent Palette</label>
                <div className="flex flex-wrap gap-3 mb-6">
                  {colors.map(c => (
                    <button
                      key={c.value}
                      onClick={() => handleUpdate('accentColor', c.value)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border border-black/10"
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    >
                      {currentAccent === c.value && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                  
                  {/* Custom color picker wrapper */}
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30 shadow-sm cursor-pointer hover:scale-110 transition-transform">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-green-500 to-blue-500 pointer-events-none"></div>
                    <input 
                      type="color" 
                      value={currentAccent}
                      onChange={(e) => handleUpdate('accentColor', e.target.value)}
                      className="absolute -top-4 -left-4 w-16 h-16 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {isLowContrast && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex flex-col items-start gap-2">
                        <span className="text-amber-800 text-xs font-medium">Low contrast: This color may be hard to read on the {themeMode} background.</span>
                        <button onClick={handleAutoAdjust} className="text-xs px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-md font-bold transition-colors w-full">
                            Auto-adjust
                        </button>
                    </div>
                )}

                <label className="text-sm font-medium text-on-surface-variant block mb-3">Color Mode</label>
                <div className="flex bg-surface-variant/30 rounded-lg p-1 gap-1 border border-outline-variant/20">
                  <button 
                    onClick={() => handleUpdate('themeMode', 'light')}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${portfolioData?.siteConfig?.themeMode === 'light' ? 'bg-surface shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => handleUpdate('themeMode', 'dark')}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${portfolioData?.siteConfig?.themeMode === 'dark' ? 'bg-surface shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
