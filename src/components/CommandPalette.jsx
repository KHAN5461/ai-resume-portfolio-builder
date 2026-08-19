import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { Search, Home, FileText, LayoutTemplate, Plus, Settings, User, Palette, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CommandPalette.css';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const onSelect = (action) => {
    setOpen(false);
    action();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[15vh]">
      <div className="bg-surface w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col cmdk-container relative">
        <Command label="Global Command Menu" shouldFilter={true} className="flex flex-col w-full">
          <div className="flex items-center border-b border-outline-variant/30 px-4" cmdk-input-wrapper="">
            <Search className="w-5 h-5 text-on-surface-variant shrink-0" />
            <Command.Input 
              autoFocus 
              placeholder="Type a command or search..." 
              className="flex-1 bg-transparent border-0 outline-none px-3 py-4 text-on-surface font-body-md placeholder:text-on-surface-variant/50"
            />
            <span className="text-xs font-label-sm text-on-surface-variant bg-surface-variant/50 px-2 py-1 rounded-md">Esc</span>
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar">
            <Command.Empty className="py-6 text-center text-on-surface-variant font-body-sm">
              No results found.
            </Command.Empty>
            
            <Command.Group heading="Navigation">
              <Command.Item onSelect={() => onSelect(() => navigate('/dashboard'))} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-surface-variant/50 text-on-surface transition-colors data-[selected=true]:bg-surface-variant/50 data-[selected=true]:text-stitch-primary">
                <Home className="w-4 h-4 text-stitch-primary" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item onSelect={() => onSelect(() => navigate('/templates'))} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-surface-variant/50 text-on-surface transition-colors data-[selected=true]:bg-surface-variant/50 data-[selected=true]:text-stitch-primary">
                <LayoutTemplate className="w-4 h-4 text-stitch-primary" />
                <span>Templates</span>
              </Command.Item>
              <Command.Item onSelect={() => onSelect(() => navigate('/profile'))} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-surface-variant/50 text-on-surface transition-colors data-[selected=true]:bg-surface-variant/50 data-[selected=true]:text-stitch-primary">
                <User className="w-4 h-4 text-stitch-primary" />
                <span>Profile</span>
              </Command.Item>
            </Command.Group>
            
            <Command.Group heading="Actions">
              <Command.Item onSelect={() => onSelect(() => navigate('/dashboard'))} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-surface-variant/50 text-on-surface transition-colors data-[selected=true]:bg-surface-variant/50 data-[selected=true]:text-stitch-primary">
                <Plus className="w-4 h-4 text-stitch-primary" />
                <span>Create New Resume</span>
              </Command.Item>
              <Command.Item onSelect={() => onSelect(() => alert('Mock: Theme Changed'))} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-surface-variant/50 text-on-surface transition-colors data-[selected=true]:bg-surface-variant/50 data-[selected=true]:text-stitch-primary">
                <Palette className="w-4 h-4 text-stitch-primary" />
                <span>Change Theme</span>
              </Command.Item>
              <Command.Item onSelect={() => onSelect(() => alert('Mock: Generating Bullets'))} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-surface-variant/50 text-on-surface transition-colors data-[selected=true]:bg-surface-variant/50 data-[selected=true]:text-stitch-primary">
                <Zap className="w-4 h-4 text-stitch-primary" />
                <span>Generate AI Bullets</span>
              </Command.Item>
              <Command.Item onSelect={() => onSelect(() => alert('Mock: Open Settings'))} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer aria-selected:bg-surface-variant/50 text-on-surface transition-colors data-[selected=true]:bg-surface-variant/50 data-[selected=true]:text-stitch-primary">
                <Settings className="w-4 h-4 text-stitch-primary" />
                <span>Settings</span>
              </Command.Item>
            </Command.Group>
            
          </Command.List>
        </Command>
      </div>
      
      <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />
    </div>
  );
}

export default CommandPalette;
