import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import GlobalApi from './../../service/GlobalApi';
import { toast } from 'sonner';
import { Palette, Type, LayoutTemplate, Moon, Sun, Check } from 'lucide-react';
import { getContrastRatio, adjustColorForContrast, getForegroundHsl } from '@/lib/colorUtils';

const RESUME_TEMPLATES = [
  { id: 'Classic', name: 'Classic Professional', desc: 'Clean, elegant, and traditional.' },
  { id: 'Modern', name: 'Modern Sidebar', desc: 'Sleek sidebar layout for a contemporary look.' },
  { id: 'Minimal', name: 'Minimalist Clean', desc: 'Focus strictly on content with zero distractions.' },
  { id: 'MinimalImage', name: 'Creative Profile', desc: 'Includes your profile picture.' },
  { id: 'DataDense', name: 'Data-Dense Pro', desc: 'Max info density for engineers.' },
  { id: 'Interactive', name: 'Digital-First', desc: 'Interactive, clickable modern layout.' }
];

const PORTFOLIO_PRESETS = [
  { id: 'bento', name: 'Bento Grid', desc: 'Modern bento-box style layout.' },
  { id: 'story', name: 'Story Case Study', desc: 'Narrative-driven deep dive.' },
  { id: 'modern', name: 'Modern', desc: 'Sleek and contemporary design.' },
  { id: 'minimalist', name: 'Minimalist', desc: 'Clean and simple focus.' },
  { id: 'creative', name: 'Creative', desc: 'Bold and expressive.' }
];

const COLORS = [
  "#6F42C1", "#1E40AF", "#0369A1", "#0D9488", "#15803D",
  "#B45309", "#B91C1C", "#BE185D", "#4C1D95", "#0F172A",
  "#334155", "#52525B", "#F59E0B", "#10B981", "#3B82F6",
  "#6366f1", "#e11d48", "#8b5cf6", "#0ea5e9"
];

const FONTS = [
  { name: 'Inter', class: 'font-sans' },
  { name: 'Merriweather', class: 'font-serif' },
  { name: 'Roboto Mono', class: 'font-mono' },
  { name: 'Outfit', class: 'font-outfit' },
];

