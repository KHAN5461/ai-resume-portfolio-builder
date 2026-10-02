import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import { useUser } from '../auth.jsx'
import GlobalApi from './../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';
import AddPortfolio from './components/AddPortfolio';
import MagicImportModal from './components/MagicImportModal';
import { WelcomeModal } from './components/WelcomeModal';
import GitHubSyncModal from '@/components/custom/GitHubSyncModal';
import { 
  Github, 
  Loader2, 
  Plus, 
  LayoutGrid, 
  FileText, 
  ChevronDown, 
  Check, 
  MoreVertical, 
  Trash, 
  Share, 
  Copy, 
  Edit2, 
  Download, 
  Search, 
  Filter, 
  RefreshCcw, 
  LayoutTemplate, 
  Briefcase, 
  Sparkles, 
  Folder, 
  FolderPlus, 
  FolderOpen, 
  Bell, 
  Activity, 
  Paperclip, 
  Globe, 
  Settings, 
  Mic, 
  X, 
  ArrowUpRight, 
  Clock, 
  Grid, 
  List as ListIcon, 
  TrendingUp, 
  Zap, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AIChatSession, extractCleanJson } from '../service/AIModal';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input"
import { Skeleton } from '@/components/ui/skeleton'
import ThemeToggle from '@/components/ThemeToggle';
import { v4 as uuidv4 } from 'uuid';

