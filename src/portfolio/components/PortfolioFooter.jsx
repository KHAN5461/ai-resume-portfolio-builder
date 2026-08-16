import React from 'react';

export default function PortfolioFooter({ data }) {
  const siteName = data?.heroSection?.greeting?.replace(/^Hi,?\s*I'?m\s*/i, '') 
    || data?.title 
    || 'Portfolio';
  
  const year = new Date().getFullYear();
  const socialLinks = data?.contactSection?.socialLinks || [];

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 md:py-16">
        
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          
          {/* Left: Branding */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {siteName}
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center md:text-left max-w-xs">
              {data?.aboutSection?.bioTitle || 'Designed and built with care.'}
            </p>
          </div>

          {/* Center: Quick Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#hero" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Home</a>
            <a href="#about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">About</a>
            <a href="#projects" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Work</a>
            <a href="#skills" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Skills</a>
            <a href="#contact" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
          </div>

          {/* Right: Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-mono font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-wider transition-colors"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {year} {siteName}. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Built with ResumeCraft AI
          </p>
        </div>

      </div>
    </footer>
  );
}
