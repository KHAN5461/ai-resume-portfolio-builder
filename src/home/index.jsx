import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PricingSection } from './components/PricingSection';
import { CheckoutModal } from './components/CheckoutModal';
import { HeroAnimation } from './components/HeroAnimation';
import ResumePreview from '../dashboard/resume/components/ResumePreview';
import { useDispatch } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import { useUser } from '../auth.jsx';
import MagicImportModal from '../dashboard/components/MagicImportModal';

function Home() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [selectedAnnual, setSelectedAnnual] = useState(false);
  const dispatch = useDispatch();
  const { user } = useUser();

  // Inject dummy data for the demo
  React.useEffect(() => {
    dispatch(setResumeData({
        firstName: 'Jane',
        lastName: 'Doe',
        jobTitle: 'Senior Product Designer',
        address: 'San Francisco, CA',
        phone: '(555) 123-4567',
        email: 'jane.doe@example.com',
        themeColor: '#6F42C1',
        themeFont: 'Inter',
        summery: 'Award-winning product designer with 8+ years of experience in crafting intuitive, user-centric digital experiences.',
        experience: [
            {
                id: 1,
                title: 'Lead Designer',
                companyName: 'Tech Innovators Inc.',
                city: 'San Francisco',
                state: 'CA',
                startDate: '2020-01-01',
                endDate: '',
                currentlyWorking: true,
                workSummery: '<ul><li>Spearheaded the redesign of the core SaaS platform, increasing user retention by 25%.</li><li>Managed a team of 5 product designers.</li></ul>'
            }
        ],
        education: [
             {
                id: 1,
                universityName: 'Stanford University',
                startDate: '2014-09-01',
                endDate: '2018-06-01',
                degree: 'BFA',
                major: 'Interaction Design',
                description: 'Graduated with Honors.'
            }
        ],
        skills: [
            { id: 1, name: 'Figma', rating: 5 },
            { id: 2, name: 'React', rating: 4 },
            { id: 3, name: 'UI/UX Design', rating: 5 },
        ]
    }));
  }, [dispatch]);

  const handleUpgrade = (plan, isAnnual) => {
    setSelectedPlan(plan);
    setSelectedAnnual(isAnnual || false);
    setCheckoutOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="bg-background text-on-background font-body-md min-h-screen flex flex-col relative pt-16"
    >
      
{/*  TopAppBar  */}
<header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-container/80 backdrop-blur-md bg-surface/40 dark:bg-surface-container/40 shadow-sm transition-all duration-200">
<div className="flex justify-between items-center h-16 px-gutter max-w-7xl mx-auto w-full">
<div className="flex items-center gap-sm cursor-pointer active:scale-95 transition-transform duration-200">
<span className="material-symbols-outlined text-primary dark:text-primary-fixed" data-icon="auto_awesome">auto_awesome</span>
<span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">Sparkfolio</span>
</div>
{/*  Desktop Nav (Hidden on mobile)  */}
<nav className="hidden md:flex items-center gap-lg">
<Link className="font-label-md text-label-md text-primary dark:text-primary-fixed font-bold border-b-2 border-primary dark:border-primary-fixed pb-1 transition-colors duration-200" to="/">Home</Link>
<Link className="font-label-md text-label-md text-on-surface-variant dark:text-outline-variant font-medium hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200" to="/dashboard">Drafts</Link>
<Link className="font-label-md text-label-md text-on-surface-variant dark:text-outline-variant font-medium hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200" to="/dashboard">AI Import</Link>
</nav>
<div className="flex items-center">
<div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden cursor-pointer active:scale-95 transition-transform duration-200 shadow-sm" title="User profile photo">
<img className="w-full h-full object-cover" data-alt="A small, stylized avatar portrait of a creative professional with a warm smile, wearing a casual modern outfit, set against a vibrant turquoise and white background reflecting a light, optimistic UI aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg3w_o5egRI1AcjhxzuzxhyLlj0wpt1zYx31YuyjDaEm1Ebr12yTIeSIq1ATPmfdRK7BNZQUCkOs2R9W2rmGWKr-_dgNY9Ryp7cDWxZRFrbqvFEh2pPhQynOTlJN-uzrY-IqvUzDFNtkfEj2ubYH0ceoabMPzf-Qv-6wYrJXSSJdT8Nhe2YW0LkX-vVgAUwazrGclQZp-JE1Jn_09gH8PTWQE2ax9bXs_j8LBK84-DQdBgdqP8zmu-"/>
</div>
</div>
</div>
</header>
{/*  Main Content  */}
<main className="flex-grow flex flex-col">
{/*  Hero Section  */}
<section className="hero-bg relative overflow-hidden py-24 md:py-32 flex items-center justify-center min-h-[716px]">
{/*  Decorative Background Elements  */}
<div className="absolute top-10 left-10 w-64 h-64 bg-white/30 rounded-full blur-3xl"></div>
<div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
<div className="max-w-7xl mx-auto px-gutter relative z-10 text-center flex flex-col items-center">
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/20 mb-8 shadow-sm">
<span className="material-symbols-outlined text-sm text-secondary" data-icon="sparkles">arrow_back_ios_new</span>
<span className="font-label-sm text-label-sm text-on-surface font-medium">Empowered Creativity v2.0 is here</span>
</div>
<div className="w-full max-w-6xl mb-12 flex flex-col lg:flex-row items-center gap-12">
    <div className="flex-1 text-left">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[clamp(2.5rem,5vw+1rem,4rem)] font-extrabold leading-tight tracking-tight mb-6"
        >
            Get your resume ATS-ready in <span className="gradient-text">5 minutes</span>
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="font-body-lg text-body-lg text-on-surface-variant mb-10"
        >
            Stop guessing why you're getting rejected. Our AI analyzes, optimizes, and formats your resume to beat Applicant Tracking Systems and land you interviews.
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
            <MagicImportModal renderTrigger={(onClick) => (
                <button onClick={onClick} className="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-full shadow-[0_0_20px_rgba(159,91,255,0.4)] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(159,91,255,0.6)] hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px] cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                    Import LinkedIn / PDF
                </button>
            )} />
            <button className="bg-white/50 backdrop-blur-md text-primary border border-white/40 font-label-md text-label-md px-8 py-4 rounded-full hover:bg-white/80 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px] hover:-translate-y-1">
                <span className="material-symbols-outlined" data-icon="play_circle">play_circle</span>
                Watch Demo
            </button>
        </div>
    </div>
    <div className="flex-1 relative w-full perspective-1000">
        {/* Decorative elements behind the demo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-stitch-primary/20 to-secondary/20 rounded-[2rem] transform rotate-3 scale-105 -z-10"></div>
        <div className="w-full bg-white rounded-[2rem] shadow-2xl border-4 border-surface-container overflow-hidden p-4 relative group">
            <div className="absolute top-4 left-4 flex gap-2 z-20">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {/* The actual live preview embedded! */}
            <div className="w-full h-[500px] overflow-y-auto custom-scrollbar pt-8 rounded-xl scale-[0.8] origin-top bg-white pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                <ResumePreview />
            </div>
            {/* Overlay to encourage clicking */}
            <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[2rem]">
                <div className="bg-white text-stitch-primary font-bold px-6 py-3 rounded-full shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <span className="material-symbols-outlined">edit</span>
                    Live Editor Preview
                </div>
            </div>
        </div>
    </div>
</div>
</div>
</section>

{/* Before/After Transformation Showcase */}
<motion.section 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
    className="py-24 bg-surface-container-lowest"
>
    <div className="max-w-7xl mx-auto px-gutter text-center">
        <h2 className="text-[clamp(2rem,4vw+1rem,3rem)] font-bold text-on-surface mb-4">From Text File to Top 1% Candidate</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-16 max-w-2xl mx-auto">See the difference between a standard unformatted document and a Sparkfolio optimized resume.</p>
        
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
            {/* Before */}
            <div className="flex-1 w-full max-w-md">
                <div className="bg-surface-variant/30 rounded-t-xl py-3 px-4 border border-outline-variant/30 border-b-0 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <span className="text-sm font-mono text-on-surface-variant">resume_final_v3.txt</span>
                </div>
                <div className="bg-surface rounded-b-xl p-8 border border-outline-variant/30 text-left h-[400px] overflow-hidden shadow-sm relative grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all cursor-crosshair">
                    <div className="font-mono text-xs text-on-surface-variant leading-relaxed opacity-60">
                        <p className="mb-4">Jane Doe<br/>Senior Designer<br/>jane@example.com</p>
                        <p className="mb-4">SUMMARY<br/>I am a designer with 8 years of experience. I make things look good and work well.</p>
                        <p className="mb-4">EXPERIENCE<br/>Tech Corp<br/>Lead Designer<br/>2020-Present<br/>- Designed the main app.<br/>- Managed 5 people.</p>
                        <p className="mb-4">SKILLS<br/>Figma, UI, UX, React</p>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white font-bold px-4 py-2 rounded-lg transform -rotate-12 shadow-lg whitespace-nowrap">
                        ATS Rejected
                    </div>
                </div>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-4xl text-primary animate-pulse" data-icon="arrow_right_alt">arrow_right_alt</span>
            </div>

            {/* After */}
            <div className="flex-1 w-full max-w-md relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative">
                    <div className="bg-surface-container-lowest rounded-t-xl py-3 px-4 border border-outline-variant/30 border-b-0 flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            <span className="text-sm font-bold text-primary flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">auto_awesome</span> sparkfolio_optimized.pdf</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-b-xl border border-outline-variant/30 text-left h-[400px] overflow-hidden shadow-xl p-2 cursor-pointer transform group-hover:-translate-y-1 transition-transform">
                        <div className="w-full h-full scale-[0.6] origin-top">
                            <ResumePreview />
                        </div>
                        <div className="absolute bottom-4 right-4 bg-green-500 text-white font-bold px-4 py-2 rounded-full shadow-lg whitespace-nowrap flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">check_circle</span> Top 1% Match
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</motion.section>

{/*  Bento Grid Feature Showcase  */}
<motion.section 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
    className="py-xl max-w-7xl mx-auto px-gutter w-full"
>
<div className="text-center mb-xl">
<h2 className="text-[clamp(2rem,4vw+1rem,3rem)] font-bold text-on-surface mb-4">Everything you need to create</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Powerful features wrapped in a delightfully simple interface.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-md md:gap-lg auto-rows-[300px]">
{/*  Bento Item 1: Large Span  */}
<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="md:col-span-2 bg-surface/70 backdrop-blur-md rounded-2xl p-lg shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden relative group border border-white/60 dark:border-white/10">
<div className="relative z-10">
<div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-4">
<span className="material-symbols-outlined" data-icon="auto_fix_high">auto_fix_high</span>
</div>
<h3 className="font-headline-md text-headline-md mb-2">Instant AI Generation</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">Describe your vision, and watch as our AI creates stunning layouts, images, and copy in seconds.</p>
</div>
<div className="absolute -bottom-10 -right-10 w-2/3 h-2/3 rounded-tl-2xl overflow-hidden shadow-lg group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-500">
<img className="w-full h-full object-cover" data-alt="A sleek digital workspace showing an abstract, modern UI dashboard interface on a screen, bathed in soft, diffused light mode illumination with white backgrounds and crisp teal and purple accents. The interface displays playful geometric shapes and smooth data visualizations, conveying a high-tech yet approachable creative tool environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOvL-9SUuiII7JhJJZNGmwa54OQ1wDMv0_wY8YLdsAnXZ2kOtl4-gw4kqrLwkjzt2NtQCulaes6_tRJdlN3o72doF9w_6SrYKCJ_qlD6Yh50-7SjsWOO-yUT7oDFgcmZabEvhb5G6j_KsMTK4KEvcBgW8Y-IxyHqM-vD0l_QTMQpc_9cdLMUsPiCKMlwsOUXY5ANFmeFFDMP9o-ZCJG88ItbOBjW5KtMH6u3Brmu3iyapgR2EDLJl0"/>
</div>
</motion.div>
{/*  Bento Item 2: Small  */}
<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="bg-surface/70 backdrop-blur-md rounded-2xl p-lg shadow-sm hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between border border-white/60 dark:border-white/10">
<div>
<div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-4">
<span className="material-symbols-outlined" data-icon="palette">palette</span>
</div>
<h3 className="font-headline-md text-headline-md text-xl mb-2">Smart Themes</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Apply cohesive color palettes and typography across your entire project instantly.</p>
</div>
<div className="flex gap-2 mt-4">
<div className="h-8 flex-1 rounded-full bg-primary"></div>
<div className="h-8 flex-1 rounded-full bg-secondary"></div>
<div className="h-8 flex-1 rounded-full bg-tertiary"></div>
</div>
</motion.div>
{/*  Bento Item 3: Small  */}
<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="bg-surface/70 backdrop-blur-md rounded-2xl p-lg shadow-sm hover:shadow-2xl hover:shadow-tertiary/10 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between border border-white/60 dark:border-white/10">
<div>
<div className="w-12 h-12 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mb-4">
<span className="material-symbols-outlined" data-icon="devices">devices</span>
</div>
<h3 className="font-headline-md text-headline-md text-xl mb-2">Responsive by Default</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Your designs automatically adapt to look perfect on desktop, tablet, and mobile.</p>
</div>
</motion.div>
{/*  Bento Item 4: Medium Span  */}
<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="md:col-span-2 bg-gradient-to-br from-surface/80 to-surface-variant/80 backdrop-blur-md rounded-2xl p-lg shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 flex items-center overflow-hidden border border-white/60 dark:border-white/10 relative group">
<div className="w-1/2 pr-8 z-10">
<h3 className="font-headline-md text-headline-md mb-2">Seamless Collaboration</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Work together in real-time. Leave comments, share drafts, and iterate faster than ever.</p>
<button className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1">
                            Invite Team <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
<div className="absolute right-0 top-0 bottom-0 w-1/2">
<img className="w-full h-full object-cover object-left opacity-90" data-alt="A bright, minimalist collage showing diverse, smiling professional avatars interconnected by flowing lines and small UI 'comment' bubbles. The aesthetic uses soft white backgrounds, pastel teal and purple accents, and diffused lighting to convey a sense of modern, friendly digital teamwork in a light mode setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoaGu-MWRfkGeCW3jDQJpVFs2T8z1Op-DAVXu2mjDQjGliw7TR0ou7Rg4Qk8fJPpgVn5Edle1wG3SXAbMMdczwzIQgxEwLFIsJBVhpVGbgkC9EOuJStSpyrJtB_uNOlint2wjLdRChlB43UD1jOhjuBcTZdIGYHHyOjfcZI1Hs2HevzeY3SRT6vKsRzXXJhG6a-dRUkIN8vlsXz1XHMUBtG0WONjtgj8uVnoSi5WNB0MzHbo2kWrBF"/>
</div>
</motion.div>
</div>
</motion.section>

{/* Pricing Section */}
<PricingSection onUpgrade={handleUpgrade} />

<CheckoutModal 
  isOpen={checkoutOpen} 
  onOpenChange={setCheckoutOpen} 
  plan={selectedPlan}
  isAnnual={selectedAnnual}
  userEmail={user?.primaryEmailAddress?.emailAddress || ''}
  userId={user?.id || ''}
/>

</main>
{/*  BottomNavBar (Mobile Only)  */}
<nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-2 px-4 md:hidden bg-surface dark:bg-surface-container-highest rounded-t-xl shadow-[0px_-2px_10px_rgba(0,0,0,0.05)] z-50">
<Link className="flex flex-col items-center justify-center bg-primary-container dark:bg-primary text-on-primary-container dark:text-on-primary rounded-full px-4 py-1 active:scale-90 transition-transform duration-150" to="/">
<span className="material-symbols-outlined" data-icon="home" style={{ /* font-variation-settings: 'FILL' 1; */ }}>home</span>
<span className="font-label-sm text-label-sm mt-1">Home</span>
</Link>
<Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 rounded-full px-4 py-1 active:scale-90 transition-transform duration-150" to="/dashboard">
<span className="material-symbols-outlined" data-icon="description">description</span>
<span className="font-label-sm text-label-sm mt-1">Drafts</span>
</Link>
<Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 rounded-full px-4 py-1 active:scale-90 transition-transform duration-150" to="/dashboard">
<span className="material-symbols-outlined" data-icon="auto_fix_high">auto_fix_high</span>
<span className="font-label-sm text-label-sm mt-1">AI Import</span>
</Link>
<Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 rounded-full px-4 py-1 active:scale-90 transition-transform duration-150" to="/profile">
<span className="material-symbols-outlined" data-icon="person">person</span>
<span className="font-label-sm text-label-sm mt-1">Profile</span>
</Link>
</nav>
{/*  Footer  */}
<footer className="w-full py-xl bg-surface-container-low dark:bg-surface-dim mt-auto mb-16 md:mb-0">
<div className="flex flex-col md:flex-row justify-between items-center px-gutter max-w-7xl mx-auto space-y-md md:space-y-0">
<div className="flex flex-col items-center md:items-start gap-2">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary dark:text-primary-fixed" data-icon="auto_awesome">auto_awesome</span>
<span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">Sparkfolio</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">© 2024 Sparkfolio AI. Empowering creators worldwide.</p>
<div className="flex items-center gap-4 mt-2">
    <span className="flex items-center gap-1 text-[11px] font-mono text-outline-variant bg-surface-container py-1 px-2 rounded"><span className="material-symbols-outlined text-[14px]">bolt</span> Powered by Vercel</span>
    <span className="flex items-center gap-1 text-[11px] font-mono text-outline-variant bg-surface-container py-1 px-2 rounded"><span className="material-symbols-outlined text-[14px]">search</span> SEO-Optimized</span>
</div>
</div>
<nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
<a className="font-label-md text-label-md text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-all cursor-pointer" href="#">Privacy Policy</a>
<a className="font-label-md text-label-md text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-all cursor-pointer" href="#">Terms of Service</a>
<a className="font-label-md text-label-md text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-all cursor-pointer" href="#">Help Center</a>
<a className="font-label-md text-label-md text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed underline decoration-2 transition-all cursor-pointer" href="#">Feedback</a>
</nav>
</div>
</footer>

    </motion.div>
  );
}

export default Home;
