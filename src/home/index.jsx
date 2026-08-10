import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PricingSection } from './components/PricingSection';
import { CheckoutModal } from './components/CheckoutModal';

function Home() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
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
<a className="font-label-md text-label-md text-on-surface-variant dark:text-outline-variant font-medium hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200" href="#">AI Import</a>
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
<div className="max-w-7xl mx-auto px-container-margin md:px-lg relative z-10 text-center flex flex-col items-center">
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/20 mb-8 shadow-sm">
<span className="material-symbols-outlined text-sm text-secondary" data-icon="sparkles">arrow_back_ios_new</span>
<span className="font-label-sm text-label-sm text-on-surface font-medium">Empowered Creativity v2.0 is here</span>
</div>
<h1 className="font-headline-xl text-headline-xl md:text-[64px] font-extrabold leading-tight tracking-tight mb-6 max-w-4xl">
                    Craft Your Future <br className="hidden md:block"/>with <span className="gradient-text">AI Magic</span>
</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-10">
                    Lower the barrier to professional-grade design. Sparkfolio combines intuitive tools with powerful AI to bring your creative vision to life instantly.
                </p>
<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
<Link to="/dashboard" className="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-200 flex items-center justify-center gap-2 min-h-[48px]">
                        Start Creating
                        <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
</Link>
<button className="bg-surface/50 backdrop-blur-sm text-primary border-2 border-primary/20 font-label-md text-label-md px-8 py-4 rounded-full hover:bg-surface-variant hover:border-primary/40 transition-all duration-200 flex items-center justify-center gap-2 min-h-[48px]">
<span className="material-symbols-outlined" data-icon="play_circle">play_circle</span>
                        Watch Demo
                    </button>
</div>
</div>
</section>
{/*  Bento Grid Feature Showcase  */}
<section className="py-xl max-w-7xl mx-auto px-container-margin md:px-lg w-full">
<div className="text-center mb-xl">
<h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Everything you need to create</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Powerful features wrapped in a delightfully simple interface.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-md md:gap-lg auto-rows-[300px]">
{/*  Bento Item 1: Large Span  */}
<div className="md:col-span-2 bg-surface rounded-xl p-lg shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-shadow duration-300 flex flex-col justify-between overflow-hidden relative group border border-outline-variant/30">
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
</div>
{/*  Bento Item 2: Small  */}
<div className="bg-surface rounded-xl p-lg shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-shadow duration-300 flex flex-col justify-between border border-outline-variant/30">
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
</div>
{/*  Bento Item 3: Small  */}
<div className="bg-surface rounded-xl p-lg shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-shadow duration-300 flex flex-col justify-between border border-outline-variant/30">
<div>
<div className="w-12 h-12 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mb-4">
<span className="material-symbols-outlined" data-icon="devices">devices</span>
</div>
<h3 className="font-headline-md text-headline-md text-xl mb-2">Responsive by Default</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Your designs automatically adapt to look perfect on desktop, tablet, and mobile.</p>
</div>
</div>
{/*  Bento Item 4: Medium Span  */}
<div className="md:col-span-2 bg-gradient-to-br from-surface to-surface-variant rounded-xl p-lg shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-shadow duration-300 flex items-center overflow-hidden border border-outline-variant/30 relative">
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
</div>
</div>
</section>

{/* Pricing Section */}
<PricingSection onUpgrade={handleUpgrade} />

<CheckoutModal 
  isOpen={checkoutOpen} 
  onOpenChange={setCheckoutOpen} 
  plan={selectedPlan} 
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
<a className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 rounded-full px-4 py-1 active:scale-90 transition-transform duration-150" href="#">
<span className="material-symbols-outlined" data-icon="auto_fix_high">auto_fix_high</span>
<span className="font-label-sm text-label-sm mt-1">AI Import</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 rounded-full px-4 py-1 active:scale-90 transition-transform duration-150" href="#">
<span className="material-symbols-outlined" data-icon="person">person</span>
<span className="font-label-sm text-label-sm mt-1">Profile</span>
</a>
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
