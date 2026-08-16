import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, LayoutTemplate } from 'lucide-react';
import { useUser } from '@/auth.jsx';
import GlobalApi from './../../../../service/GlobalApi';

const INSPIRATION_CHIPS = [
  "Minimalist Full-Stack Dev — Bento Grid, Light Mode",
  "Dark-mode Cyberpunk UI/UX Designer",
  "Creative Agency Portfolio — Editorial, Serif Typography",
  "Data Scientist — Clean Charts, Academic Layout",
  "Mobile Developer — App Showcase, Device Frames",
  "Freelancer — Services Grid, Testimonials, CTA"
];

export default function AIPromptStudio() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);

    try {
      const portfolioTitle = prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '');

      const response = await GlobalApi.CreateNewPortfolio({
        data: {
          title: portfolioTitle,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userName: user?.fullName
        }
      });

      const newId = response?.data?.data?.documentId || response?.data?.id;

      navigate(`/dashboard/portfolio/${newId}/edit?generating=true`, {
        state: { prompt }
      });
    } catch (err) {
      console.error("Failed to initialize portfolio from AI prompt:", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl space-y-8 text-center relative z-10">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 shadow-sm">
          <Sparkles size={14} /> AI Portfolio Architect
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          What do you want to build?
        </h1>

        {/* Prompt Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl focus-within:border-indigo-500 transition-all text-left">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
            placeholder="Describe your tech stack, layout preference, and aesthetic vibe..."
            className="w-full h-36 bg-transparent text-slate-100 placeholder-slate-500 outline-none resize-none text-sm leading-relaxed"
          />
          <div className="flex justify-between items-center pt-3 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-500 font-mono">
              {prompt.length} / 500 characters
            </span>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? 'Initializing...' : <>Generate Portfolio <ArrowRight size={14} /></>}
            </button>
          </div>
        </div>

        {/* Inspiration Chips */}
        <div className="space-y-3 text-left">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <LayoutTemplate size={13} /> Or pick a starting concept:
          </p>
          <div className="flex flex-wrap gap-2">
            {INSPIRATION_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(chip)}
                className="text-xs bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 px-3 py-2 rounded-xl transition-all text-left cursor-pointer"
              >
                ✨ {chip}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
