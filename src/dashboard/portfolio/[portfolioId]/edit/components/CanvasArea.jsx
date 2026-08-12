import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableBlock from './SortableBlock';

export default function CanvasArea({ blocks, previewMode, activeBlockId, setActiveBlockId }) {
  const containerClass = previewMode === 'mobile' 
    ? 'w-[375px] h-[812px] rounded-[2.5rem] border-[12px] border-[#151b2d] shadow-2xl mt-12 bg-white flex flex-col overflow-hidden relative transition-all duration-500'
    : 'w-full max-w-[1200px] h-full bg-white shadow-lg mx-auto flex flex-col overflow-y-auto relative transition-all duration-500';

  if (!blocks || blocks.length === 0) {
    return (
      <div className="flex-1 w-full flex items-center justify-center p-8">
        <div className="border-2 border-dashed border-outline-variant rounded-xl p-12 text-center bg-surface-container/50 backdrop-blur-sm w-full max-w-lg">
          <div className="bg-surface-container-high w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-outline-variant">
             <span className="material-symbols-outlined text-stitch-primary text-[32px]">drag_indicator</span>
          </div>
          <h3 className="text-on-surface font-semibold text-xl mb-2">Your canvas is empty</h3>
          <p className="text-outline">Click any block from the left palette to start building your portfolio.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full overflow-y-auto custom-scrollbar p-6 flex justify-center pb-32">
      <div className={containerClass}>
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white w-full h-full text-slate-900">
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map((block) => (
              <SortableBlock 
                key={block.id} 
                block={block} 
                isActive={activeBlockId === block.id}
                onClick={() => setActiveBlockId(block.id)}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}
