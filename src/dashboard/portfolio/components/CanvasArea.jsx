import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { duplicateBlock, removeBlock, updatePortfolioData } from '@/store/portfolioSlice';
import { Copy, Eye, EyeOff, Trash2, Bot } from 'lucide-react';
import HeroSection from '../../../portfolio/components/HeroSection';
import AboutSection from '../../../portfolio/components/AboutSection';
import ProjectsSection from '../../../portfolio/components/ProjectsSection';
import SkillsSection from '../../../portfolio/components/SkillsSection';
import ContactSection from '../../../portfolio/components/ContactSection';
import PortfolioNav from '../../../portfolio/components/PortfolioNav';
import PortfolioFooter from '../../../portfolio/components/PortfolioFooter';
import GeneratePortfolioModal from './GeneratePortfolioModal';

// This is our BlockRenderer
const BlockRenderer = ({ block, portfolioData }) => {
  // Use type if available, fallback to id for legacy
  const type = block.type || block.id;
  switch (type) {
    case 'hero': return <HeroSection data={portfolioData.heroSection} />;
    case 'about': return <AboutSection data={portfolioData.aboutSection} />;
    case 'projects': return <ProjectsSection data={portfolioData.projectsSection} />;
    case 'skills': return <SkillsSection data={portfolioData.skillsSection} />;
    case 'contact': return <ContactSection data={portfolioData.contactSection} />;
    default: return null;
  }
};

export default function CanvasArea({ blocks, portfolioData, onSelectBlock, activeBlockId, onOpenAi }) {
  const [isGenerateModalOpen, setIsGenerateModalOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { portfolioId } = useParams();

  const handleToggleVisibility = (e, id, currentVisibility) => {
    e.stopPropagation();
    const newLayout = blocks.map(item => 
      item.id === id ? { ...item, visible: !currentVisibility } : item
    );
    dispatch(updatePortfolioData({ id: portfolioId, data: { siteConfig: { ...portfolioData?.siteConfig, layout: newLayout } } }));
  };

  const handleDuplicate = (e, id) => {
    e.stopPropagation();
    dispatch(duplicateBlock({ portfolioId, blockId: id }));
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(removeBlock({ portfolioId, blockId: id }));
  };

  // Basic semantic check
  const getSemanticQuality = (block) => {
    if (block.type === 'hero' && !portfolioData.heroSection?.headline) return 'red';
    if (block.type === 'about' && portfolioData.aboutSection?.bioDescription?.length < 50) return 'yellow';
    if (block.type === 'projects' && (!portfolioData.projectsSection || portfolioData.projectsSection.length === 0)) return 'red';
    return 'green';
  };
  if (!blocks || blocks.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
        {/* Ghost Overlay Grid Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-col items-center justify-center gap-6 p-10">
          <div className="w-full max-w-4xl h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="flex gap-6 w-full max-w-4xl">
            <div className="flex-1 h-96 bg-slate-200 rounded-2xl animate-pulse delay-75"></div>
            <div className="flex-1 h-96 bg-slate-200 rounded-2xl animate-pulse delay-150"></div>
          </div>
          <div className="w-full max-w-4xl h-48 bg-slate-200 rounded-2xl animate-pulse delay-300"></div>
        </div>

        {/* Action Center */}
        <div className="text-center space-y-6 relative z-10 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md mx-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
          </div>
          <div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">Blank Canvas</h2>
             <p className="text-slate-500 mb-6">Let AI scaffold a beautiful portfolio from your resume data, or start building manually from the left panel.</p>
          </div>
          <button 
            onClick={() => setIsGenerateModalOpen(true)}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transition-colors"
          >
            Generate Portfolio
          </button>
        </div>
        <GeneratePortfolioModal isOpen={isGenerateModalOpen} onClose={() => setIsGenerateModalOpen(false)} />
      </div>
    );
  }

  // Theme styles based on accentColor
  const style = {
    '--accent': portfolioData.siteConfig?.accentColor || '#6366f1',
  };

  const themeMode = portfolioData.siteConfig?.themeMode || 'light';

  return (
    <div className={`h-full w-full bg-white dark:bg-slate-950 overflow-y-auto custom-scrollbar`} style={style}>
        {/* Navigation */}
        <PortfolioNav data={portfolioData} blocks={blocks} />

        {blocks.map((block) => {
          const isActive = activeBlockId === block.id;
          const quality = getSemanticQuality(block);
          
          return (
          <div 
            key={block.id}
            id={block.id}
            onClick={() => onSelectBlock && onSelectBlock(block.id)}
            className={`relative group border-b border-gray-100 dark:border-slate-800 transition-all cursor-pointer ${isActive ? 'bg-indigo-50/50 dark:bg-indigo-900/10 ring-4 ring-indigo-500/20 z-10' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}
          >
            {/* Semantic Quality Dot */}
            <div 
              onClick={(e) => { e.stopPropagation(); onOpenAi && onOpenAi(); }}
              className={`absolute top-4 left-4 w-3 h-3 rounded-full cursor-pointer hover:scale-125 transition-transform z-20 shadow-sm ${quality === 'green' ? 'bg-emerald-500' : quality === 'yellow' ? 'bg-amber-400' : 'bg-rose-500'}`}
              title="Click for AI Optimization"
            />

            {/* Contextual Action Bar */}
            {isActive && (
               <div className="absolute top-4 right-4 flex items-center gap-1 bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-gray-200 dark:border-slate-700 p-1 z-30 animate-in fade-in zoom-in-95">
                 <button 
                   onClick={(e) => handleDuplicate(e, block.id)}
                   className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
                   title="Duplicate Section"
                 >
                   <Copy className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={(e) => handleToggleVisibility(e, block.id, block.visible)}
                   className={`p-1.5 rounded-md transition-colors ${block.visible ? 'text-gray-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30' : 'text-rose-500 bg-rose-50 dark:bg-rose-900/30'}`}
                   title={block.visible ? "Hide Section" : "Show Section"}
                 >
                   {block.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                 </button>
                 {block.id !== 'hero' && !block.id.startsWith('hero_') && (
                   <button 
                     onClick={(e) => handleDelete(e, block.id)}
                     className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md transition-colors"
                     title="Delete Section"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 )}
               </div>
            )}

            <div className={`pointer-events-none transition-all ${!block.visible ? 'opacity-40 grayscale' : ''}`}>
               <BlockRenderer block={block} portfolioData={portfolioData} />
            </div>
           </div>
         )})}

        {/* Footer */}
        <PortfolioFooter data={portfolioData} />
    </div>
  );
}
