import React, { useState } from 'react';
import Header from '../components/custom/Header';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/auth.jsx';
import { 
  FileText, 
  Globe, 
  ArrowRight, 
  Check, 
  Sparkles, 
  ExternalLink
} from 'lucide-react';
import { CheckoutModal } from './components/CheckoutModal';

function Home() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  const [heroMode, setHeroMode] = useState('resume'); // 'resume' | 'portfolio'
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isAnnual, setIsAnnual] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleUpgrade = (plan, annual) => {
    setSelectedPlan(plan);
    setIsAnnual(annual);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-950">
      <Header />

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        plan={selectedPlan}
        isAnnual={isAnnual}
        userEmail={user?.primaryEmailAddress?.emailAddress}
        userId={user?.id}
      />

      <main className="flex-1 flex flex-col">
        {/* HERO SECTION - Modern Minimalist & Editorial */}
        <section className="relative pt-16 pb-20 md:pt-28 md:pb-32 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          {/* Subtle Hairline Grid Pattern */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04]" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', 
              backgroundSize: '32px 32px' 
            }} 
          />

          <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              {/* Category Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-600 dark:text-slate-400 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Next-Gen Career Architecture</span>
                <span className="text-slate-300 dark:text-slate-700">/</span>
                <span className="text-slate-900 dark:text-slate-200 font-semibold">ATS Resumes & Portfolios</span>
              </div>

              {/* Main Editorial Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6">
                Craft career assets that command attention and pass screening.
              </h1>

              {/* Editorial Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed mb-10 max-w-2xl">
                Build recruiter-tested ATS resumes and interactive personal portfolios in one unified workspace. Real-time ATS scoring, STAR-method bullet refinement, and instant publishing.
              </p>

              {/* Primary Call to Action */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-14">
                <Link to={isSignedIn ? "/dashboard" : "/auth/sign-in"} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 rounded-lg px-7 py-5 text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link to="/templates" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg px-6 py-5 text-sm font-medium transition-all">
                    Browse 12+ Templates
                  </Button>
                </Link>
              </div>

              {/* Editorial Metrics Banner */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800/80 w-full text-left">
                <div className="space-y-1">
                  <div className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">98.4%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">ATS screening parse rate</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">3.2×</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Recruiter response rate</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">15,000+</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Professional resumes built</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 tracking-tight">Zero Paywall</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Full export to PDF and web</div>
                </div>
              </div>
            </div>

            {/* DUAL WORKSPACE PREVIEW (Minimalist & Crisp) */}
            <div className="mt-16 max-w-5xl mx-auto">
              {/* Segmented Control */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setHeroMode('resume')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      heroMode === 'resume'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                    <span>Executive ATS Resume</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800/40">98 ATS</span>
                  </button>

                  <button
                    onClick={() => setHeroMode('portfolio')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      heroMode === 'portfolio'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                    <span>Interactive Portfolio</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 font-semibold border border-sky-200 dark:border-sky-800/40">Live Site</span>
                  </button>
                </div>
              </div>

              {/* Showcase Frame */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                {/* Clean Top Bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="ml-3 font-mono text-[11px] text-slate-500">
                      {heroMode === 'resume' ? 'workspace.ai/editor/alex-morgan-resume' : 'launchpad.page/alex-morgan'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ATS Optimized
                    </span>
                    <Link to={isSignedIn ? "/dashboard" : "/auth/sign-in"}>
                      <button className="text-xs px-2.5 py-1 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium hover:opacity-90 transition-opacity">
                        Use Template
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Showcase Content */}
                <div className="p-6 md:p-8">
                  {heroMode === 'resume' ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                      {/* Left: Minimalist Editorial Resume Document */}
                      <div className="md:col-span-8 bg-slate-50/50 dark:bg-slate-950/40 p-6 md:p-8 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-6">
                        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2">
                            <div>
                              <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Alex Morgan</h3>
                              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Staff Distributed Systems Engineer</p>
                            </div>
                            <div className="text-xs text-slate-500 font-mono">
                              San Francisco, CA • alex.morgan@domain.com
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Executive Summary</div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                            High-impact engineer with 8+ years architecting fault-tolerant distributed platforms and cloud-native microservices. Led high-throughput infrastructure processing 25M+ daily requests, cutting cloud infrastructure costs by 34% while maintaining 99.999% uptime.
                          </p>
                        </div>

                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Work Experience</div>
                          <div className="space-y-4">
                            <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-3 space-y-1.5">
                              <div className="flex justify-between items-baseline text-xs font-semibold text-slate-900 dark:text-white">
                                <span>Lead Infrastructure Engineer • Stripe</span>
                                <span className="text-slate-500 font-mono font-normal">2021 — Present</span>
                              </div>
                              <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-1">
                                <li>Architected multi-region event payout engine handling <strong>$2.4B annual volume</strong> with 99.999% availability.</li>
                                <li>Engineered Redis cluster caching and indexed PostgreSQL queries, reducing p99 API latency from 450ms to 42ms.</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Core Competencies & Keywords</div>
                          <div className="flex flex-wrap gap-1.5">
                            {['Distributed Systems', 'TypeScript', 'Go', 'Kubernetes', 'Redis', 'PostgreSQL', 'GraphQL', 'System Design'].map((skill, i) => (
                              <span key={i} className="px-2 py-0.5 text-[11px] font-medium rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: ATS Verification Telemetry */}
                      <div className="md:col-span-4 space-y-4">
                        <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">ATS Quality Score</span>
                            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">98 / 100</span>
                          </div>

                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[98%]"></div>
                          </div>

                          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>Standard headings parsed accurately</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>Quantified STAR achievements detected</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>Clean single-column parsing layout</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2">
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                            <span>In-Editor AI Bullet Refinement</span>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                            Click any bullet inside the editor to rephrase with strong action verbs, punchy metrics, and industry keywords.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* PORTFOLIO SHOWCASE */
                    <div className="space-y-6">
                      <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                          <div>
                            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">● Available for Staff Engineering Roles</span>
                            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">Alex Morgan</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Building resilient distributed architectures and developer tools.</p>
                          </div>
                          <div className="flex gap-2">
                            <span className="px-3 py-1.5 text-xs font-medium rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                              GitHub Sync
                            </span>
                            <span className="px-3 py-1.5 text-xs font-medium rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                              Get in Touch
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                            <div className="flex justify-between items-center text-xs font-semibold text-slate-900 dark:text-white">
                              <span>Multi-Region Engine</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              Distributed transaction ledger with sub-second cross-cloud replication.
                            </p>
                            <span className="inline-block text-[10px] font-mono text-slate-400">Go • Redis • Raft</span>
                          </div>

                          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                            <div className="flex justify-between items-center text-xs font-semibold text-slate-900 dark:text-white">
                              <span>Telemetry Pipeline</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              Real-time observability stream handling 100K metrics/sec.
                            </p>
                            <span className="inline-block text-[10px] font-mono text-slate-400">TypeScript • Kafka</span>
                          </div>

                          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                            <div className="flex justify-between items-center text-xs font-semibold text-slate-900 dark:text-white">
                              <span>Open API Gateway</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              Zero-trust proxy with automated token rotation and rate limiting.
                            </p>
                            <span className="inline-block text-[10px] font-mono text-slate-400">Rust • Envoy</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOW VALUE SECTION - Clean Three Columns */}
        <section className="py-20 md:py-28 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="max-w-xl mb-16">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Engineered for Results</span>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mt-1">
                Everything required to stand out in today's candidate pool.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
                <div className="w-8 h-8 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">ATS-Compliant Structure</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Clean hierarchical styling without text boxes, multi-column breaks, or graphics that confuse Taleo, Workday, or Greenhouse parsers.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
                <div className="w-8 h-8 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">In-Editor AI Bullet Polish</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Transform raw tasks into quantifiable achievements. Polish phrasing with the STAR methodology directly within the rich text editor.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-3">
                <div className="w-8 h-8 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
                  <Globe className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">One-Click Portfolio Sync</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Convert your verified resume into a responsive live web portfolio with your custom handle, GitHub repository sync, and social links.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="py-20 md:py-28 bg-white dark:bg-slate-950">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">
              Ready to elevate your job search?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              Start building your resume or portfolio in minutes. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to={isSignedIn ? "/dashboard" : "/auth/sign-in"}>
                <Button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 rounded-lg px-8 py-5 text-sm font-medium transition-all shadow-sm">
                  Start Building Now
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="outline" className="w-full sm:w-auto border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-6 py-5 text-sm font-medium">
                  Explore Templates
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* MINIMALIST FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 px-6 md:px-12 text-xs text-slate-500 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
            <span>Resume.ai</span>
            <span>—</span>
            <span className="text-slate-500">Modern ATS Career Workspace</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/templates" className="hover:text-slate-900 dark:hover:text-white transition-colors">Templates</Link>
            <Link to="/interview" className="hover:text-slate-900 dark:hover:text-white transition-colors">Mock Interview</Link>
            <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
