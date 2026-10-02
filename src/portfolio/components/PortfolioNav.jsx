import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function PortfolioNav({ data, blocks }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const siteName = data?.heroSection?.greeting?.replace(/^Hi,?\s*I'?m\s*/i, '') 
    || data?.title 
    || 'Portfolio';

  // Build nav links from the blocks that exist
  const navLinks = (blocks || [])
    .filter(b => b.visible !== false)
    .map(b => {
      const type = b.type || b.id;
      const labels = { hero: 'Home', about: 'About', projects: 'Work', skills: 'Skills', contact: 'Contact' };
      return { id: type, label: labels[type] || type };
    })
    .filter(l => l.label);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 md:px-8 flex items-center justify-between h-16">
        
        {/* Logo / Name */}
        <a href="#hero" className="text-lg font-bold text-slate-900 dark:text-white tracking-tight hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          {siteName}
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.filter(l => l.id !== 'hero').map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          {data?.contactSection?.email && (
            <a
              href={`mailto:${data.contactSection.email}`}
              className="text-sm font-medium bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Say Hello
            </a>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 flex flex-col gap-3 shadow-lg">
          {navLinks.filter(l => l.id !== 'hero').map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-1.5 transition-colors"
            >
              {link.label}
            </a>
          ))}
          {data?.contactSection?.email && (
            <a
              href={`mailto:${data.contactSection.email}`}
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium bg-indigo-600 text-white px-5 py-2.5 rounded-full text-center hover:bg-indigo-700 transition-colors mt-2"
            >
              Say Hello
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