const TEMPLATES = [
  { 
    id: 'classic', 
    name: 'Classic Executive', 
    category: 'Corporate', 
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&q=80', 
    description: 'A timeless layout with a strong focus on experience hierarchy, measurable achievements, and bullet impact.',
    atsScore: '99%',
    highlight: 'Recruiter Favorite',
    defaultColor: '#1e293b'
  },
  { 
    id: 'modern', 
    name: 'Modern Neo-Studio', 
    category: 'Product & Tech', 
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80', 
    description: 'Engineered for high-growth tech & product leaders with modern typography pacing and clean structured sections.',
    atsScore: '96%',
    highlight: 'Tech & Product',
    defaultColor: '#4f46e5'
  },
  { 
    id: 'minimal', 
    name: 'Minimal Clean', 
    category: 'Engineering', 
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=500&q=80', 
    description: 'High-density geometry and intentional whitespace. Optimally parsed by enterprise ATS systems with zero parsing friction.',
    atsScore: '100%',
    highlight: 'ATS Certified',
    defaultColor: '#2563eb'
  },
  { 
    id: 'minimal-image', 
    name: 'Visual Creative Pro', 
    category: 'Creative Design', 
    image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&q=80', 
    description: 'Showcase design portfolio links, avatar branding, and visual case studies with contemporary elegance.',
    atsScore: '94%',
    highlight: 'Visual Designers',
    defaultColor: '#059669'
  },
  { 
    id: 'magazine', 
    name: 'Editorial Spotlight', 
    category: 'Leadership & Media', 
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&q=80', 
    description: 'Editorial-grade headline balance, clean column hierarchy, and bold executive presentation for senior leaders.',
    atsScore: '95%',
    highlight: 'Executive Branding',
    defaultColor: '#4f46e5'
  },
];

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);
  const [portfolioList, setPortfolioList] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All' | 'Resumes' | 'Portfolios' | 'Templates'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated'); // 'updated' | 'alphabetical'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();

  // Dynamic time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleUseTemplate = async (template) => {
    if (!user) {
      toast.error('Please log in to create documents.');
      return;
    }
    setIsCreating(true);
    const uuid = uuidv4();
    
    let themeColor = template.defaultColor || '#4f46e5';
    let themeTemplate = 'Classic';

    if (template.id === 'classic') themeTemplate = 'Classic';
    else if (template.id === 'modern') themeTemplate = 'Modern';
    else if (template.id === 'minimal') themeTemplate = 'Minimal';
    else if (template.id === 'minimal-image') themeTemplate = 'MinimalImage';
    else if (template.id === 'magazine') themeTemplate = 'Modern';

    let demoData = {};
    if (template.id === 'classic') {
      demoData = {
        firstName: 'Jonathan',
        lastName: 'Vance',
        jobTitle: 'Senior Financial Analyst',
        address: 'New York, NY',
        phone: '+1 (555) 123-4567',
        email: user?.primaryEmailAddress?.emailAddress || 'j.vance@executive.com',
        summery: 'Results-driven Senior Financial Analyst with 8+ years of experience directing corporate financial planning, detailed capital budgeting, and strategic asset allocation. Proven track record of optimizing cost structures and improving portfolio yield by 14%.',
        Experience: [
          {
            companyName: 'Vanguard Asset Management',
            city: 'New York',
            state: 'NY',
            title: 'Senior Financial Analyst',
            startDate: 'Jan 2021',
            endDate: 'Present',
            workSummery: '• Led capital budgeting process for a $200M infrastructure fund, reducing forecast variance by 8%.\n• Developed automated financial models using Python and SQL to streamline monthly portfolio performance reports.\n• Advised C-suite leadership on market risk factors, driving a 12% increase in year-over-year asset efficiency.'
          }
        ],
        Education: [
          {
            universityName: 'Columbia University',
            degree: 'Master of Science in Financial Engineering',
            major: 'Quantitative Finance',
            startDate: 'Sep 2017',
            endDate: 'May 2019'
          }
        ],
        skills: [{ name: 'Financial Modeling', rating: 5 }, { name: 'Quantitative Analysis', rating: 5 }, { name: 'Python / SQL', rating: 4 }, { name: 'Capital Budgeting', rating: 5 }]
      };
    } else if (template.id === 'modern') {
      demoData = {
        firstName: 'Aria',
        lastName: 'Chen',
        jobTitle: 'Lead Product Designer',
        address: 'San Francisco, CA',
        phone: '+1 (415) 987-6543',
        email: user?.primaryEmailAddress?.emailAddress || 'aria.chen@studio.design',
        summery: 'Lead Product Designer specializing in interactive design systems, responsive web frameworks, and user journeys. Passionate about marrying human empathy with clean digital engineering to build modern software products.',
        Experience: [
          {
            companyName: 'SupaBase Labs',
            city: 'San Francisco',
            state: 'CA',
            title: 'Lead Product Designer',
            startDate: 'Mar 2022',
            endDate: 'Present',
            workSummery: '• Orchestrated rewrite of developer dashboard, improving user task completion rate by 34%.\n• Built and maintained open-source Figma-to-React design tokens system used by 50+ engineers.\n• Mentored a team of 4 junior visual designers, establishing modern UI patterns and standard prototyping guidelines.'
          }
        ],
        Education: [
          {
            universityName: 'UC Berkeley',
            degree: 'Bachelor of Arts',
            major: 'Cognitive Science & Interaction Design',
            startDate: 'Sep 2018',
            endDate: 'May 2021'
          }
        ],
        skills: [{ name: 'Figma Design', rating: 5 }, { name: 'React UI', rating: 4 }, { name: 'Design Tokens', rating: 5 }, { name: 'User Research', rating: 4 }]
      };
    } else if (template.id === 'minimal') {
      demoData = {
        firstName: 'David',
        lastName: 'Miller',
        jobTitle: 'Staff Software Engineer',
        address: 'Austin, TX',
        phone: '+1 (512) 555-8899',
        email: user?.primaryEmailAddress?.emailAddress || 'david.miller@tech.io',
        summery: 'Detail-oriented Staff Software Engineer with 10+ years of building resilient backend architectures, cloud-native services, and distributed message brokers. Dedicated to high-availability code with minimal overhead and optimal test coverage.',
        Experience: [
          {
            companyName: 'Stripe',
            city: 'Austin',
            state: 'TX',
            title: 'Staff Engineer',
            startDate: 'Oct 2020',
            endDate: 'Present',
            workSummery: '• Designed and implemented distributed payouts API handling 5,000+ operations per second.\n• Decreased P99 database query latency by 42% through query rewriting and intentional index optimization.\n• Led architecture steering committee, standardizing internal API guidelines across 12 product lines.'
          }
        ],
        Education: [
          {
            universityName: 'University of Texas at Austin',
            degree: 'Bachelor of Science',
            major: 'Computer Science',
            startDate: 'Sep 2014',
            endDate: 'May 2018'
          }
        ],
        skills: [{ name: 'Go / Java', rating: 5 }, { name: 'System Architecture', rating: 5 }, { name: 'Distributed Systems', rating: 5 }, { name: 'AWS / Kubernetes', rating: 4 }]
      };
    } else if (template.id === 'minimal-image') {
      demoData = {
        firstName: 'Lucas',
        lastName: 'Moreno',
        jobTitle: 'Senior Creative Director',
        address: 'Los Angeles, CA',
        phone: '+1 (213) 444-5555',
        email: user?.primaryEmailAddress?.emailAddress || 'l.moreno@creative.com',
        summery: 'Award-winning Creative Director with a track record of driving cross-media advertising campaigns and building immersive digital experiences for Fortune 500 consumer brands.',
        Experience: [
          {
            companyName: 'R/GA Media',
            city: 'Los Angeles',
            state: 'CA',
            title: 'Creative Director',
            startDate: 'Nov 2021',
            endDate: 'Present',
            workSummery: '• Directed 3 major visual rebrands, driving brand lift by 22%.\n• Managed $4M creative campaign production budget for global retail and apparel accounts.\n• Cultivated high-performing cross-functional design studio of 14 art directors and copywriters.'
          }
        ],
        Education: [
          {
            universityName: 'ArtCenter College of Design',
            degree: 'BFA',
            major: 'Graphic Design & Advertising',
            startDate: 'Sep 2015',
            endDate: 'May 2019'
          }
        ],
        skills: [{ name: 'Art Direction', rating: 5 }, { name: 'Brand Strategy', rating: 5 }, { name: 'Visual Storytelling', rating: 5 }, { name: 'UI / Motion Design', rating: 4 }]
      };
    } else if (template.id === 'magazine') {
      demoData = {
        firstName: 'Sienna',
        lastName: 'Sterling',
        jobTitle: 'Principal Communications Strategist',
        address: 'Chicago, IL',
        phone: '+1 (312) 666-7777',
        email: user?.primaryEmailAddress?.emailAddress || 'sterling@communications.co',
        summery: 'Principal Communications Strategist specializing in crisis PR, enterprise storytelling, and high-impact editorial features. Expert in brand perception management, corporate positioning, and executive speechwriting.',
        Experience: [
          {
            companyName: 'Edelman PR',
            city: 'Chicago',
            state: 'IL',
            title: 'Senior Director of Brand Communications',
            startDate: 'Feb 2020',
            endDate: 'Present',
            workSummery: '• Drafted keynote addresses and press releases for 5 Fortune 100 CEOs, reaching over 40M total views.\n• Designed and executed crisis communications plan for high-stakes product recall, mitigating net sentiment drop by 85%.\n• Formulated content syndication framework that boosted social engagement by 150% in 12 months.'
          }
        ],
        Education: [
          {
            universityName: 'Northwestern University',
            degree: 'Master of Science',
            major: 'Journalism & Integrated Marketing',
            startDate: 'Sep 2016',
            endDate: 'Jun 2018'
          }
        ],
        skills: [{ name: 'Crisis PR', rating: 5 }, { name: 'Executive Ghostwriting', rating: 5 }, { name: 'Media Relations', rating: 5 }, { name: 'Copywriting', rating: 4 }]
      };
    }

    const data = {
      data: {
        title: `My ${template.name}`,
        resumeId: uuid,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
        themeColor: themeColor,
        themeTemplate: themeTemplate,
        ...demoData
      }
    };

    GlobalApi.CreateNewResume(data).then(resp => {
      if (resp) {
        toast.success(`Created "${template.name}" with sample profile content.`);
        navigate('/dashboard/resume/' + (resp.data?.data?.documentId || uuid) + "/edit");
      }
    }).catch((err) => {
      console.error(err);
      toast.error("Failed to build resume from template.");
    }).finally(() => {
      setIsCreating(false);
    });
  };

  useEffect(() => {
    if (user) {
      GetResumesList();
      GetPortfoliosList();
    }
  }, [user]);

  const GetResumesList = () => {
    setIsLoadingResumes(true);
    GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress)
      .then(resp => {
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
  };

  const GetPortfoliosList = () => {
    setIsLoadingPortfolios(true);
    GlobalApi.GetUserPortfolios(user?.primaryEmailAddress?.emailAddress)
      .then(resp => {
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
  };

  const handleOptimisticDeleteResume = (documentId) => {
    setResumeList(prev => prev.filter(r => r.documentId !== documentId));
  };

  const getFilteredAndSorted = (list) => {
    let result = [...list];
    
    // Filter by search
    if (searchTerm) {
      result = result.filter(item => 
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sort
    if (sortBy === 'alphabetical') {
      result.sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
    } else if (sortBy === 'updated') {
      result.reverse(); 
    }
    
    return result;
  };

  const processedResumes = getFilteredAndSorted(resumeList);
  const processedPortfolios = getFilteredAndSorted(portfolioList);

  const showResumes = filter === 'All' || filter === 'Resumes';
  const showPortfolios = filter === 'All' || filter === 'Portfolios';
  const showTemplates = filter === 'Templates';

  const handleAIPromptSubmit = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsProcessingPrompt(true);
    try {
      const pLower = aiPrompt.toLowerCase();
      let intent = 'RESUME';
      if (pLower.includes('portfolio') || pLower.includes('website') || pLower.includes('site') || pLower.includes('showcase')) {
        intent = 'PORTFOLIO';
      } else if (pLower.includes('import') || pLower.includes('linkedin') || pLower.includes('github') || pLower.includes('upload')) {
        intent = 'IMPORT';
      }

      try {
        const SYSTEM_PROMPT = `Classify the user's intent into exactly one of three categories: 'RESUME', 'PORTFOLIO', or 'IMPORT'. Return ONLY a JSON object with a single key 'intent' containing the category string. User Prompt: "${aiPrompt}"`;
        const result = await AIChatSession.sendMessage(SYSTEM_PROMPT, 'routing');
        const responseText = await result.response.text();
        const parsed = extractCleanJson(responseText);
        if (parsed?.intent && ['RESUME', 'PORTFOLIO', 'IMPORT'].includes(parsed.intent.toUpperCase())) {
          intent = parsed.intent.toUpperCase();
        }
      } catch (err) {
        console.warn('AI intent routing fallback to heuristic:', err);
      }
      
      if (intent === 'RESUME') {
        navigate('/dashboard/resume/new/ai', { state: { prompt: aiPrompt } });
      } else if (intent === 'PORTFOLIO') {
        const response = await GlobalApi.CreateNewPortfolio({
          data: {
            title: (aiPrompt.slice(0, 30) + (aiPrompt.length > 30 ? '...' : '')),
            userEmail: user?.primaryEmailAddress?.emailAddress,
            userName: user?.fullName
          }
        });
        const newId = response?.data?.data?.documentId || response?.data?.id;
        navigate(`/dashboard/portfolio/${newId}/edit?generating=true`, { state: { prompt: aiPrompt } });
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
      transition: { staggerChildren: 0.05 }
    }
  };

  const totalPortfolioViews = portfolioList.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalResumeViews = resumeList.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalViews = totalPortfolioViews + totalResumeViews;

  const moduleTabVariants = {
    initial: { opacity: 0, y: 6 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.18, ease: 'easeOut' } 
    },
    exit: { 
      opacity: 0, 
      y: -6, 
      transition: { duration: 0.12, ease: 'easeIn' } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  const totalDocumentsCount = (resumeList?.length || 0) + (portfolioList?.length || 0);

  return (
    <div className="min-h-screen flex flex-col md:flex-row antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400">
      {/* Welcome Modal */}
      <WelcomeModal />
      
      {/* Top Mobile Bar */}
      <header className="flex justify-between items-center h-14 px-4 w-full fixed top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 md:hidden" role="banner">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            R
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Resume.ai</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/profile" aria-label="Go to Profile" className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 block">
            <img alt={user?.fullName || 'User'} className="w-full h-full object-cover" src={user?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAx5bIktZuZF3YmZVL-zf0HlzheENE6MOGaEeQNWUF3By2N0Z9w9GSARNuUBX2g1Wf7-gD5Nj7XVU4CmfGTbAWJhu-tx-hWwwSFUzew4Y8AktbsJP3w4HeK77qit9nhwgOhuZeAltabaJwuk5SS2CFWicgSEQUVLdz2wBk_Cls3Cv6t7SgpUfyThYqBtZVMLXSA2ks0yhx88A2U3AXk1VpWEEsUq6tHo0xikfW3VCyKm5ID94BSMJP4"}/>
          </Link>
        </div>
      </header>

      {/* Sidebar Navigation (Desktop) - Minimalist SaaS */}
      <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 overflow-y-auto">
        <div className="flex items-center h-14 px-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              R
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">Resume.ai</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Workspace</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main Navigation">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation
          </div>

          <Link to="/" aria-label="Home" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>Home</span>
          </Link>

          <Link to="/dashboard" aria-label="Documents Hub" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 transition-colors">
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span>Documents Hub</span>
          </Link>

          <Link to="/templates" aria-label="Templates" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <span className="material-symbols-outlined text-[18px]">auto_awesome_mosaic</span>
            <span>Templates</span>
          </Link>

          <Link to="/dashboard/cover-letters" aria-label="Cover Letters" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <span className="material-symbols-outlined text-[18px]">mail</span>
            <span>Cover Letters</span>
          </Link>

          <Link to="/interview" aria-label="Interview Coach" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <span className="material-symbols-outlined text-[18px]">record_voice_over</span>
            <span>Interview Coach</span>
          </Link>

          <Link to="/dashboard/import" aria-label="Import CV" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            <span>Import CV</span>
          </Link>
        </nav>

        {/* User Workspace Profile Card */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between px-1">
            <Link to="/settings" className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[18px]">settings</span>
              <span>Settings</span>
            </Link>
            <ThemeToggle />
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <img 
              alt={user?.fullName || 'User'} 
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
              src={user?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAdpNE5-WKm5MFn2b-yk7gA_p_Kn0HAZVhocCeU2LroTUEh6spLnuqz718WVyECY57YXlU_ZIFCUP0yGIJO_9U68aiTdsfRod1cixn6cKWCHGCU1TBw7YOsxAxmvaQRU7bQawiaphVcD7NXJGkEw4T17S5ZE5dsiLGnhuWWHpHu7DRWKB488oEZxy_BNFlnaOEAOYVeWHiKKyPLGYaj65KODG0706Jkyi97-2XpynlrGdiFF6kaYbQH"}
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.fullName || 'Studio User'}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.primaryEmailAddress?.emailAddress || 'Pro Workspace'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Body */}
      <main className="flex-1 w-full md:pl-60 pt-14 md:pt-0 min-h-screen pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
          
          {/* Header & Quick Action Row */}
          <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Workspace
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {totalDocumentsCount} active {totalDocumentsCount === 1 ? 'document' : 'documents'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                {getGreeting()}, {user?.firstName || 'Creator'}
              </h1>
            </div>

            {/* Quick Actions Cluster */}
            <div className="flex flex-wrap items-center gap-2">
              <AddResume renderTrigger={(onClick) => (
                <button 
                  onClick={onClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Resume</span>
                </button>
              )} />

              <AddPortfolio renderTrigger={(onClick) => (
                <button 
                  onClick={onClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-800 shadow-xs transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>New Portfolio</span>
                </button>
              )} />

              <MagicImportModal renderTrigger={(onClick) => (
                <button 
                  onClick={onClick}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-800 shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Magic Import</span>
                </button>
              )} />

              <GitHubSyncModal renderTrigger={(onClick) => (
                <button 
                  onClick={onClick}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-800 shadow-xs transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Sync</span>
                </button>
              )} />
            </div>
          </section>

          {/* Minimalist Executive KPI Ribbon */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-medium">Active Resumes</span>
                <FileText className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                  {resumeList?.length || 0}
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Tailored career profiles
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div style={{ width: '340.531px' }} className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-medium">Web Portfolios</span>
                <Globe className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                  {portfolioList?.length || 0}
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Published & hosted sites
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-medium">Career Views</span>
                <TrendingUp className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                  {totalViews}
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Across public links
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-medium">ATS Readiness</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
                  96%
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Enterprise format verified
                </span>
              </div>
            </div>
          </div>

          {/* AI Command & Prompt Bar (Clean Minimalist Linear Style) */}
          <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
            <form onSubmit={handleAIPromptSubmit} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-white">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>AI Studio Command</span>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Instant ATS resume or live portfolio
                </span>
              </div>

              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer resume for Stripe, or design portfolio..."
                  className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-lg pl-3.5 pr-24 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/60"
                />

                <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                  <button
                    type="submit"
                    disabled={isProcessingPrompt || !aiPrompt.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {isProcessingPrompt ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>Generate</span>
                  </button>
                </div>
              </div>

              {/* Quick Prompt Suggestion Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-medium">Suggestions:</span>
                <button
                  type="button"
                  onClick={() => setAiPrompt('Senior Full-Stack Engineer resume for high-scale SaaS')}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                >
                  Senior Full-Stack Engineer
                </button>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <button
                  type="button"
                  onClick={() => setAiPrompt('Lead Product Designer with design system focus')}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                >
                  Lead Product Designer
                </button>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <button
                  type="button"
                  onClick={() => setAiPrompt('Interactive software engineer portfolio with project showcase')}
                  className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                >
                  Engineering Portfolio
                </button>
              </div>
            </form>
          </div>

          {/* Document Management Hub Section */}
          <section className="flex flex-col gap-4 w-full">
            
            {/* Toolbar: Title, Filter Tabs, Search & Layout Switcher */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    Studio Documents
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage, edit, and optimize your career assets
                  </p>
                </div>

                {/* Segmented Filter Control */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl w-full sm:w-auto border border-slate-200 dark:border-slate-800 shadow-xs">
                  <button 
                    onClick={() => setFilter('All')} 
                    aria-label="Show All Documents"
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[34px] flex items-center justify-center gap-1.5 ${
                      filter === 'All' 
                        ? 'bg-white dark:bg-slate-900 shadow-xs text-slate-900 dark:text-white' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>All</span>
                    <span className="text-[10px] tabular-nums opacity-75">
                      ({totalDocumentsCount})
                    </span>
                  </button>
                  <button 
                    onClick={() => setFilter('Resumes')} 
                    aria-label="Show Resumes Only"
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[34px] flex items-center justify-center gap-1.5 ${
                      filter === 'Resumes' 
                        ? 'bg-white dark:bg-slate-900 shadow-xs text-slate-900 dark:text-white' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>Resumes</span>
                    <span className="text-[10px] tabular-nums opacity-75">
                      ({resumeList?.length || 0})
                    </span>
                  </button>
                  <button 
                    onClick={() => setFilter('Portfolios')} 
                    aria-label="Show Portfolios Only"
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[34px] flex items-center justify-center gap-1.5 ${
                      filter === 'Portfolios' 
                        ? 'bg-white dark:bg-slate-900 shadow-xs text-slate-900 dark:text-white' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>Portfolios</span>
                    <span className="text-[10px] tabular-nums opacity-75">
                      ({portfolioList?.length || 0})
                    </span>
                  </button>
                  <button 
                    onClick={() => setFilter('Templates')} 
                    aria-label="Show Template Gallery"
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[34px] flex items-center justify-center gap-1.5 ${
                      filter === 'Templates' 
                        ? 'bg-white dark:bg-slate-900 shadow-xs text-slate-900 dark:text-white' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>Templates</span>
                    <span className="text-[10px] tabular-nums opacity-75">
                      ({TEMPLATES?.length || 5})
                    </span>
                  </button>
                </div>
              </div>

              {/* Integrated Search Bar, Sort & View Mode Switcher */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative flex-1 w-full">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search documents by title or keywords..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-8 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs cursor-pointer"
                  >
                    <option value="updated">Recently Updated</option>
                    <option value="alphabetical">Alphabetical (A-Z)</option>
                  </select>

                  {/* Dual Grid / List View Toggle */}
                  <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/60 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid View"
                      className={`p-1.5 rounded-md transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                      title="Grid View"
                    >
                      <Grid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      aria-label="List View"
                      className={`p-1.5 rounded-md transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                      title="List View"
                    >
                      <ListIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${filter}-${viewMode}`}
                variants={moduleTabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <motion.div 
                   variants={containerVariants}
                   initial="hidden"
                   animate="show"
                   className={viewMode === 'grid' 
                     ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full" 
                     : "flex flex-col gap-2.5 w-full"
                   }
                >
                  {/* Skeletons for Loading State */}
                  {isLoadingResumes && showResumes && [1, 2, 3].map((item, index) => (
                    <motion.div 
                      variants={itemVariants} 
                      key={`skel-${index}`} 
                      className={viewMode === 'grid' 
                        ? "h-[300px] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between bg-white dark:bg-slate-900 shadow-xs" 
                        : "h-[64px] rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between bg-white dark:bg-slate-900"
                      }
                    >
                      <Skeleton className={viewMode === 'grid' ? "h-40 w-full mb-3 rounded-lg" : "h-10 w-10 rounded-lg"} />
                      <Skeleton className={viewMode === 'grid' ? "h-5 w-3/4 mb-2" : "h-5 w-48"} />
                      <Skeleton className="h-6 w-20 rounded-md" />
                    </motion.div>
                  ))}

                  {/* Resumes */}
                  {!isLoadingResumes && showResumes && processedResumes.map((resume) => (
                    <motion.div variants={itemVariants} key={resume.documentId} className={viewMode === 'grid' ? "w-full h-[300px]" : "w-full"}>
                      <ResumeCardItem 
                        resume={resume} 
                        refreshData={GetResumesList} 
                        optimisticDelete={handleOptimisticDeleteResume}
                        views={Math.floor(Math.random() * 250) + 12}
                        layout={viewMode}
                      />
                    </motion.div>
                  ))}
                  
                  {/* Portfolios Skeletons */}
                  {isLoadingPortfolios && showPortfolios && [1, 2].map((item, index) => (
                    <motion.div 
                      variants={itemVariants} 
                      key={`port-skel-${index}`} 
                      className={viewMode === 'grid' 
                        ? "h-[300px] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between bg-white dark:bg-slate-900 shadow-xs"
                        : "h-[64px] rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between bg-white dark:bg-slate-900"
                      }
                    >
                      <Skeleton className={viewMode === 'grid' ? "h-40 w-full mb-3 rounded-lg" : "h-10 w-10 rounded-lg"} />
                      <Skeleton className="h-5 w-3/4 mb-2" />
                    </motion.div>
                  ))}

                  {/* Portfolios Cards */}
                  {!isLoadingPortfolios && showPortfolios && processedPortfolios.map((portfolio) => (
                    <motion.div 
                      variants={itemVariants} 
                      key={portfolio.documentId} 
                      onClick={() => navigate(`/dashboard/portfolio/${portfolio.documentId}/edit`)} 
                      className={viewMode === 'grid'
                        ? "group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer overflow-hidden h-[300px]"
                        : "group flex items-center justify-between gap-4 p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer w-full"
                      }
                    >
                      {viewMode === 'grid' ? (
                        <>
                          <div className="relative w-full h-40 bg-slate-50 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-slate-800/80 p-4 group-hover:bg-slate-100/70 dark:group-hover:bg-slate-800/80 transition-colors">
                            <div className="w-36 h-28 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-200/90 dark:border-slate-700/80 p-2 transform scale-90 group-hover:scale-95 group-hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between pointer-events-none">
                              <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                <div className="h-1.5 w-16 bg-slate-300 dark:bg-slate-600 rounded-xs"></div>
                              </div>
                              <div className="grid grid-cols-2 gap-1 my-1">
                                <div className="h-7 bg-slate-100 dark:bg-slate-700/60 rounded-xs"></div>
                                <div className="h-7 bg-slate-100 dark:bg-slate-700/60 rounded-xs"></div>
                              </div>
                              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-xs"></div>
                            </div>

                            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="px-3.5 py-1.5 rounded-full bg-slate-900/95 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                <span>Open Studio</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </span>
                            </div>

                            <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-700/80 px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200 tracking-wide">DRAFT</span>
                            </div>
                          </div>

                          <div className="p-4 flex flex-col flex-1 justify-between bg-white dark:bg-slate-900">
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {portfolio.title || 'Untitled Portfolio'}
                              </h4>
                              {/* Zero-Pill Unboxed Metadata */}
                              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
                                <span>Portfolio</span>
                                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                                <span>Updated recently</span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Site</span>

                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-1 transition-colors min-h-[32px] px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                                <span>Edit</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                              <Globe className="w-5 h-5 text-white/95" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate transition-colors">
                                  {portfolio.title || 'Untitled Portfolio'}
                                </h4>
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              </div>
                              {/* Zero-Pill Unboxed Metadata */}
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                <span>Portfolio</span>
                                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>Updated recently</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors">
                              <span>Edit</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}

                  {/* Showcase the Template Gallery inside the tab */}
                  {showTemplates && TEMPLATES.map((template) => (
                    <motion.div 
                      variants={itemVariants} 
                      key={template.id}
                      onClick={() => handleUseTemplate(template)}
                      className={viewMode === 'grid'
                        ? "group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer overflow-hidden h-[340px]"
                        : "group flex items-center justify-between gap-4 p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer w-full"
                      }
                    >
                      {viewMode === 'grid' ? (
                        <>
                          {/* Visual Preview Zone */}
                          <div className="relative w-full h-44 bg-slate-100 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-slate-800/80 p-4 group-hover:bg-slate-200/50 dark:group-hover:bg-slate-800/80 transition-colors">
                            <img 
                              src={template.image} 
                              className="w-40 h-28 object-cover rounded-md shadow-sm border border-slate-200/90 dark:border-slate-700/80 transform scale-90 group-hover:scale-95 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none"
                              alt={template.name} 
                            />
                            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                {isCreating ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Sparkles className="w-3.5 h-3.5" />
                                )}
                                <span>Use this template</span>
                              </span>
                            </div>
                          </div>

                          {/* Card Content with Zero-Pill Metadata */}
                          <div className="p-4 flex flex-col flex-1 justify-between bg-white dark:bg-slate-900">
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {template.name}
                              </h4>
                              
                              {/* Zero-Pill Unboxed Metadata with Typographic Separators */}
                              <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
                                <span>{template.category}</span>
                                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">{template.atsScore} ATS</span>
                                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-medium">{template.highlight}</span>
                              </div>

                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                {template.description}
                              </p>
                            </div>

                            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                              <span className="text-xs text-slate-400 dark:text-slate-500">Ready to edit</span>
                              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                <span>Use this</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Compact List View */}
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            <img 
                              src={template.image} 
                              className="w-10 h-10 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-slate-800 shadow-xs" 
                              alt="" 
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate transition-colors">
                                {template.name}
                              </h4>
                              
                              {/* Zero-Pill list item metadata */}
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                <span>{template.category}</span>
                                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">{template.atsScore} ATS</span>
                                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                                <span className="text-indigo-600 dark:text-indigo-400 font-medium">{template.highlight}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUseTemplate(template);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-colors text-slate-800 dark:text-slate-200 text-xs font-semibold"
                            >
                              {isCreating ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600 group-hover:text-white dark:text-indigo-400" />
                              )}
                              <span>Use this</span>
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}

                  {/* Minimalist Modern Empty State */}
                  {(!isLoadingResumes && !isLoadingPortfolios) && filter !== 'Templates' && ((showResumes && resumeList.length === 0) && (showPortfolios && portfolioList.length === 0)) && (
                    <div className="col-span-full w-full py-12 px-6 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        No documents created yet
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
                        Start your career journey with an ATS-optimized resume, interactive portfolio, or choose from our curated template library.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <AddResume renderTrigger={(onClick) => (
                          <button 
                            onClick={onClick} 
                            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Create Blank Resume</span>
                          </button>
                        )} />
                        <button 
                          onClick={() => setFilter('Templates')} 
                          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
                        >
                          <LayoutTemplate className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Browse Templates</span>
                        </button>
                        <MagicImportModal renderTrigger={(onClick) => (
                          <button 
                            onClick={onClick} 
                            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Magic Import</span>
                          </button>
                        )} />
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;