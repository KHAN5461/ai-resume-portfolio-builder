import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Settings, Palette, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenCommandPalette');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        toast("💡 Pro tip: Press Ctrl+K to open the quick command palette");
        localStorage.setItem('hasSeenCommandPalette', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command) => {
    setIsOpen(false);
    setSearch('');
    command();
  };

  const commands = [
    { id: '1', name: 'Create New Resume', icon: <FileText size={16} />, action: () => navigate('/dashboard') },
    { id: '2', name: 'Change Theme', icon: <Palette size={16} />, action: () => alert('Mock: Theme Changed') },
    { id: '3', name: 'Generate AI Bullets', icon: <Zap size={16} />, action: () => alert('Mock: Generating Bullets') },
    { id: '4', name: 'Settings', icon: <Settings size={16} />, action: () => alert('Mock: Open Settings') },
  ];

  const filteredCommands = commands.filter((command) =>
    command.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-surface rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col"
          >
            <div className="flex items-center px-4 py-3 border-b border-outline-variant/30 gap-3">
              <Search className="w-5 h-5 text-on-surface-variant" />
              <input
                autoFocus
                className="flex-1 bg-transparent border-none outline-none font-body-md text-on-surface placeholder:text-on-surface-variant/50"
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsOpen(false);
                    if (e.key === 'Enter' && filteredCommands.length > 0) runCommand(filteredCommands[0].action);
                }}
              />
              <span className="font-label-sm text-[10px] text-on-surface-variant bg-surface-variant/50 px-2 py-1 rounded">ESC</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="p-4 text-center font-body-sm text-on-surface-variant">No results found.</div>
              ) : (
                filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => runCommand(cmd.action)}
                    className="w-full flex items-center gap-3 px-3 py-3 hover:bg-surface-variant/50 rounded-lg text-left font-body-md text-on-surface transition-colors"
                  >
                    <div className="text-stitch-primary">{cmd.icon}</div>
                    {cmd.name}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
