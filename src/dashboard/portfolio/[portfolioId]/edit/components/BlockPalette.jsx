import React from 'react';
import { useDispatch } from 'react-redux';
import { addBlock } from '@/store/portfolioSlice';
import { v4 as uuidv4 } from 'uuid';
import { LayoutTemplate, Image, Type, Briefcase, Code, AlignLeft, Send, Hash } from 'lucide-react';

const BLOCK_TYPES = [
  { type: 'HeroSection', label: 'Hero Section', icon: <Image size={18} /> },
  { type: 'AboutSection', label: 'About Me', icon: <Type size={18} /> },
  { type: 'ProjectsGrid', label: 'Projects', icon: <LayoutTemplate size={18} /> },
  { type: 'WorkExperience', label: 'Experience', icon: <Briefcase size={18} /> },
  { type: 'SkillsGrid', label: 'Tech Stack', icon: <Code size={18} /> },
  { type: 'Testimonials', label: 'Testimonials', icon: <AlignLeft size={18} /> },
  { type: 'ContactForm', label: 'Contact', icon: <Send size={18} /> },
];

export default function BlockPalette({ portfolioId }) {
  const dispatch = useDispatch();

  const handleAddBlock = (blockType) => {
    const newBlock = {
      id: `${blockType}-${uuidv4().slice(0, 8)}`,
      type: blockType,
      variant: 'default',
      data: {} // Default empty data, populated by the block itself
    };
    dispatch(addBlock({ portfolioId, block: newBlock }));
  };

  return (
    <div className="flex flex-col h-full bg-surface-container">
      <div className="p-4 border-b border-outline-variant">
        <h2 className="text-stitch-primary font-medium text-lg flex items-center gap-2">
          <LayoutTemplate size={20} /> Add Blocks
        </h2>
        <p className="text-outline text-xs mt-1">Click to add to your canvas</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
        {BLOCK_TYPES.map((block) => (
          <button
            key={block.type}
            onClick={() => handleAddBlock(block.type)}
            className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-high border border-outline-variant hover:border-[#c0c1ff] hover:bg-[#1e253a] transition-all text-left group"
          >
            <div className="bg-surface-variant p-2 rounded-md text-stitch-primary group-hover:bg-[#c0c1ff] group-hover:text-[#151b2d] transition-colors">
              {block.icon}
            </div>
            <span className="text-on-surface font-medium text-sm flex-1">{block.label}</span>
            <Plus size={16} className="text-outline group-hover:text-stitch-primary transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}

const Plus = ({size, className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
)