export default function SharedThemeBuilder({ type, documentId }) {
    const dispatch = useDispatch();
    
    // Get Data based on type
    const resumeInfo = useSelector(state => state.resume?.present?.resumeData);
    const portfolioData = useSelector((state) => state.portfolio?.present?.portfolios?.[documentId]);

    const isResume = type === 'resume';

    const currentTemplate = isResume ? (resumeInfo?.themeTemplate || RESUME_TEMPLATES[0].id) : (portfolioData?.siteConfig?.themePreset || 'bento');
    const currentColor = isResume ? (resumeInfo?.themeColor || COLORS[0]) : (portfolioData?.siteConfig?.accentColor || '#6366f1');
    const currentFont = isResume ? (resumeInfo?.themeFont || FONTS[0].name) : 'Inter';
    const currentMode = isResume ? 'light' : (portfolioData?.siteConfig?.themeMode || 'light');

    const templates = isResume ? RESUME_TEMPLATES : PORTFOLIO_PRESETS;

    const bgColor = currentMode === 'dark' ? '#020617' : '#FFFFFF';
    const contrastRatio = getContrastRatio(currentColor, bgColor);
    const isLowContrast = contrastRatio < 4.5;

    const handleUpdate = (key, value) => {
        if (isResume) {
            const newResumeInfo = { ...resumeInfo, [key]: value };
            dispatch(setResumeData(newResumeInfo));
            GlobalApi.UpdateResumeDetail(documentId, { data: { [key]: value } }).then(() => {
                toast.success('Theme updated');
            }).catch(() => toast.error('Failed to update theme'));
        } else {
            const siteConfigKeyMap = {
                'themeTemplate': 'themePreset',
                'themeColor': 'accentColor',
                'themeMode': 'themeMode'
            };
            const configKey = siteConfigKeyMap[key] || key;
            dispatch({
                type: 'portfolio/updatePortfolioData',
                payload: {
                    id: documentId,
                    data: {
                        ...portfolioData,
                        siteConfig: {
                            ...portfolioData?.siteConfig,
                            [configKey]: value
                        }
                    }
                }
            });
        }
    };

    const handleAutoAdjust = () => {
        const adjustedColor = adjustColorForContrast(currentColor, bgColor);
        handleUpdate('themeColor', adjustedColor);
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Layout Architecture */}
            <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
                <h3 className="font-headline-sm font-bold flex items-center gap-2 mb-4 text-on-surface">
                    <LayoutTemplate className="w-5 h-5 text-stitch-primary" />
                    Layout Architecture
                </h3>
                <p className="font-body-sm text-on-surface-variant mb-6">Choose the layout that best fits your needs.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((tpl) => (
                        <button
                            key={tpl.id}
                            onClick={() => handleUpdate('themeTemplate', tpl.id)}
                            className={`p-4 text-left rounded-xl border transition-all ${currentTemplate === tpl.id ? 'border-stitch-primary bg-stitch-primary/5 ring-1 ring-stitch-primary shadow-sm' : 'border-outline-variant/40 hover:border-stitch-primary/40 bg-surface'}`}
                        >
                            <span className="text-lg font-bold block mb-1 text-on-surface">{tpl.name}</span>
                            <span className="font-body-sm text-on-surface-variant leading-relaxed">{tpl.desc}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Colors Section */}
            <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
                <h3 className="font-headline-sm font-bold flex items-center gap-2 mb-4 text-on-surface">
                    <Palette className="w-5 h-5 text-stitch-primary" />
                    Color Palette
                </h3>
                <p className="font-body-sm text-on-surface-variant mb-6">Choose a primary accent color.</p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => handleUpdate('themeColor', color)}
                            className={`h-12 w-12 rounded-full cursor-pointer transition-all hover:scale-110 flex items-center justify-center shadow-sm ${currentColor === color ? 'ring-4 ring-offset-2 ring-stitch-primary shadow-lg scale-110' : 'border border-outline-variant/20 hover:shadow-md'}`}
                            style={{ background: color }}
                            aria-label={`Select color ${color}`}
                        >
                            {currentColor === color && (
                                <Check className="w-6 h-6 text-white drop-shadow-md" />
                            )}
                        </button>
                    ))}
                    
                    {/* Custom color picker */}
                    <div className="relative h-12 w-12 rounded-full overflow-hidden border border-outline-variant/30 shadow-sm cursor-pointer hover:scale-110 transition-transform">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-green-500 to-blue-500 pointer-events-none"></div>
                        <input 
                            type="color" 
                            value={currentColor}
                            onChange={(e) => handleUpdate('themeColor', e.target.value)}
                            className="absolute -top-4 -left-4 w-24 h-24 opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                {isLowContrast && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="text-amber-800 text-sm font-medium">Low contrast: This color may be hard to read on the {currentMode} background.</span>
                        <button onClick={handleAutoAdjust} className="text-sm px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-md font-bold transition-colors whitespace-nowrap">
                            Auto-adjust
                        </button>
                    </div>
                )}
                
                {/* Smart Theme Enforcement UI */}
                <div className="mt-6 p-4 rounded-xl border border-outline-variant/30 bg-surface">
                    <h4 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Design System Enforced
                    </h4>
                    <p className="text-xs text-on-surface-variant mb-4">
                        We automatically calculate WCAG-compliant contrast variants across your entire system to guarantee professional aesthetics.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg border border-outline-variant/20 flex flex-col gap-1 bg-surface-container-lowest">
                            <span className="text-[10px] uppercase font-bold text-outline">Primary Background</span>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border border-black/10 shadow-inner" style={{ background: currentColor }}></div>
                                <span className="text-xs font-mono text-on-surface">{currentColor}</span>
                            </div>
                        </div>
                        <div className="p-3 rounded-lg border border-outline-variant/20 flex flex-col gap-1 bg-surface-container-lowest">
                            <span className="text-[10px] uppercase font-bold text-outline">Calculated Foreground</span>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border border-black/10 shadow-inner" style={{ background: `hsl(${getForegroundHsl(currentColor).replace(/ /g, ', ')})` }}></div>
                                <span className="text-xs font-mono text-on-surface">WCAG Compliant</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Typography Section */}
            {isResume && (
                <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
                    <h3 className="font-headline-sm font-bold flex items-center gap-2 mb-4 text-on-surface">
                        <Type className="w-5 h-5 text-stitch-primary" />
                        Typography
                    </h3>
                    <p className="font-body-sm text-on-surface-variant mb-6">Select a font pairing that matches your personal brand.</p>
                    
                    <div className="flex flex-col gap-3">
                        {FONTS.map((font) => (
                            <button
                                key={font.name}
                                onClick={() => handleUpdate('themeFont', font.name)}
                                className={`p-4 text-left rounded-xl border transition-all ${currentFont === font.name ? 'border-stitch-primary bg-stitch-primary/5 ring-1 ring-stitch-primary' : 'border-outline-variant/40 hover:border-stitch-primary/40 bg-surface'}`}
                            >
                                <span className={`text-lg font-bold block ${font.class}`}>{font.name}</span>
                                <span className="font-body-sm text-on-surface-variant">The quick brown fox jumps over the lazy dog.</span>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Theme Mode */}
            {!isResume && (
                <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
                    <h3 className="font-headline-sm font-bold flex items-center gap-2 mb-4 text-on-surface">
                        {currentMode === 'dark' ? <Moon className="w-5 h-5 text-stitch-primary" /> : <Sun className="w-5 h-5 text-stitch-primary" />}
                        Theme Mode
                    </h3>
                    <p className="font-body-sm text-on-surface-variant mb-6">Select a color scheme for your portfolio.</p>

                    <div className="flex bg-surface-variant/30 rounded-lg p-1 gap-1 border border-outline-variant/20 max-w-sm">
                        <button 
                            onClick={() => handleUpdate('themeMode', 'light')}
                            className={`flex-1 py-3 rounded-md text-sm font-medium transition-all ${currentMode === 'light' ? 'bg-surface shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                            Light
                        </button>
                        <button 
                            onClick={() => handleUpdate('themeMode', 'dark')}
                            className={`flex-1 py-3 rounded-md text-sm font-medium transition-all ${currentMode === 'dark' ? 'bg-surface shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                            Dark
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}
