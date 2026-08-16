import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePortfolioData, moveBlockUp, moveBlockDown, addBlock } from '@/store/portfolioSlice';
import { ArrowUp, ArrowDown, Eye, EyeOff, LayoutList, Plus, FolderGit2, Briefcase, User, Mail, GraduationCap } from 'lucide-react';
import { useParams } from 'react-router-dom';

const defaultLayout = [
  { id: 'hero', visible: true, name: 'Hero' },
  { id: 'about', visible: true, name: 'About' },
  { id: 'projects', visible: true, name: 'Projects' },
  { id: 'skills', visible: true, name: 'Skills' },
  { id: 'contact', visible: true, name: 'Contact' }
];

export default function SectionManager({ activeBlockId, setActiveBlockId }) {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.present.portfolios[portfolioId]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  
  const layout = portfolioData?.siteConfig?.layout || defaultLayout;

  const handleSectionClick = (id) => {
    setActiveBlockId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleMove = (e, blockId, direction) => {
    e.stopPropagation();
    if (direction === 'up') dispatch(moveBlockUp({ portfolioId, blockId }));
    else dispatch(moveBlockDown({ portfolioId, blockId }));
  };

  const toggleVisibility = (e, id) => {
    e.stopPropagation();
    const newLayout = layout.map(item => 
      item.id === id ? { ...item, visible: !item.visible } : item
    );
    
    dispatch(updatePortfolioData({
      id: portfolioId,
      data: {
        siteConfig: {
          ...portfolioData?.siteConfig,
          layout: newLayout
        }
      }
    }));
  };

  return (
    <div className="flex flex-col h-full w-[320px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm relative z-20">
      <div className="px-5 py-4 flex items-center gap-3 border-b border-gray-200 dark:border-slate-800 shrink-0">
         <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <LayoutList className="w-4 h-4 text-slate-600 dark:text-slate-300" />
         </div>
         <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Sections</h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Manage layout & visibility</p>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar">
        {layout.map((item, index) => (
          <div 
            key={item.id}
            onClick={() => handleSectionClick(item.id)}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${activeBlockId === item.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 shadow-sm' : 'border-gray-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-800/50 hover:shadow-sm'}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col opacity-30 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => handleMove(e, item.id, 'up')}
                  disabled={index === 0}
                  className="hover:text-indigo-600 disabled:opacity-20 transition-colors"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button 
                  onClick={(e) => handleMove(e, item.id, 'down')}
                  disabled={index === layout.length - 1}
                  className="hover:text-indigo-600 disabled:opacity-20 transition-colors"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>
              <span className={`text-sm font-medium ${!item.visible ? 'text-gray-400 line-through' : (activeBlockId === item.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-200')}`}>
                {item.name}
              </span>
            </div>
            
            <button 
              onClick={(e) => toggleVisibility(e, item.id)}
              className={`p-1.5 rounded-md transition-colors ${item.visible ? 'text-gray-400 hover:bg-gray-100 hover:text-red-500' : 'text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100'}`}
              title={item.visible ? "Hide section" : "Show section"}
            >
              {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>

      {/* Add Section Button Area */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800 relative bg-gray-50/50 dark:bg-slate-900/50 shrink-0">
         {showAddMenu && (
           <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-2 border-b border-gray-100 dark:border-slate-700 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Add Block</div>
              <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                 <button onClick={() => { dispatch(addBlock({ portfolioId, blockType: 'projects', blockName: 'Projects' })); setShowAddMenu(false); }} className="w-full flex items-center gap-3 p-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <FolderGit2 className="w-4 h-4 text-indigo-500" /> Projects
                 </button>
                 <button onClick={() => { dispatch(addBlock({ portfolioId, blockType: 'skills', blockName: 'Skills' })); setShowAddMenu(false); }} className="w-full flex items-center gap-3 p-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <Briefcase className="w-4 h-4 text-emerald-500" /> Skills
                 </button>
                 <button onClick={() => { dispatch(addBlock({ portfolioId, blockType: 'about', blockName: 'About' })); setShowAddMenu(false); }} className="w-full flex items-center gap-3 p-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <User className="w-4 h-4 text-blue-500" /> About
                 </button>
                 <button onClick={() => { dispatch(addBlock({ portfolioId, blockType: 'contact', blockName: 'Contact' })); setShowAddMenu(false); }} className="w-full flex items-center gap-3 p-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    <Mail className="w-4 h-4 text-purple-500" /> Contact
                 </button>
              </div>
           </div>
         )}
         <button 
           onClick={() => setShowAddMenu(!showAddMenu)}
           className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-2"
         >
           <Plus className="w-4 h-4" /> Add Section
         </button>
      </div>
    </div>
  );
}
