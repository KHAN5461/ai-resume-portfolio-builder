import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/auth';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from './../service/GlobalApi';
import { getAllPortfolioTemplates } from '@/portfolio/templates/registry';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, Search, X, Sparkles, ArrowUpRight, ShieldCheck, FileText, Globe, FolderGit2, Code } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const RESUME_TEMPLATES = [
  { 
    id: 'classic', 
    name: 'Classic Executive', 
    category: 'Professional', 
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&q=80', 
    description: 'A timeless layout with a strong focus on experience hierarchy and bullet impact.',
    atsScore: '99%',
    highlight: 'Recruiter Favorite',
    defaultColor: '#1e293b'
  },
  { 
    id: 'modern', 
    name: 'Modern Neo-Studio', 
    category: 'Creative', 
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80', 
    description: 'Engineered for high-growth tech & product leaders with vibrant typography accents.',
    atsScore: '96%',
    highlight: 'Tech & Product',
    defaultColor: '#7c3aed'
  },
  { 
    id: 'minimal', 
    name: 'Minimal Clean', 
    category: 'Professional', 
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=500&q=80', 
    description: 'Clean geometry and intentional whitespace. Optimally parsed by enterprise ATS systems.',
    atsScore: '100%',
    highlight: 'ATS Certified',
    defaultColor: '#2563eb'
  },
  { 
    id: 'minimal-image', 
    name: 'Visual Creative Pro', 
    category: 'Creative', 
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&q=80', 
    description: 'Showcase design portfolio links, avatars, and visual branding with elegance.',
    atsScore: '94%',
    highlight: 'Visual Designers',
    defaultColor: '#059669'
  },
  { 
    id: 'magazine', 
    name: 'Editorial Spotlight', 
    category: 'Creative', 
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&q=80', 
    description: 'Magazine-grade headline balance, asymmetric layout, and bold section pacing.',
    atsScore: '95%',
    highlight: 'Executive Branding',
    defaultColor: '#e11d48'
  },
];

const PORTFOLIO_IMAGE_MAP = {
  bento: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  modern: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
  minimalist: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80',
  creative: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&q=80',
  magazine: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&q=80',
  'developer-terminal': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80'
};

const RESUME_CATEGORIES = ['All', 'Professional', 'Creative'];

