import React from 'react';

const SECTIONS = ['hero', 'about', 'projects', 'skills', 'contact'];

export default function SectionInspectorNav({ currentSection, onSelectSection }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto p-1.5 bg-surface-variant/30 dark:bg-slate-800 rounded-xl mb-4 scrollbar-none border border-outline-variant/20">
      {SECTIONS.map((sec) => (
        <button
          key={sec}
          onClick={() => onSelectSection(sec)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap flex-1 text-center ${
            currentSection === sec 
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' 
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {sec}
        </button>
      ))}
    </div>
  );
}
