import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, LayoutTemplate, ArrowLeft } from 'lucide-react';
import { useUser } from '@/auth.jsx';
import GlobalApi from '../../../service/GlobalApi';
import { RolePrompts } from '../../../lib/rolePrompts';

export default function AIPromptStudio() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [seniority, setSeniority] = useState('');
  const [skills, setSkills] = useState('');
  const [visualVibe, setVisualVibe] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const prompt = `Role: ${role}\nSeniority: ${seniority}\nCore Skills: ${skills}\nVisual Vibe: ${visualVibe}`;
      const portfolioTitle = `${seniority} ${role} Portfolio`;

      const response = await GlobalApi.CreateNewPortfolio({
        data: {
          title: portfolioTitle.slice(0, 50),
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userName: user?.fullName
        }
      });

      const newId = response?.data?.data?.documentId || response?.data?.id;

      const result = await AIChatSession.sendMessage(prompt, 'portfolio');
      const responseText = await result.response.text();
      const parsedData = JSON.parse(responseText.replace(/```json|```/g, '').trim());
      
      const basePrompt = RolePrompts[role] ? RolePrompts[role] : '';
      const finalPrompt = basePrompt 
        ? `${basePrompt}\n\nCreative Brief: ${prompt}`
        : prompt;

      navigate(`/dashboard/portfolio/${newId}/edit?generating=true`, {
        state: { prompt: finalPrompt }
      });
    } catch (err) {
      console.error("Failed to initialize portfolio from AI prompt:", err);
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl space-y-8 text-center relative z-10">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 shadow-sm">
          <Sparkles size={14} /> AI Portfolio Architect - Step {step} of 3
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          {step === 1 && "What's your role?"}
          {step === 2 && "What are your core skills?"}
          {step === 3 && "What's your visual vibe?"}
        </h1>

        {/* Form Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl transition-all text-left space-y-6">
          
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-3">Role</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(RolePrompts).concat(['Full-Stack Dev', 'Data Scientist']).map(r => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`text-xs px-4 py-2 rounded-full font-medium transition-all shadow-sm cursor-pointer ${
                        role === r 
                          ? 'bg-indigo-600 text-white border border-indigo-500' 
                          : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                  <input 
                    type="text" 
                    placeholder="Other role..." 
                    value={Object.keys(RolePrompts).concat(['Full-Stack Dev', 'Data Scientist']).includes(role) ? '' : role}
                    onChange={(e) => setRole(e.target.value)}
                    className="text-xs px-4 py-2 rounded-full font-medium bg-slate-800 border border-slate-700 text-slate-300 placeholder-slate-500 outline-none focus:border-indigo-500 min-w-[120px]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-3">Seniority</label>
                <div className="flex flex-wrap gap-2">
                  {['Junior', 'Mid-Level', 'Senior', 'Lead', 'Principal'].map(s => (
                    <button
                      key={s}
                      onClick={() => setSeniority(s)}
                      className={`text-xs px-4 py-2 rounded-full font-medium transition-all shadow-sm cursor-pointer ${
                        seniority === s 
                          ? 'bg-indigo-600 text-white border border-indigo-500' 
                          : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">Core Skills (comma separated)</label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. React, Node.js, User Research, Wireframing..."
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 resize-none text-sm"
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">Visual Vibe & Aesthetic</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  "Minimalist, Light Mode",
                  "Dark-mode Cyberpunk",
                  "Editorial, Serif Typography",
                  "Clean Academic Layout",
                  "Vibrant & Playful"
                ].map(vibe => (
                  <button
                    key={vibe}
                    onClick={() => setVisualVibe(vibe)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all shadow-sm cursor-pointer ${
                      visualVibe === vibe 
                        ? 'bg-indigo-600 text-white border border-indigo-500' 
                        : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
              <textarea
                value={visualVibe}
                onChange={(e) => setVisualVibe(e.target.value)}
                placeholder="Or describe your own vibe..."
                className="w-full h-24 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 resize-none text-sm"
              />
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-slate-800/80">
            <button
              onClick={prevStep}
              disabled={step === 1 || loading}
              className={`px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-2 cursor-pointer transition-colors ${step === 1 ? 'invisible' : ''}`}
            >
              <ArrowLeft size={14} /> Back
            </button>
            
            {step < 3 ? (
              <button
                onClick={nextStep}
                disabled={(step === 1 && (!role || !seniority)) || (step === 2 && !skills.trim())}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                Next Step <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!visualVibe.trim() || loading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? 'Initializing...' : <>Generate Portfolio <Sparkles size={14} /></>}
              </button>
            )}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-indigo-500' : 
                i < step ? 'w-2 bg-indigo-500/50' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

