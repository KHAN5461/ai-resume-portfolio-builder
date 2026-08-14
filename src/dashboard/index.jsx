import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import { useUser } from '../auth.jsx'
import GlobalApi from './../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';
import AddPortfolio from './components/AddPortfolio';
import MagicImportModal from './components/MagicImportModal';
import { WelcomeModal } from './components/WelcomeModal';
import { Loader2, Plus, LayoutGrid, FileText, ChevronDown, Check, MoreVertical, Trash, Share, Copy, Edit2, Download, Search, Filter, RefreshCcw, LayoutTemplate, Briefcase, Sparkles, Folder, FolderPlus, FolderOpen, Bell, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input"
import { Grid, List as ListIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

function Dashboard() {
  const {user}=useUser();
  const [resumeList,setResumeList]=useState([]);
  const [portfolioList, setPortfolioList] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All' | 'Resumes' | 'Portfolios'
  const [selectedFolder, setSelectedFolder] = useState('All Drafts');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated'); // 'updated' | 'alphabetical'
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(true);

  const folders = [
    { id: 'all', name: 'All Drafts', count: resumeList.length },
    { id: '1', name: 'Tech Roles', count: 2 },
    { id: '2', name: 'Design Roles', count: 1 },
    { id: '3', name: 'Archived', count: 0 },
  ];

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
        <div className="p-4 mt-auto border-t border-outline-variant/30">
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
          <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
            <div>
              <h1 className="font-headline-xl text-[48px] text-on-background mb-xs font-extrabold leading-tight tracking-tight">Welcome back, {user?.firstName || 'Creator'}!</h1>
              <p className="font-body-lg text-[18px] text-on-surface-variant">Ready to showcase your next big idea?</p>
            </div>
            
            <AddResume renderTrigger={(onClick) => (
              <button onClick={onClick} className="hidden md:flex items-center justify-center gap-sm bg-stitch-primary text-on-primary px-6 py-3 rounded-full font-label-md text-[14px] hover:-translate-y-0.5 hover:shadow-[0px_8px_16px_rgba(0,0,0,0.08)] transition-all duration-200 active:scale-95 min-h-[48px]">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>add</span>
                Create New Resume
              </button>
            )} />
          </section>

          {/* Quick Actions (Bento Grid Style) */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <AddResume renderTrigger={(onClick) => (
              <button onClick={onClick} className="group relative overflow-hidden rounded-xl bg-surface/80 backdrop-blur-sm border border-outline-variant/30 p-6 flex flex-col justify-between items-start h-48 hover:-translate-y-1 hover:shadow-lg hover:border-primary-container transition-all duration-300 text-left w-full">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-stitch-primary/10 rounded-full group-hover:scale-[1.7] transition-transform duration-700 ease-in-out"></div>
                <div className="w-12 h-12 rounded-lg bg-primary-container/20 text-stitch-primary flex items-center justify-center mb-4 relative z-10 group-hover:bg-stitch-primary group-hover:text-on-primary transition-colors duration-300 shadow-sm group-hover:shadow-md">
                  <span className="material-symbols-outlined group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
                </div>
                <div className="relative z-10">
                  <h3 className="font-headline-md text-[24px] font-bold text-on-surface mb-1 group-hover:text-stitch-primary transition-colors">New Resume</h3>
                  <p className="font-body-sm text-[14px] text-on-surface-variant">Start from a professional template</p>
                </div>
              </button>
            )} />

            <AddPortfolio renderTrigger={(onClick) => (
              <button onClick={onClick} className="group relative overflow-hidden rounded-xl bg-surface/80 backdrop-blur-sm border border-outline-variant/30 p-6 flex flex-col justify-between items-start h-48 hover:-translate-y-1 hover:shadow-lg hover:border-secondary-container transition-all duration-300 text-left w-full">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-stitch-secondary/10 rounded-full group-hover:scale-[1.7] transition-transform duration-700 ease-in-out"></div>
                <div className="w-12 h-12 rounded-lg bg-secondary-container/20 text-stitch-secondary flex items-center justify-center mb-4 relative z-10 group-hover:bg-stitch-secondary group-hover:text-on-secondary-fixed transition-colors duration-300 shadow-sm group-hover:shadow-md">
                  <span className="material-symbols-outlined group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" style={{fontVariationSettings: "'FILL' 1"}}>view_cozy</span>
                </div>
                <div className="relative z-10">
                  <h3 className="font-headline-md text-[24px] font-bold text-on-surface mb-1 group-hover:text-stitch-secondary transition-colors">New Portfolio</h3>
                  <p className="font-body-sm text-[14px] text-on-surface-variant">Build a stunning showcase</p>
                </div>
              </button>
            )} />

            <MagicImportModal renderTrigger={(onClick) => (
              <button onClick={onClick} className="group relative overflow-hidden rounded-xl bg-surface/80 backdrop-blur-sm border border-outline-variant/30 p-6 flex flex-col justify-between items-start h-48 hover:-translate-y-1 hover:shadow-lg hover:border-stitch-primary transition-all duration-300 text-left w-full">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-stitch-primary/10 rounded-full group-hover:scale-[1.7] transition-transform duration-700 ease-in-out"></div>
                <div className="w-12 h-12 rounded-lg bg-stitch-primary/10 text-stitch-primary flex items-center justify-center mb-4 relative z-10 group-hover:bg-stitch-primary group-hover:text-on-primary transition-colors duration-300 shadow-sm group-hover:shadow-md">
                  <span className="material-symbols-outlined group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" style={{fontVariationSettings: "'FILL' 1"}}>auto_fix_high</span>
                </div>
                <div className="relative z-10">
                  <h3 className="font-headline-md text-[24px] font-bold text-on-surface mb-1 group-hover:text-stitch-primary transition-colors">Magic Import</h3>
                  <p className="font-body-sm text-[14px] text-on-surface-variant">Import from PDF or LinkedIn</p>
                </div>
              </button>
            )} />
          </section>

          {/* Document Grid Section with Folders */}
          <section className="flex gap-8 w-full mt-8 border-t border-outline-variant/30 pt-8">
            {/* Folders Sidebar */}
            <div className="w-64 flex-shrink-0 flex flex-col gap-6">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-headline-sm font-bold text-on-surface">Folders</h2>
                        <button className="text-on-surface-variant hover:text-stitch-primary hover:bg-stitch-primary/10 p-1.5 rounded-full transition-colors">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex flex-col gap-1">
                        {folders.map(folder => (
                            <button 
                                key={folder.id}
                                onClick={() => setSelectedFolder(folder.name)}
                                className={`flex items-center justify-between p-3 rounded-xl text-left transition-colors ${selectedFolder === folder.name ? 'bg-stitch-primary/10 text-stitch-primary font-bold' : 'text-on-surface-variant hover:bg-surface-variant'}`}
                            >
                                <div className="flex items-center gap-3">
                                    {selectedFolder === folder.name ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                                    <span className="font-label-md">{folder.name}</span>
                                </div>
                                <span className={`text-xs ${selectedFolder === folder.name ? 'text-stitch-primary' : 'text-outline-variant'} font-medium px-2 py-0.5 rounded-full bg-surface-container-highest`}>
                                    {folder.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Documents Area */}
            <div className="flex-1 w-full flex flex-col gap-lg">

              {/* Dashboard Hero / Analytics Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-2">
                <div className="lg:col-span-2">
                    <AnalyticsDashboard totalViews={totalViews} />
                </div>
                <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 flex flex-col shadow-sm h-[250px] overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-headline-sm text-[16px] font-bold text-on-surface flex items-center gap-2">
                            <Activity className="w-4 h-4 text-stitch-primary" /> Activity Feed
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-2">
                        <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[16px] text-blue-600">visibility</span>
                            </div>
                            <div>
                                <p className="font-body-sm text-[13px] text-on-surface"><span className="font-bold">Portfolio</span> was viewed</p>
                                <p className="font-label-sm text-[11px] text-on-surface-variant">2 mins ago • San Francisco</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full bg-stitch-primary/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[16px] text-stitch-primary">edit</span>
                            </div>
                            <div>
                                <p className="font-body-sm text-[13px] text-on-surface">Updated <span className="font-bold">Tech Professional</span></p>
                                <p className="font-label-sm text-[11px] text-on-surface-variant">1 hour ago</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[16px] text-green-600">publish</span>
                            </div>
                            <div>
                                <p className="font-body-sm text-[13px] text-on-surface">Published <span className="font-bold">Resume v2</span></p>
                                <p className="font-label-sm text-[11px] text-on-surface-variant">3 hours ago</p>
                            </div>
                        </div>
                    </div>
                </div>
              </div>

              {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md mt-4">
              <h2 className="font-headline-md text-[24px] font-bold text-on-surface">{selectedFolder}</h2>
              <div className="flex p-1 bg-surface-container-low rounded-lg w-full sm:w-auto">
                <button onClick={() => setFilter('All')} className={`flex-1 sm:flex-none px-4 py-2 rounded-md font-label-md text-[14px] transition-all ${filter === 'All' ? 'bg-surface shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>All</button>
                <button onClick={() => setFilter('Resumes')} className={`flex-1 sm:flex-none px-4 py-2 rounded-md font-label-md text-[14px] transition-all ${filter === 'Resumes' ? 'bg-surface shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>Resumes</button>
                <button onClick={() => setFilter('Portfolios')} className={`flex-1 sm:flex-none px-4 py-2 rounded-md font-label-md text-[14px] transition-all ${filter === 'Portfolios' ? 'bg-surface shadow-sm text-stitch-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>Portfolios</button>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64 flex-shrink-0">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                  <input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface-container-low border-0 rounded-lg pl-10 pr-4 py-2 font-body-sm text-[14px] text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-stitch-primary focus:outline-none transition-all placeholder:text-outline shadow-none h-10" 
                    placeholder="Search documents..." 
                    type="text"
                  />
                </div>
                
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-surface-container-low border-0 rounded-lg px-4 py-2 font-label-md text-[14px] text-on-surface-variant focus:bg-surface-container-lowest focus:ring-2 focus:ring-stitch-primary focus:outline-none h-10 cursor-pointer"
                >
                  <option value="updated">Recently Updated</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
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
                <motion.div variants={itemVariants} key={`port-skel-${index}`} className="h-[280px] rounded-xl border border-outline-variant/20 p-4 flex flex-col justify-between">
                  <div>
                    <Skeleton className="h-40 w-full mb-4 rounded-lg bg-surface-variant/30" />
                    <Skeleton className="h-6 w-3/4 mb-2 bg-surface-variant/30" />
                    <Skeleton className="h-4 w-1/2 bg-surface-variant/30" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-full mt-4 bg-surface-variant/30" />
                </motion.div>
              ))}
              {!isLoadingPortfolios && showPortfolios && processedPortfolios.map((portfolio) => (
                <motion.div variants={itemVariants} key={portfolio.documentId} onClick={() => navigate(`/dashboard/portfolio/${portfolio.documentId}/edit`)} className="group flex flex-col bg-surface-container-lowest/80 backdrop-blur-sm rounded-xl border border-outline-variant/40 overflow-hidden hover:shadow-[0px_12px_24px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 cursor-pointer h-[280px]">
                  <div className="relative h-40 bg-surface-container overflow-hidden flex items-center justify-center bg-secondary-container/20">
                    <span className="material-symbols-outlined text-stitch-secondary text-4xl group-hover:scale-110 transition-transform">view_cozy</span>
                    <div className="absolute top-2 right-2 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#FBBC04]"></span>
                      <span className="font-label-sm text-[12px] text-on-surface">Draft</span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-headline-md text-[18px] font-bold text-on-surface mb-1 truncate group-hover:text-stitch-secondary transition-colors">{portfolio.title}</h4>
                    <p className="font-body-sm text-[14px] text-on-surface-variant mb-4">Updated recently</p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="inline-flex items-center rounded-full bg-stitch-secondary/10 px-2.5 py-0.5 font-label-sm text-[12px] text-stitch-secondary">Portfolio</span>
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

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-2 px-4 md:hidden bg-surface shadow-[0px_-2px_10px_rgba(0,0,0,0.05)] rounded-t-xl z-50">
        <Link to="/" className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 rounded-full px-4 py-1 active:scale-90 transition-transform duration-150">
          <span className="material-symbols-outlined font-label-sm text-[14px]">home</span>
          <span className="font-label-sm text-[12px] mt-1">Home</span>
        </Link>
        <Link to="/dashboard" className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active:scale-90 transition-transform duration-150">
          <span className="material-symbols-outlined font-label-sm text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
          <span className="font-label-sm text-[12px] mt-1">Drafts</span>
        </Link>
        <MagicImportModal renderTrigger={(onClick) => (
          <button onClick={onClick} className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 rounded-full px-4 py-1 active:scale-90 transition-transform duration-150">
            <span className="material-symbols-outlined font-label-sm text-[14px]">auto_fix_high</span>
            <span className="font-label-sm text-[12px] mt-1">AI Import</span>
          </button>
        )} />
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 rounded-full px-4 py-1 active:scale-90 transition-transform duration-150" to="/profile">
          <span className="material-symbols-outlined font-label-sm text-[14px]">person</span>
          <span className="font-label-sm text-[12px] mt-1">Profile</span>
        </Link>
      </nav>

      {/* FAB (Mobile Only) */}
      <AddResume renderTrigger={(onClick) => (
        <button onClick={onClick} className="md:hidden fixed right-4 bottom-20 z-50 w-14 h-14 bg-stitch-primary text-on-primary rounded-full shadow-[0px_12px_32px_rgba(0,0,0,0.12)] flex items-center justify-center active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings: "'FILL' 1"}}>add</span>
        </button>
      )} />
    </motion.div>
  )
}

export default Dashboard