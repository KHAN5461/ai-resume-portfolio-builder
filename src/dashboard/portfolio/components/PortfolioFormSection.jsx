import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutTemplate, Home, User, Briefcase, Wrench, Mail, GripVertical, Eye, EyeOff } from 'lucide-react';
import HeroForm from './forms/HeroForm';
import AboutForm from './forms/AboutForm';
import ProjectsForm from './forms/ProjectsForm';
import SkillsForm from './forms/SkillsForm';
import ContactForm from './forms/ContactForm';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PortfolioThemeBuilder from './PortfolioThemeBuilder';
import { useDispatch, useSelector } from 'react-redux';
import { updatePortfolioData } from '@/store/portfolioSlice';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const defaultLayout = [
  { id: 'hero', visible: true, name: 'Hero' },
  { id: 'about', visible: true, name: 'About' },
  { id: 'projects', visible: true, name: 'Projects' },
  { id: 'skills', visible: true, name: 'Skills' },
  { id: 'contact', visible: true, name: 'Contact' }
];

const icons = {
  hero: <Home className="w-4 h-4" />,
  about: <User className="w-4 h-4" />,
  projects: <Briefcase className="w-4 h-4" />,
  skills: <Wrench className="w-4 h-4" />,
  contact: <Mail className="w-4 h-4" />
};

function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex-shrink-0 flex items-center bg-surface-container-low border border-outline-variant/30 rounded-lg overflow-hidden transition-all ${props.active ? 'ring-2 ring-stitch-primary shadow-sm' : ''} ${!props.visible ? 'opacity-50' : ''}`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="px-2 py-3 cursor-grab active:cursor-grabbing text-on-surface-variant hover:bg-surface-variant/50 transition-colors"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      
      <button
        onClick={props.onClick}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all ${props.active ? 'text-stitch-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
      >
        {icons[props.id]}
        <span className="hidden sm:inline">{props.name}</span>
      </button>

      <button 
        onClick={props.onToggle}
        className="px-2 py-3 text-on-surface-variant hover:bg-surface-variant/50 transition-colors"
        title="Toggle Visibility"
      >
        {props.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function PortfolioFormSection() {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.present.portfolios[portfolioId]);
  
  const layout = portfolioData?.siteConfig?.layout || defaultLayout;
  
  const [activeFormId, setActiveFormId] = useState(layout[0]?.id || 'hero');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = layout.findIndex((item) => item.id === active.id);
      const newIndex = layout.findIndex((item) => item.id === over.id);
      
      const newLayout = arrayMove(layout, oldIndex, newIndex);
      
      dispatch(updatePortfolioData({
        id: portfolioId,
        data: {
          siteConfig: {
            ...portfolioData?.siteConfig,
            layout: newLayout
          }
        }
      }));
    }
  };

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
    <div className="flex flex-col h-full">
      <div className='flex flex-col gap-4 mb-6 sticky top-0 bg-surface-container-lowest z-10 pb-4 border-b border-outline-variant/30'>
        <div className='flex justify-between items-center'>
          <div className="flex items-center gap-2">
            <PortfolioThemeBuilder />
          </div>
          <span className="text-sm font-medium text-on-surface-variant bg-surface-container py-1 px-3 rounded-full">Section Config</span>
        </div>
        
        {/* Sortable Navigation */}
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-2 w-full overflow-x-auto custom-scrollbar pb-2">
            <SortableContext 
              items={layout.map(i => i.id)}
              strategy={horizontalListSortingStrategy}
            >
              {layout.map((item) => (
                <SortableItem 
                  key={item.id} 
                  id={item.id}
                  name={item.name}
                  visible={item.visible}
                  active={activeFormId === item.id}
                  onClick={() => setActiveFormId(item.id)}
                  onToggle={() => toggleVisibility(item.id)}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>

      {/* Forms Pagination with Animation */}
      <div className="flex-1 overflow-visible relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFormId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeFormId === 'hero' && <HeroForm />}
            {activeFormId === 'about' && <AboutForm />}
            {activeFormId === 'projects' && <ProjectsForm />}
            {activeFormId === 'skills' && <SkillsForm />}
            {activeFormId === 'contact' && <ContactForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
