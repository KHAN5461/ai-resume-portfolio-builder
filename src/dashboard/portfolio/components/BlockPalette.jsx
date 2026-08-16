import React from 'react';
import { Home, User, Briefcase, Wrench, Mail, Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePortfolioData } from '@/store/portfolioSlice';
import { useParams } from 'react-router-dom';

const defaultLayout = [
  { id: 'hero', visible: true, name: 'Hero' },
  { id: 'about', visible: true, name: 'About' },
  { id: 'projects', visible: true, name: 'Projects' },
  { id: 'skills', visible: true, name: 'Skills' },
  { id: 'contact', visible: true, name: 'Contact' }
];

const icons = {
  hero: <Home className="w-5 h-5" />,
  about: <User className="w-5 h-5" />,
  projects: <Briefcase className="w-5 h-5" />,
  skills: <Wrench className="w-5 h-5" />,
  contact: <Mail className="w-5 h-5" />
};

export default function BlockPalette({ onSelectBlock, activeBlockId }) {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.present.portfolios[portfolioId]);
  
  const layout = portfolioData?.siteConfig?.layout || defaultLayout;

  const toggleVisibility = (id) => {
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
    <div className="flex flex-col h-full bg-surface border-r border-outline-variant/30 w-20 items-center py-6 gap-4 shrink-0 shadow-[4px_0px_24px_rgba(0,0,0,0.02)] z-10 relative">
       {layout.map(item => (
         <div key={item.id} className="flex flex-col items-center gap-1 group relative">
           <button 
             onClick={() => onSelectBlock(item.id)}
             className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activeBlockId === item.id ? 'bg-primary-container text-on-primary-container shadow-sm ring-2 ring-primary' : 'bg-surface-container-low text-on-surface hover:bg-surface-variant hover:text-primary'}`}
             title={`Edit ${item.name}`}
           >
             {icons[item.id]}
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); toggleVisibility(item.id); }}
             className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center border border-outline-variant shadow-sm transition-all ${item.visible ? 'bg-white text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100' : 'bg-red-50 text-red-500 opacity-100'}`}
             title="Toggle Visibility"
           >
             {item.visible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
           </button>
         </div>
       ))}
    </div>
  );
}
