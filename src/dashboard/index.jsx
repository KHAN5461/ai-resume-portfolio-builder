import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import { useUser } from '../auth.jsx'
import GlobalApi from './../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';
import AddPortfolio from './components/AddPortfolio';
import MagicImportModal from './components/MagicImportModal';
import { WelcomeModal } from './components/WelcomeModal';
import GitHubSyncModal from '@/components/custom/GitHubSyncModal';
import { Github, Loader2, Plus, LayoutGrid, FileText, ChevronDown, Check, MoreVertical, Trash, Share, Copy, Edit2, Download, Search, Filter, RefreshCcw, LayoutTemplate, Briefcase, Sparkles, Folder, FolderPlus, FolderOpen, Bell, Activity, Paperclip, Globe, Settings, Mic } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AIChatSession } from '../service/AIModal';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input"
import { Grid, List as ListIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import MobileBottomNav from '../components/custom/MobileBottomNav';
function Dashboard() {
  const {user}=useUser();
  const [resumeList,setResumeList]=useState([]);
  const [portfolioList, setPortfolioList] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All' | 'Resumes' | 'Portfolios'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated'); // 'updated' | 'alphabetical'
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);

  useEffect(()=>{
    if(user) {
      GetResumesList();
      GetPortfoliosList();
    }
  },[user])

  const GetResumesList=()=>{
    setIsLoadingResumes(true);
    GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress)
    .then(resp=>{
      setResumeList(resp.data?.data || []);
    })
    .catch(error => {
      console.error("Failed to fetch resumes", error);
      toast.error("Failed to load resumes");
      setResumeList([]);
    })
    .finally(() => {
      setIsLoadingResumes(false);
    });
  }

  const GetPortfoliosList=()=>{
    setIsLoadingPortfolios(true);
    GlobalApi.GetUserPortfolios(user?.primaryEmailAddress?.emailAddress)
    .then(resp=>{
      setPortfolioList(resp.data?.data || []);
    })
    .catch(error => {
      console.error("Failed to fetch portfolios", error);
      toast.error("Failed to load portfolios");
      setPortfolioList([]);
    })
    .finally(() => {
      setIsLoadingPortfolios(false);
    });
  }
  const handleOptimisticDeleteResume = (documentId) => {
    setResumeList(prev => prev.filter(r => r.documentId !== documentId));
  }

  const navigate = useNavigate();

  const getFilteredAndSorted = (list) => {
    let result = [...list];
    
    // Filter by search
    if (searchTerm) {
      result = result.filter(item => 
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) // Fallback if name is used
      );
    }
    
    // Sort
    if (sortBy === 'alphabetical') {
      result.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
    } else if (sortBy === 'updated') {
      // Assuming documentId can serve as a proxy for recency or just reverse order
      result.reverse(); 
    }
    
    return result;
  }

  const processedResumes = getFilteredAndSorted(resumeList);
  const processedPortfolios = getFilteredAndSorted(portfolioList);

  const showResumes = filter === 'All' || filter === 'Resumes';
  const showPortfolios = filter === 'All' || filter === 'Portfolios';

  const handleAIPromptSubmit = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsProcessingPrompt(true);
    try {
      const SYSTEM_PROMPT = `Classify the user's intent into exactly one of three categories: 'RESUME', 'PORTFOLIO', or 'IMPORT'. Return ONLY a JSON object with a single key 'intent' containing the category string. User Prompt: "${aiPrompt}"`;
      const result = await AIChatSession.sendMessage(SYSTEM_PROMPT);
      const responseText = await result.response.text();
      const parsed = JSON.parse(responseText.replace(/```json|```/g, '').trim());
      
      const intent = parsed.intent;
      if (intent === 'RESUME') {
        navigate('/dashboard/resume/new/ai', { state: { prompt: aiPrompt } });
      } else if (intent === 'PORTFOLIO') {
        navigate('/dashboard/portfolio/new/ai', { state: { prompt: aiPrompt } });
      } else if (intent === 'IMPORT') {
        navigate('/dashboard/import', { state: { prompt: aiPrompt } });
      } else {
        toast.error('Could not understand your intent. Please try rephrasing.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to process prompt. Please try again.');
    } finally {
      setIsProcessingPrompt(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const totalPortfolioViews = portfolioList.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalResumeViews = resumeList.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalViews = totalPortfolioViews + totalResumeViews;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col md:flex-row antialiased overflow-x-hidden font-body-md text-body-md bg-background text-on-background"
    >
      {/* Welcome Modal for first time users */}
      <WelcomeModal />
      
      {/* Top Navigation (Mobile Only) */}
      <header className="flex justify-between items-center h-16 px-gutter max-w-7xl mx-auto w-full fixed top-0 z-50 bg-surface/80 backdrop-blur-md shadow-sm md:hidden" role="banner">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-stitch-primary font-headline-md text-[24px]" style={{fontVariationSettings: "'FILL' 1"}} aria-hidden="true">auto_awesome</span>
          <span className="font-headline-md text-[24px] font-bold text-stitch-primary">Sparkfolio</span>
        </div>
        <div className="flex items-center gap-md">
          <Link to="/profile" aria-label="Go to Profile" className="w-8 h-8 rounded-full bg-surface-container overflow-hidden focus:outline-none focus:ring-2 focus:ring-stitch-primary block">
            <img alt={`Profile photo of ${user?.fullName || 'User'}`} className="w-full h-full object-cover" src={user?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAx5bIktZuZF3YmZVL-zf0HlzheENE6MOGaEeQNWUF3By2N0Z9w9GSARNuUBX2g1Wf7-gD5Nj7XVU4CmfGTbAWJhu-tx-hWwwSFUzew4Y8AktbsJP3w4HeK77qit9nhwgOhuZeAltabaJwuk5SS2CFWicgSEQUVLdz2wBk_Cls3Cv6t7SgpUfyThYqBtZVMLXSA2ks0yhx88A2U3AXk1VpWEEsUq6tHo0xikfW3VCyKm5ID94BSMJP4"}/>
          </Link>
        </div>
      </header>

      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant/30 z-40 overflow-y-auto">
        <div className="flex items-center gap-sm h-16 px-gutter mt-2">
          <span className="material-symbols-outlined text-stitch-primary font-headline-md text-[24px]" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
          <span className="font-headline-md text-[24px] font-bold text-stitch-primary">Sparkfolio</span>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-sm" aria-label="Main Navigation">
          <Link to="/" aria-label="Home" className="flex items-center gap-md px-4 py-3 rounded-lg text-on-surface-variant font-label-md text-[14px] hover:bg-surface-variant hover:text-stitch-primary transition-colors focus:ring-2 focus:ring-stitch-primary outline-none">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}} aria-hidden="true">home</span>
            Home
          </Link>
          <Link to="/dashboard" aria-label="Drafts" className="flex items-center gap-md px-4 py-3 rounded-lg bg-primary-container text-on-primary-container font-label-md text-[14px] transition-colors focus:ring-2 focus:ring-stitch-primary outline-none">
            <span className="material-symbols-outlined" aria-hidden="true">description</span>
            Drafts
          </Link>
          <Link to="/templates" aria-label="Templates" className="flex items-center gap-md px-4 py-3 rounded-lg text-on-surface-variant font-label-md text-[14px] hover:bg-surface-variant hover:text-stitch-primary transition-colors focus:ring-2 focus:ring-stitch-primary outline-none">
            <span className="material-symbols-outlined" aria-hidden="true">auto_awesome_mosaic</span>
            Templates
          </Link>
        </nav>
        <div className="p-4 mt-auto border-t border-outline-variant/30 space-y-1">
          <Link to="/settings" aria-label="Settings" className="w-full flex items-center gap-md px-4 py-3 rounded-lg text-on-surface-variant font-label-md text-[14px] hover:bg-surface-variant hover:text-stitch-primary transition-colors focus:ring-2 focus:ring-stitch-primary outline-none">
            <span className="material-symbols-outlined" aria-hidden="true">settings</span>
            Settings
          </Link>
          <Link className="flex items-center gap-md px-4 py-3 rounded-lg text-on-surface-variant font-label-md text-[14px] hover:bg-surface-variant hover:text-stitch-primary transition-colors focus:ring-2 focus:ring-stitch-primary outline-none" to="/profile" aria-label="Profile">
            <span className="material-symbols-outlined" aria-hidden="true">person</span>
            Profile
          </Link>
          <div className="mt-4 flex items-center gap-3 px-4">
            <button aria-label="User account" className="w-10 h-10 rounded-full bg-surface-container overflow-hidden focus:outline-none focus:ring-2 focus:ring-stitch-primary flex-shrink-0">
              <img alt={`Profile photo of ${user?.fullName || 'User'}`} className="w-full h-full object-cover" src={user?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAdpNE5-WKm5MFn2b-yk7gA_p_Kn0HAZVhocCeU2LroTUEh6spLnuqz718WVyECY57YXlU_ZIFCUP0yGIJO_9U68aiTdsfRod1cixn6cKWCHGCU1TBw7YOsxAxmvaQRU7bQawiaphVcD7NXJGkEw4T17S5ZE5dsiLGnhuWWHpHu7DRWKB488oEZxy_BNFlnaOEAOYVeWHiKKyPLGYaj65KODG0706Jkyi97-2XpynlrGdiFF6kaYbQH"}/>
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
          
          {/* Header Section */}
          <section className="flex flex-col items-center justify-center text-center gap-md py-12 md:py-20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-stitch-primary/10 via-stitch-secondary/10 to-primary-container/10 blur-3xl pointer-events-none rounded-full"></div>
            
            <h1 className="font-headline-xl text-[48px] md:text-[64px] text-on-background mb-4 font-extrabold leading-tight tracking-tight relative z-10">
              What will you <span className="bg-clip-text text-transparent bg-gradient-to-r from-stitch-primary to-stitch-secondary">design</span> today?
            </h1>
            <p className="font-body-lg text-[18px] md:text-[22px] text-on-surface-variant max-w-2xl mx-auto mb-10 relative z-10">
              Just describe what you want, and our AI will build the perfect resume or portfolio for you.
            </p>

            <form onSubmit={handleAIPromptSubmit} className="w-full max-w-2xl relative z-10">
              <div className="relative flex items-center w-full shadow-[0_20px_40px_rgba(0,0,0,0.2)] rounded-[32px] bg-[#1c1c1e] border border-white/10 overflow-hidden transition-all duration-300 ring-2 ring-transparent focus-within:ring-white/20">
                
                {/* Left Icons */}
                <div className="flex items-center gap-4 pl-6 pr-4 border-r border-white/10">
                  <button type="button" className="text-gray-400 hover:text-white transition-colors" aria-label="Add attachment">
                     <Paperclip className="w-5 h-5" />
                  </button>
                  <button type="button" className="text-gray-400 hover:text-white transition-colors" aria-label="Web search">
                     <Globe className="w-5 h-5" />
                  </button>
                  <button type="button" className="text-gray-400 hover:text-white transition-colors" aria-label="Settings">
                     <Settings className="w-5 h-5" />
                  </button>
                  <button type="button" className="text-gray-400 hover:text-white transition-colors" aria-label="Folders">
                     <Folder className="w-5 h-5" />
                  </button>
                </div>

                {/* Input */}
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent border-none py-5 px-4 font-body-lg text-[16px] text-white focus:outline-none placeholder:text-gray-500"
                />

                {/* Right Mic/Submit Button */}
                <div className="pr-2 pl-2">
                  <button
                    type="submit"
                    disabled={isProcessingPrompt || !aiPrompt.trim()}
                    className="flex items-center justify-center w-12 h-12 bg-white rounded-full text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {isProcessingPrompt ? <Loader2 className="w-6 h-6 animate-spin" /> : <Mic className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* Document Grid Section */}
          <section className="flex gap-8 w-full mt-4">
            {/* Main Documents Area */}
            <div className="flex-1 w-full flex flex-col gap-lg">

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md mb-2">
              <h2 className="font-headline-md text-[28px] font-bold text-on-surface tracking-tight">Recent Designs</h2>
              <div className="flex p-1.5 bg-surface-container-low rounded-xl w-full sm:w-auto shadow-inner">
                <button onClick={() => setFilter('All')} className={`flex-1 sm:flex-none px-6 py-2 rounded-lg font-label-md text-[14px] transition-all duration-300 ${filter === 'All' ? 'bg-surface shadow text-stitch-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}>All</button>
                <button onClick={() => setFilter('Resumes')} className={`flex-1 sm:flex-none px-6 py-2 rounded-lg font-label-md text-[14px] transition-all duration-300 ${filter === 'Resumes' ? 'bg-surface shadow text-stitch-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}>Resumes</button>
                <button onClick={() => setFilter('Portfolios')} className={`flex-1 sm:flex-none px-6 py-2 rounded-lg font-label-md text-[14px] transition-all duration-300 ${filter === 'Portfolios' ? 'bg-surface shadow text-stitch-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}>Portfolios</button>
              </div>
            </div>

            {/* Documents Grid */}
            <motion.div 
               variants={containerVariants}
               initial="hidden"
               animate="show"
               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
            >
              {isLoadingResumes && showResumes && [1, 2, 3, 4].map((item, index) => (
                <motion.div variants={itemVariants} key={`skel-${index}`} className="h-[280px] rounded-xl border border-outline-variant/20 p-4 flex flex-col justify-between">
                  <div>
                    <Skeleton className="h-40 w-full mb-4 rounded-lg bg-surface-variant/30" />
                    <Skeleton className="h-6 w-3/4 mb-2 bg-surface-variant/30" />
                    <Skeleton className="h-4 w-1/2 bg-surface-variant/30" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-full mt-4 bg-surface-variant/30" />
                </motion.div>
              ))}
              {!isLoadingResumes && showResumes && processedResumes.map((resume) => (
                <motion.div variants={itemVariants} key={resume.documentId} className="w-full h-[280px]">
                  <ResumeCardItem 
                    resume={resume} 
                    refreshData={GetResumesList} 
                    optimisticDelete={handleOptimisticDeleteResume}
                    views={Math.floor(Math.random() * 250) + 10} // Fake views for UI demonstration
                  />
                </motion.div>
              ))}
              
              {isLoadingPortfolios && showPortfolios && [1, 2, 3].map((item, index) => (
                <motion.div variants={itemVariants} key={`port-skel-${index}`} className="h-[320px] rounded-2xl border border-outline-variant/20 p-4 flex flex-col justify-between bg-surface shadow-sm">
                  <Skeleton className="h-48 w-full mb-4 rounded-xl bg-surface-variant/30" />
                  <div className="mt-4">
                    <Skeleton className="h-6 w-3/4 mb-2 bg-surface-variant/30" />
                    <Skeleton className="h-4 w-1/2 bg-surface-variant/30" />
                  </div>
                </motion.div>
              ))}
              {!isLoadingPortfolios && showPortfolios && processedPortfolios.map((portfolio) => (
                <motion.div variants={itemVariants} key={portfolio.documentId} onClick={() => navigate(`/dashboard/portfolio/${portfolio.documentId}/edit`)} className="group flex flex-col bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 cursor-pointer h-[320px]">
                  <div className="relative w-full h-48 bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden flex items-center justify-center border-b border-outline-variant/20">
                    <span className="material-symbols-outlined text-stitch-secondary text-5xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 opacity-80">view_cozy</span>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-outline-variant/10">
                      <span className="w-2 h-2 rounded-full bg-[#FBBC04]"></span>
                      <span className="font-label-sm font-semibold text-on-surface">Draft</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 bg-surface">
                    <h4 className="font-headline-sm text-[20px] font-bold text-on-surface mb-2 truncate group-hover:text-stitch-secondary transition-colors">{portfolio.title || 'Untitled Portfolio'}</h4>
                    <p className="font-body-sm text-[14px] text-on-surface-variant mb-4">Updated recently</p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="inline-flex items-center rounded-lg bg-secondary-container/50 px-3 py-1.5 font-label-sm font-medium text-stitch-secondary">
                        <span className="material-symbols-outlined text-[16px] mr-1.5" style={{fontVariationSettings: "'FILL' 1"}}>web</span>
                        Portfolio
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* High-Converting Empty State */}
              {(!isLoadingResumes && !isLoadingPortfolios) && ((showResumes && resumeList.length === 0) && (showPortfolios && portfolioList.length === 0)) && (
                <motion.div variants={itemVariants} className="col-span-full w-full py-12 px-8 flex flex-col lg:flex-row items-center justify-between gap-12 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm mt-4 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-stitch-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                  
                  <div className="flex-1 max-w-xl relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stitch-primary/10 text-stitch-primary font-label-sm text-[12px] mb-6">
                      <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                      Let's get started
                    </div>
                    <h3 className="font-headline-lg text-4xl font-extrabold text-on-surface mb-4 leading-tight">Your career's next big move starts here.</h3>
                    <p className="font-body-lg text-on-surface-variant mb-8 leading-relaxed">
                      Don't stare at a blank page. Choose one of our expert-crafted templates, or let our AI magically import your LinkedIn profile to build your resume instantly.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <AddResume renderTrigger={(onClick) => (
                        <button onClick={onClick} className="bg-stitch-primary text-white px-6 py-3.5 rounded-xl font-label-md text-[14px] hover:shadow-[0_8px_20px_rgba(var(--stitch-primary),0.25)] hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center gap-2">
                          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
                          Create from Template
                        </button>
                      )} />
                      <GitHubSyncModal renderTrigger={(onClick) => (
                        <button onClick={onClick} className="bg-surface text-on-surface border border-outline-variant/50 px-6 py-3.5 rounded-xl font-label-md text-[14px] hover:bg-surface-variant hover:border-outline-variant transition-all duration-200 active:scale-95 flex items-center gap-2">
                          <Github className="w-5 h-5 text-stitch-primary" />
                          Import from GitHub
                        </button>
                      )} />
                      <MagicImportModal renderTrigger={(onClick) => (
                        <button onClick={onClick} className="bg-surface text-on-surface border border-outline-variant/50 px-6 py-3.5 rounded-xl font-label-md text-[14px] hover:bg-surface-variant hover:border-outline-variant transition-all duration-200 active:scale-95 flex items-center gap-2">
                          <span className="material-symbols-outlined text-stitch-primary" style={{fontVariationSettings: "'FILL' 1"}}>auto_fix_high</span>
                          Magic Import
                        </button>
                      )} />
                    </div>
                  </div>

                  <div className="flex-1 w-full grid grid-cols-2 gap-4 relative z-10">
                     <div className="flex flex-col gap-4 translate-y-8">
                        <div className="bg-surface rounded-2xl p-2 shadow-sm border border-outline-variant/20 hover:-translate-y-1 transition-transform cursor-pointer overflow-hidden">
                           <div className="aspect-[1/1.4] bg-surface-variant/30 rounded-xl mb-3 overflow-hidden relative group">
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                 <span className="bg-white text-black px-4 py-2 rounded-full font-label-md text-sm">Preview</span>
                              </div>
                              <img src="/resume.png" className="w-full h-full object-cover opacity-80" alt="Template Preview" />
                           </div>
                           <h4 className="font-label-md px-2 pb-2">Tech Professional</h4>
                        </div>
                     </div>
                     <div className="flex flex-col gap-4 -translate-y-4">
                        <div className="bg-surface rounded-2xl p-2 shadow-sm border border-outline-variant/20 hover:-translate-y-1 transition-transform cursor-pointer overflow-hidden">
                           <div className="aspect-[1/1.4] bg-surface-variant/30 rounded-xl mb-3 overflow-hidden relative group">
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                 <span className="bg-white text-black px-4 py-2 rounded-full font-label-md text-sm">Preview</span>
                              </div>
                              <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100"></div>
                           </div>
                           <h4 className="font-label-md px-2 pb-2">Creative Portfolio</h4>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}
              </motion.div>
            </div>
          </section>
        </div>
      </main>

      <MobileBottomNav />

      {/* FAB (Mobile Only) */}
      <AddResume renderTrigger={(onClick) => (
        <button aria-label="Create new resume" onClick={onClick} className="md:hidden fixed right-4 bottom-20 z-50 w-14 h-14 bg-stitch-primary text-on-primary rounded-full shadow-[0px_12px_32px_rgba(0,0,0,0.12)] flex items-center justify-center active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings: "'FILL' 1"}}>add</span>
        </button>
      )} />
    </motion.div>
  )
}

export default Dashboard