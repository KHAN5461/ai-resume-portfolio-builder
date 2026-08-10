import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import GlobalApi from './../../../../service/GlobalApi';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Palette, Type } from 'lucide-react';

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

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Colors Section */}
            <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
                <h3 className="font-headline-sm font-bold flex items-center gap-2 mb-4 text-on-surface">
                    <Palette className="w-5 h-5 text-stitch-primary" />
                    Color Palette
                </h3>
                <p className="font-body-sm text-on-surface-variant mb-6">Choose a primary accent color for your document.</p>
                
                <div className="grid grid-cols-5 gap-4">
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => onColorSelect(color)}
                            className={`h-10 w-full rounded-lg cursor-pointer transition-all hover:scale-110 flex items-center justify-center ${selectedColor === color ? 'ring-2 ring-offset-2 ring-stitch-primary shadow-md' : 'border border-outline-variant/20 hover:shadow-sm'}`}
                            style={{ background: color }}
                            aria-label={`Select color ${color}`}
                        >
                            {selectedColor === color && (
                                <span className="material-symbols-outlined text-white text-[20px] drop-shadow-md">check</span>
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
