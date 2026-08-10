import React, { useState } from 'react';

export const PricingSection = ({ onUpgrade }) => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="py-24 relative max-w-7xl mx-auto px-6 md:px-12 w-full z-10">
      <div className="text-center mb-16 relative z-20">
        <h2 className="font-headline-lg text-4xl md:text-5xl font-bold text-slate-50 mb-6 tracking-tight">
          Simple, transparent pricing
        </h2>
        <p className="font-body-lg text-slate-400 max-w-2xl mx-auto text-lg">
          No hidden fees. No surprise charges. Upgrade your career today.
        </p>
        
        {/* Toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-slate-50' : 'text-slate-400'}`}>Monthly</span>
          <button 
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 rounded-full bg-slate-800 border border-slate-700 relative p-1 transition-colors cursor-pointer"
          >
            <div className={`w-5 h-5 rounded-full bg-indigo-500 transition-transform duration-300 ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-slate-50' : 'text-slate-400'}`}>Annually</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-20">
        {/* Tier 1: Starter */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 flex flex-col hover:border-slate-700 transition-colors">
          <h3 className="text-xl font-bold text-slate-50 mb-2">Starter</h3>
          <p className="text-sm text-slate-400 mb-6">Perfect for students and job-seekers just starting out.</p>
          <div className="text-4xl font-extrabold text-slate-50 mb-8">$0<span className="text-lg text-slate-500 font-medium">/mo</span></div>
          <button className="w-full py-3 px-4 rounded-xl font-semibold text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-all mb-8">
            Get Started Free
          </button>
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span><span className="text-sm text-slate-300">1 Active Resume</span></div>
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span><span className="text-sm text-slate-300">1 Live Portfolio</span></div>
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span><span className="text-sm text-slate-300">Standard ATS PDF Export</span></div>
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span><span className="text-sm text-slate-300">Basic AI Text Transform</span></div>
          </div>
        </div>

        {/* Tier 2: Pro */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-indigo-500/80 shadow-[0_0_40px_rgba(99,102,241,0.15)] rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">local_fire_department</span> Most Popular
          </div>
          <h3 className="text-xl font-bold text-indigo-400 mb-2">Pro</h3>
          <p className="text-sm text-slate-400 mb-6">Active professionals wanting high-impact results.</p>
          <div className="text-4xl font-extrabold text-slate-50 mb-8">
            ${isAnnual ? '7' : '9'}<span className="text-lg text-slate-500 font-medium">/mo</span>
          </div>
          <button 
            onClick={() => onUpgrade('pro')}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all mb-8"
          >
            Upgrade to Pro
          </button>
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-indigo-400 text-lg">check_circle</span><span className="text-sm text-slate-300">Unlimited Resumes & Portfolios</span></div>
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-indigo-400 text-lg">check_circle</span><span className="text-sm text-slate-300">Advanced AI STAR-Method Optimizer</span></div>
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-indigo-400 text-lg">check_circle</span><span className="text-sm text-slate-300">Real-time ATS Score Ring</span></div>
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-indigo-400 text-lg">check_circle</span><span className="text-sm text-slate-300">Custom Accent Theme Presets</span></div>
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-indigo-400 text-lg">check_circle</span><span className="text-sm text-slate-300">Priority PDF Export</span></div>
          </div>
        </div>

        {/* Tier 3: Enterprise */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 flex flex-col hover:border-slate-700 transition-colors">
          <h3 className="text-xl font-bold text-slate-50 mb-2">Enterprise</h3>
          <p className="text-sm text-slate-400 mb-6">Power users, freelancers, and small agencies.</p>
          <div className="text-4xl font-extrabold text-slate-50 mb-8">
            ${isAnnual ? '24' : '29'}<span className="text-lg text-slate-500 font-medium">/mo</span>
          </div>
          <button 
            onClick={() => onUpgrade('enterprise')}
            className="w-full py-3 px-4 rounded-xl font-semibold text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-all mb-8"
          >
            Contact Sales
          </button>
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span><span className="text-sm text-slate-300">Custom Domain Mapping</span></div>
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span><span className="text-sm text-slate-300">White-label Portfolios</span></div>
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span><span className="text-sm text-slate-300">Bulk Resume Parser API</span></div>
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span><span className="text-sm text-slate-300">Team Collaboration</span></div>
            <div className="flex items-center gap-3"><span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span><span className="text-sm text-slate-300">VIP Support</span></div>
          </div>
        </div>
      </div>
    </section>
  );
};
