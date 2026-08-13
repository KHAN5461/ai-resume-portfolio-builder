import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import GlobalApi from './../../../../service/GlobalApi';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Palette, Type, LayoutTemplate } from 'lucide-react';

const TEMPLATES = [
  { id: 'Classic', name: 'Classic Professional', desc: 'Clean, elegant, and traditional.' },
  { id: 'Modern', name: 'Modern Sidebar', desc: 'Sleek sidebar layout for a contemporary look.' },
  { id: 'Minimal', name: 'Minimalist Clean', desc: 'Focus strictly on content with zero distractions.' },
  { id: 'MinimalImage', name: 'Creative Profile', desc: 'Includes your profile picture.' }
];

const COLORS = [
  "#6F42C1", "#1E40AF", "#0369A1", "#0D9488", "#15803D",
  "#B45309", "#B91C1C", "#BE185D", "#4C1D95", "#0F172A",
  "#334155", "#52525B", "#F59E0B", "#10B981", "#3B82F6"
];

const FONTS = [
  { name: 'Inter', class: 'font-sans' },
  { name: 'Merriweather', class: 'font-serif' },
  { name: 'Roboto Mono', class: 'font-mono' },
  { name: 'Outfit', class: 'font-outfit' }, // If defined
];

export default function ThemeBuilder() {
    const dispatch = useDispatch();
    const resumeInfo = useSelector(state => state.resume.resumeData);
    const [selectedColor, setSelectedColor] = useState(resumeInfo?.themeColor || COLORS[0]);
    const [selectedFont, setSelectedFont] = useState(resumeInfo?.themeFont || FONTS[0].name);
    const [selectedTemplate, setSelectedTemplate] = useState(resumeInfo?.themeTemplate || TEMPLATES[0].id);
    const { resumeId } = useParams();

    const onColorSelect = (color) => {
        setSelectedColor(color);
        dispatch(setResumeData({
            ...resumeInfo,
            themeColor: color
        }));
        const data = { data: { themeColor: color } };
        GlobalApi.UpdateResumeDetail(resumeId, data).then(() => {
            toast.success('Theme color updated');
        }).catch(() => toast.error('Failed to update theme'));
    }

    const onFontSelect = (font) => {
        setSelectedFont(font);
        dispatch(setResumeData({
            ...resumeInfo,
            themeFont: font
        }));
        const data = { data: { themeFont: font } };
        GlobalApi.UpdateResumeDetail(resumeId, data).then(() => {
            toast.success('Typography updated');
        }).catch(() => toast.error('Failed to update typography'));
    }

    const onTemplateSelect = (templateId) => {
        setSelectedTemplate(templateId);
        dispatch(setResumeData({
            ...resumeInfo,
            themeTemplate: templateId
        }));
        const data = { data: { themeTemplate: templateId } };
        GlobalApi.UpdateResumeDetail(resumeId, data).then(() => {
            toast.success('Template updated');
        }).catch(() => toast.error('Failed to update template'));
    }

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Templates Section */}
            <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
                <h3 className="font-headline-sm font-bold flex items-center gap-2 mb-4 text-on-surface">
                    <LayoutTemplate className="w-5 h-5 text-stitch-primary" />
                    Resume Template
                </h3>
                <p className="font-body-sm text-on-surface-variant mb-6">Choose the layout that best fits your industry.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TEMPLATES.map((tpl) => (
                        <button
                            key={tpl.id}
                            onClick={() => onTemplateSelect(tpl.id)}
                            className={`p-4 text-left rounded-xl border transition-all ${selectedTemplate === tpl.id ? 'border-stitch-primary bg-stitch-primary/5 ring-1 ring-stitch-primary shadow-sm' : 'border-outline-variant/40 hover:border-stitch-primary/40 bg-surface'}`}
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
                <p className="font-body-sm text-on-surface-variant mb-6">Choose a primary accent color for your document.</p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => onColorSelect(color)}
                            className={`h-12 w-12 rounded-full cursor-pointer transition-all hover:scale-110 flex items-center justify-center ${selectedColor === color ? 'ring-4 ring-offset-2 ring-stitch-primary shadow-lg scale-110' : 'border border-outline-variant/20 shadow-sm hover:shadow-md'}`}
                            style={{ background: color }}
                            aria-label={`Select color ${color}`}
                        >
                            {selectedColor === color && (
                                <span className="material-symbols-outlined text-white text-[24px] drop-shadow-md font-bold">check</span>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Typography Section */}
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
                            onClick={() => onFontSelect(font.name)}
                            className={`p-4 text-left rounded-xl border transition-all ${selectedFont === font.name ? 'border-stitch-primary bg-stitch-primary/5 ring-1 ring-stitch-primary' : 'border-outline-variant/40 hover:border-stitch-primary/40 bg-surface'}`}
                        >
                            <span className={`text-lg font-bold block ${font.class}`}>{font.name}</span>
                            <span className="font-body-sm text-on-surface-variant">The quick brown fox jumps over the lazy dog.</span>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    )
}
