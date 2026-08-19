import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { removeBlock, moveBlockUp, moveBlockDown } from '@/store/portfolioSlice';
import { useParams } from 'react-router-dom';

const HeroBlock = React.lazy(() => import('@/components/blocks/HeroBlock'));
const ProjectsBlock = React.lazy(() => import('@/components/blocks/ProjectsBlock'));
const AboutBlock = React.lazy(() => import('@/components/blocks/AboutBlock'));
const ExperienceBlock = React.lazy(() => import('@/components/blocks/ExperienceBlock'));
const SkillsBlock = React.lazy(() => import('@/components/blocks/SkillsBlock'));
const ContactBlock = React.lazy(() => import('@/components/blocks/ContactBlock'));

const SortableBlock = ({ block, isActive, onClick, isPreview }) => {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  
  // Inject the global theme preset so blocks can adapt their layout natively
  const portfolioData = useSelector((state) => state.portfolio?.present?.portfolios?.[portfolioId]);
  const themePreset = portfolioData?.siteConfig?.themePreset || 'bento';
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleDelete = React.useCallback((e) => {
    e.stopPropagation();
    dispatch(removeBlock({ portfolioId, blockId: block.id }));
  }, [dispatch, portfolioId, block.id]);

  const renderedBlock = React.useMemo(() => {
    // Inject the theme preset into the block's data config if it doesn't already have one
    const enhancedData = { 
        ...block.data, 
        config: { ...block.data?.config, layout: themePreset } 
    };

    switch (block.type) {
      case 'HeroSection': return <HeroBlock data={enhancedData} />;
      case 'ProjectsGrid': return <ProjectsBlock data={enhancedData} />;
      case 'AboutSection': return <AboutBlock data={enhancedData} />;
      case 'WorkExperience': return <ExperienceBlock data={enhancedData} />;
      case 'SkillsGrid': return <SkillsBlock data={enhancedData} />;
      case 'ContactForm': return <ContactBlock data={enhancedData} />;
      default: return (
        <div className="w-full bg-slate-50 min-h-[120px] p-8 flex items-center justify-center border-b border-slate-200">
          <div className="text-center">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{block.type}</div>
            <p className="text-slate-500">Placeholder for {block.type}</p>
          </div>
        </div>
      );
    }
  }, [block.type, block.data, themePreset]);

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      onClick={onClick}
      className={`relative group w-full ${!isPreview ? 'cursor-pointer border-2 transition-colors' : ''} ${!isPreview && isActive ? 'border-[#6366f1]' : ''} ${!isPreview && !isActive ? 'border-transparent hover:border-[#c0c1ff]/50' : ''}`}
    >
      {/* Block Controls (Hover/Active) */}
      {!isPreview && (isActive || isDragging) && (
        <div className="absolute top-2 right-2 bg-surface-container rounded-lg shadow-lg border border-outline-variant flex items-center p-1 z-10 gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          {/* Mobile Reorder Buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); dispatch(moveBlockUp({ portfolioId, blockId: block.id })); }}
            className="md:hidden p-1.5 text-outline hover:text-stitch-primary hover:bg-surface-variant rounded"
            title="Move up"
          >
            <ArrowUp size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); dispatch(moveBlockDown({ portfolioId, blockId: block.id })); }}
            className="md:hidden p-1.5 text-outline hover:text-stitch-primary hover:bg-surface-variant rounded"
            title="Move down"
          >
            <ArrowDown size={16} />
          </button>
          
          <button 
            {...attributes} 
            {...listeners}
            className="p-1.5 text-outline hover:text-stitch-primary hover:bg-surface-variant rounded cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical size={16} />
          </button>
          <div className="w-[1px] h-4 bg-surface-variant"></div>
          <button 
            onClick={handleDelete}
            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded"
            title="Remove block"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* Render the actual block content */}
      <div className="w-full min-h-[120px] pointer-events-none select-none overflow-hidden relative">
        <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Loading {block.type}...</div>}>
          {renderedBlock}
        </React.Suspense>
      </div>
    </div>
  );
};

export default React.memo(SortableBlock, (prevProps, nextProps) => {
  return prevProps.block.id === nextProps.block.id && 
         prevProps.block.type === nextProps.block.type &&
         prevProps.isActive === nextProps.isActive &&
         prevProps.isPreview === nextProps.isPreview;
});
