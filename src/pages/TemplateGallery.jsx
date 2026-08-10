import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/auth';
import { motion } from 'framer-motion';

const TEMPLATES = [
  { id: 1, name: 'Minimalist Professional', category: 'Professional', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&q=80', description: 'Clean lines and lots of whitespace. Perfect for corporate roles.' },
  { id: 2, name: 'Creative Portfolio', category: 'Creative', image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&q=80', description: 'Showcase your work with big visuals and a modern layout.' },
  { id: 3, name: 'Tech Developer', category: 'Tech', image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=500&q=80', description: 'Optimized for ATS with sections for skills and GitHub links.' },
  { id: 4, name: 'Executive Summary', category: 'Professional', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80', description: 'A classic, dense layout for experienced leaders.' },
  { id: 5, name: 'Modern Startup', category: 'Creative', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80', description: 'Stand out with bold colors and unique typography.' },
  { id: 6, name: 'Academic CV', category: 'Academic', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80', description: 'Comprehensive multi-page layout for publications and research.' },
];

const CATEGORIES = ['All', 'Professional', 'Creative', 'Tech', 'Academic'];

export default function TemplateGallery() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col md:flex-row antialiased overflow-x-hidden font-body-md text-body-md">
      {/* Top Navigation (Mobile Only) */}
      <header className="flex justify-between items-center h-16 px-gutter max-w-7xl mx-auto w-full fixed top-0 z-50 bg-surface/80 backdrop-blur-md shadow-sm md:hidden">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-stitch-primary font-headline-md text-[24px]" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
          <span className="font-headline-md text-[24px] font-bold text-stitch-primary">Sparkfolio</span>
        </div>
        <div className="flex items-center gap-md">
          <button className="w-8 h-8 rounded-full bg-surface-container overflow-hidden focus:outline-none focus:ring-2 focus:ring-stitch-primary">
            <img alt="User profile photo" className="w-full h-full object-cover" src={user?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAx5bIktZuZF3YmZVL-zf0HlzheENE6MOGaEeQNWUF3By2N0Z9w9GSARNuUBX2g1Wf7-gD5Nj7XVU4CmfGTbAWJhu-tx-hWwwSFUzew4Y8AktbsJP3w4HeK77qit9nhwgOhuZeAltabaJwuk5SS2CFWicgSEQUVLdz2wBk_Cls3Cv6t7SgpUfyThYqBtZVMLXSA2ks0yhx88A2U3AXk1VpWEEsUq6tHo0xikfW3VCyKm5ID94BSMJP4"}/>
          </button>
        </div>
      </header>

      {/* Sidebar Navigation (Desktop) - Same as Dashboard */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant/30 z-40 overflow-y-auto">
        <div className="flex items-center gap-sm h-16 px-gutter mt-2">
          <span className="material-symbols-outlined text-stitch-primary font-headline-md text-[24px]" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
          <span className="font-headline-md text-[24px] font-bold text-stitch-primary">Sparkfolio</span>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-sm">
          <Link to="/" className="flex items-center gap-md px-4 py-3 rounded-lg text-on-surface-variant font-label-md text-[14px] hover:bg-surface-variant hover:text-stitch-primary transition-colors">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
            Home
          </Link>
          <Link to="/dashboard" className="flex items-center gap-md px-4 py-3 rounded-lg text-on-surface-variant font-label-md text-[14px] hover:bg-surface-variant hover:text-stitch-primary transition-colors">
            <span className="material-symbols-outlined">description</span>
            Drafts
          </Link>
          <Link to="/templates" className="flex items-center gap-md px-4 py-3 rounded-lg bg-primary-container text-on-primary-container font-label-md text-[14px] transition-colors">
            <span className="material-symbols-outlined">auto_awesome_mosaic</span>
            Templates
          </Link>
        </nav>
        <div className="p-4 mt-auto border-t border-outline-variant/30">
          <a className="flex items-center gap-md px-4 py-3 rounded-lg text-on-surface-variant font-label-md text-[14px] hover:bg-surface-variant hover:text-stitch-primary transition-colors" href="#">
            <span className="material-symbols-outlined">person</span>
            Profile
          </a>
          <div className="mt-4 flex items-center gap-3 px-4">
            <button className="w-10 h-10 rounded-full bg-surface-container overflow-hidden focus:outline-none focus:ring-2 focus:ring-stitch-primary flex-shrink-0">
              <img alt="User profile photo" className="w-full h-full object-cover" src={user?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAdpNE5-WKm5MFn2b-yk7gA_p_Kn0HAZVhocCeU2LroTUEh6spLnuqz718WVyECY57YXlU_ZIFCUP0yGIJO_9U68aiTdsfRod1cixn6cKWCHGCU1TBw7YOsxAxmvaQRU7bQawiaphVcD7NXJGkEw4T17S5ZE5dsiLGnhuWWHpHu7DRWKB488oEZxy_BNFlnaOEAOYVeWHiKKyPLGYaj65KODG0706Jkyi97-2XpynlrGdiFF6kaYbQH"}/>
            </button>
            <div className="flex flex-col">
              <span className="font-label-md text-[14px] text-on-surface">{user?.fullName || 'User'}</span>
              <span className="font-label-sm text-[12px] text-on-surface-variant">{user?.primaryEmailAddress?.emailAddress || 'Pro Plan'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full md:pl-64 pt-16 md:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto px-gutter md:px-lg py-lg md:py-xl flex flex-col gap-xl">
          
          <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
            <div>
              <h1 className="font-headline-xl text-[48px] text-on-background mb-xs font-extrabold leading-tight tracking-tight">Template Gallery</h1>
              <p className="font-body-lg text-[18px] text-on-surface-variant">Start your next document with a beautiful foundation.</p>
            </div>
          </section>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
            <div className="flex p-1 bg-surface-container-low rounded-lg w-full sm:w-auto overflow-x-auto custom-scrollbar">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)} 
                  className={`flex-none px-4 py-2 rounded-md font-label-md text-[14px] transition-all ${activeCategory === cat ? 'bg-surface shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="relative w-full sm:w-64 flex-shrink-0">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface-container-low border-0 rounded-lg pl-10 pr-4 py-2 font-body-sm text-[14px] text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-stitch-primary focus:outline-none transition-all placeholder:text-outline shadow-none h-10" 
                placeholder="Search templates..." 
                type="text"
              />
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
            {filteredTemplates.map(template => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={template.id} 
                className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden hover:shadow-[0px_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden bg-surface-container border-b border-outline-variant/30">
                  <img src={template.image} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                     <Link to="/dashboard" className="px-6 py-2 bg-stitch-primary text-white font-label-md rounded-full shadow-lg hover:bg-stitch-primary/90 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300">
                        Use Template
                     </Link>
                  </div>
                  <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded-md">
                     <span className="text-[10px] font-bold text-stitch-primary uppercase tracking-wider">{template.category}</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-2">{template.name}</h3>
                  <p className="font-body-sm text-on-surface-variant text-sm flex-1">{template.description}</p>
                </div>
              </motion.div>
            ))}
            
            {filteredTemplates.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">search_off</span>
                <h3 className="font-headline-md text-on-surface mb-2">No templates found</h3>
                <p className="font-body-sm text-on-surface-variant">Try adjusting your search or category filters.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