export default function TemplateGallery() {
  const { user } = useUser();
  const navigation = useNavigate();
  const [docType, setDocType] = useState('portfolios'); // 'resumes' | 'portfolios'
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [openDialog, setOpenDialog] = useState(false);
  const [documentTitle, setDocumentTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const portfolioTemplates = getAllPortfolioTemplates();

  const onCreate = async () => {
    if (!documentTitle.trim()) return;
    setLoading(true);
    const uuid = uuidv4();
    
    if (docType === 'portfolios') {
      const data = {
        data: {
          title: documentTitle,
          portfolioId: uuid,
          documentId: uuid,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userName: user?.fullName,
          siteConfig: {
            themePreset: selectedTemplate?.id || 'bento',
            themeMode: selectedTemplate?.id === 'developer-terminal' ? 'dark' : 'light'
          }
        }
      };

      try {
        const resp = await GlobalApi.CreateNewPortfolio(data);
        setLoading(false);
        const newId = resp.data?.data?.documentId || resp.data?.data?.portfolioId || uuid;
        navigation('/dashboard/portfolio/' + newId + '/edit');
      } catch (e) {
        console.error('Failed to create portfolio:', e);
        setLoading(false);
      }
      return;
    }

    // Resume Creation
    let themeColor = selectedTemplate?.defaultColor || '#7c3aed';
    let themeTemplate = 'Classic';

    if (selectedTemplate?.id === 'classic') themeTemplate = 'Classic';
    else if (selectedTemplate?.id === 'modern') themeTemplate = 'Modern';
    else if (selectedTemplate?.id === 'minimal') themeTemplate = 'Minimal';
    else if (selectedTemplate?.id === 'minimal-image') themeTemplate = 'MinimalImage';
    else if (selectedTemplate?.id === 'magazine') themeTemplate = 'Modern';

    const data = {
      data: {
        title: documentTitle,
        resumeId: uuid,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
        themeColor: themeColor,
        themeTemplate: themeTemplate
      }
    };

    GlobalApi.CreateNewResume(data).then(resp => {
      if (resp) {
        setLoading(false);
        navigation('/dashboard/resume/' + (resp.data?.data?.documentId || uuid) + "/edit");
      }
    }).catch(() => {
      setLoading(false);
    });
  };

  const handleUseTemplate = (template) => {
    setSelectedTemplate(template);
    setDocumentTitle(docType === 'portfolios' ? `My ${template.name} Portfolio` : `My ${template.name}`);
    setOpenDialog(true);
  };

  const currentList = docType === 'portfolios' ? portfolioTemplates : RESUME_TEMPLATES;

  const filteredTemplates = currentList.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = docType === 'portfolios'
    ? ['All', ...Array.from(new Set(portfolioTemplates.map(t => t.category).filter(Boolean)))]
    : RESUME_CATEGORIES;

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
      {/* Top Studio Header */}
      <header className="sticky top-0 z-40 w-full h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/dashboard" 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400 block -mb-0.5">AI Studio</span>
              <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100">Template Gallery</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/dashboard"
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>My Documents</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* Document Type Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              onClick={() => { setDocType('portfolios'); setActiveCategory('All'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                docType === 'portfolios'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Portfolio Templates ({portfolioTemplates.length})</span>
            </button>
            <button
              onClick={() => { setDocType('resumes'); setActiveCategory('All'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                docType === 'resumes'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resume Layouts ({RESUME_TEMPLATES.length})</span>
            </button>
          </div>

          {/* Custom Template Folder Indicator */}
          {docType === 'portfolios' && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg">
              <FolderGit2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Upload folder active at <code className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">src/portfolio/templates/custom/</code>
              </span>
            </div>
          )}
        </div>

        {/* Hero Section */}
        <section className="relative mb-8">
          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{docType === 'portfolios' ? 'Production Web Layouts & Custom Uploads' : 'ATS-Optimized Industry Standards'}</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {docType === 'portfolios' 
                ? 'Select or upload a responsive portfolio design.'
                : 'Select an elite resume layout engineered to pass recruiters.'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {docType === 'portfolios'
                ? 'Featuring modular Bento layouts, modern tech themes, and auto-registered custom React templates dropped into your custom folder.'
                : 'Every template is algorithmically styled for modern Applicant Tracking Systems (ATS) with standard section hierarchy and high parsing fidelity.'}
            </p>
          </div>
        </section>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8">
          {/* Category Pills */}
          <div className="flex p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)} 
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-semibold text-xs whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-9 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs" 
              placeholder="Search by keyword, design, or role..." 
              type="text"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => {
            const previewImage = template.image || PORTFOLIO_IMAGE_MAP[template.id] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80';
            return (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                key={template.id} 
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Template Preview Image Zone */}
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800/60">
                  <img 
                    src={previewImage} 
                    alt={template.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                  />
                  
                  {/* Dark Hover Overlay with Action Button */}
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <button 
                      onClick={() => handleUseTemplate(template)} 
                      className="px-5 py-2.5 bg-white text-slate-900 text-xs font-bold rounded-full shadow-xl hover:bg-slate-100 transition-colors transform translate-y-2 group-hover:translate-y-0 duration-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Use This Template</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Left Tag: ATS score or Custom badge */}
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-slate-200/80 dark:border-slate-700/80 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                    {template.isCustom ? (
                      <>
                        <Code className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">CUSTOM TEMPLATE</span>
                      </>
                    ) : docType === 'resumes' ? (
                      <>
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100">{template.atsScore} ATS</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3 h-3 text-indigo-500" />
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100">RESPONSIVE</span>
                      </>
                    )}
                  </div>

                  {/* Highlight Badge */}
                  {template.badge && (
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-slate-200/80 dark:border-slate-700/80 px-2.5 py-1 rounded-full shadow-xs">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{template.badge}</span>
                    </div>
                  )}
                </div>

                {/* Card Meta Content */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                      {template.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      {template.category}
                    </span>
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Choose</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </main>

      {/* Creation Modal */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              {docType === 'portfolios' ? 'Create New Web Portfolio' : 'Create New ATS Resume'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Selected layout: <strong className="text-indigo-600 dark:text-indigo-400">{selectedTemplate?.name}</strong>. Give your new document a title to get started.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Document Title
              </label>
              <Input
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder={docType === 'portfolios' ? "e.g. Senior Software Architect Portfolio" : "e.g. Lead Product Designer Resume"}
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-xs"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onCreate();
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenDialog(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!documentTitle.trim() || loading}
              onClick={onCreate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Launch Editor</span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
