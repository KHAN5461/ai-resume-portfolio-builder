import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import { useUser } from '../auth.jsx'
import GlobalApi from './../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';
import AddPortfolio from './components/AddPortfolio';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

function Dashboard() {
  const {user}=useUser();
  const [resumeList,setResumeList]=useState([]);
  const [portfolioList, setPortfolioList] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All' | 'Resumes' | 'Portfolios'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated'); // 'updated' | 'alphabetical'
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(true);

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

      {/* Sidebar Navigation (Desktop) */}
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
          <Link to="/dashboard" className="flex items-center gap-md px-4 py-3 rounded-lg bg-primary-container text-on-primary-container font-label-md text-[14px] transition-colors">
            <span className="material-symbols-outlined">description</span>
            Drafts
          </Link>
          <Link to="/templates" className="flex items-center gap-md px-4 py-3 rounded-lg text-on-surface-variant font-label-md text-[14px] hover:bg-surface-variant hover:text-stitch-primary transition-colors">
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
          <section className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {/* Action Card 1 */}
            <AddResume renderTrigger={(onClick) => (
              <button onClick={onClick} className="group relative overflow-hidden rounded-xl bg-surface-container-lowest border border-outline-variant/50 p-6 flex flex-col justify-between items-start h-48 hover:shadow-[0px_8px_16px_rgba(0,0,0,0.08)] hover:border-primary-container transition-all duration-300 text-left w-full">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-stitch-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                <div className="w-12 h-12 rounded-lg bg-primary-container/20 text-stitch-primary flex items-center justify-center mb-4 relative z-10 group-hover:bg-stitch-primary group-hover:text-on-primary transition-colors duration-300">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
                </div>
                <div className="relative z-10">
                  <h3 className="font-headline-md text-[24px] font-bold text-on-surface mb-1 group-hover:text-stitch-primary transition-colors">New Resume</h3>
                  <p className="font-body-sm text-[14px] text-on-surface-variant">Start from a professional template</p>
                </div>
              </button>
            )} />

            {/* Action Card 2 */}
            <AddPortfolio renderTrigger={(onClick) => (
              <button onClick={onClick} className="group relative overflow-hidden rounded-xl bg-surface-container-lowest border border-outline-variant/50 p-6 flex flex-col justify-between items-start h-48 hover:shadow-[0px_8px_16px_rgba(0,0,0,0.08)] hover:border-secondary-container transition-all duration-300 text-left w-full">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-stitch-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                <div className="w-12 h-12 rounded-lg bg-secondary-container/20 text-stitch-secondary flex items-center justify-center mb-4 relative z-10 group-hover:bg-stitch-secondary group-hover:text-on-secondary-fixed transition-colors duration-300">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>view_cozy</span>
                </div>
                <div className="relative z-10">
                  <h3 className="font-headline-md text-[24px] font-bold text-on-surface mb-1 group-hover:text-stitch-secondary transition-colors">New Portfolio</h3>
                  <p className="font-body-sm text-[14px] text-on-surface-variant">Build a stunning showcase</p>
                </div>
              </button>
            )} />
          </section>

          {/* Document Grid Section */}
          <section className="flex flex-col gap-lg">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
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

            {/* Cards Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md"
            >
              {isLoadingResumes && showResumes && [1, 2, 3, 4].map((item, index) => (
                <motion.div variants={itemVariants} key={`res-skel-${index}`} className="h-[280px] rounded-xl bg-surface-variant/30 animate-pulse border border-outline-variant/20"></motion.div>
              ))}
              {!isLoadingResumes && showResumes && processedResumes.map((resume, index) => (
                <motion.div variants={itemVariants} key={resume.documentId || index} layout>
                  <ResumeCardItem 
                    resume={resume} 
                    refreshData={GetResumesList} 
                    optimisticDelete={handleOptimisticDeleteResume}
                  />
                </motion.div>
              ))}
              
              {isLoadingPortfolios && showPortfolios && [1, 2, 3].map((item, index) => (
                <motion.div variants={itemVariants} key={`port-skel-${index}`} className="h-[280px] rounded-xl bg-surface-variant/30 animate-pulse border border-outline-variant/20"></motion.div>
              ))}
              {!isLoadingPortfolios && showPortfolios && processedPortfolios.map((portfolio) => (
                <motion.div variants={itemVariants} key={portfolio.documentId} onClick={() => navigate(`/dashboard/portfolio/${portfolio.documentId}/edit`)} className="group flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden hover:shadow-[0px_8px_16px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer h-[280px]">
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

              {/* If no documents found based on filter */}
              {(!isLoadingResumes && !isLoadingPortfolios) && ((showResumes && resumeList.length === 0) && (showPortfolios && portfolioList.length === 0)) && (
                <motion.div variants={itemVariants} className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm mt-4">
                  <div className="w-24 h-24 mb-6 rounded-full bg-primary-container/30 flex items-center justify-center text-stitch-primary">
                    <span className="material-symbols-outlined text-[48px]" style={{fontVariationSettings: "'FILL' 1"}}>note_add</span>
                  </div>
                  <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-2">Nothing here yet</h3>
                  <p className="font-body-md text-on-surface-variant max-w-md mb-8">
                    Start building your professional brand today. Create a stunning resume or a beautiful portfolio in minutes.
                  </p>
                  <div className="flex gap-4">
                    <AddResume renderTrigger={(onClick) => (
                      <button onClick={onClick} className="bg-stitch-primary text-on-primary px-6 py-3 rounded-full font-label-md text-[14px] hover:-translate-y-0.5 hover:shadow-[0px_8px_16px_rgba(0,0,0,0.08)] transition-all duration-200 active:scale-95 flex items-center gap-2">
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
                        New Resume
                      </button>
                    )} />
                    <AddPortfolio renderTrigger={(onClick) => (
                      <button onClick={onClick} className="bg-surface text-stitch-secondary border border-stitch-secondary/30 px-6 py-3 rounded-full font-label-md text-[14px] hover:bg-stitch-secondary/5 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center gap-2">
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>view_cozy</span>
                        New Portfolio
                      </button>
                    )} />
                  </div>
                </motion.div>
              )}
            </motion.div>
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
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 rounded-full px-4 py-1 active:scale-90 transition-transform duration-150" href="#">
          <span className="material-symbols-outlined font-label-sm text-[14px]">auto_fix_high</span>
          <span className="font-label-sm text-[12px] mt-1">AI Import</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 rounded-full px-4 py-1 active:scale-90 transition-transform duration-150" href="#">
          <span className="material-symbols-outlined font-label-sm text-[14px]">person</span>
          <span className="font-label-sm text-[12px] mt-1">Profile</span>
        </a>
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