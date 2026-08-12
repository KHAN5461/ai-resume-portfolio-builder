import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, AlertTriangle, CheckCircle, LoaderCircle } from 'lucide-react';
import { AIChatSession } from './../../../../service/AIModal';
import { useSelector } from 'react-redux';

const ATS_PROMPT = `Act as a strict Applicant Tracking System (ATS) and an elite Tech Recruiter.
I am providing you with a JSON representation of my resume.
Evaluate it ruthlessly for:
1. Missing quantifiable metrics (did they use numbers?).
2. Weak action verbs.
3. Keyword density and buzzwords.
4. Overall impact.

Return an HTML formatted response with exactly this structure (use Tailwind classes for styling):
<div class="space-y-4">
  <div class="p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
    <h3 class="font-bold flex items-center gap-2"><span class="material-symbols-outlined">warning</span> Critical Flaws</h3>
    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li>...</li>
    </ul>
  </div>
  <div class="p-3 bg-green-50 text-green-700 rounded-lg border border-green-100">
    <h3 class="font-bold flex items-center gap-2"><span class="material-symbols-outlined">build</span> Actionable Fixes</h3>
    <ul class="list-disc pl-5 mt-2 space-y-1">
      <li>...</li>
    </ul>
  </div>
</div>

Do NOT include any markdown code blocks (\`\`\`html) in your response, just the raw HTML.
Here is the Resume JSON:
{resumeJson}
`;

export const AtsRoastPanel = ({ isOpen, onClose }) => {
  const resumeInfo = useSelector(state => state.resume.resumeData);
  const [loading, setLoading] = useState(false);
  const [roastHtml, setRoastHtml] = useState(null);

  const generateRoast = async () => {
    setLoading(true);
    setRoastHtml(null);
    try {
      const prompt = ATS_PROMPT.replace('{resumeJson}', JSON.stringify(resumeInfo));
      const result = await AIChatSession.sendMessage(prompt);
      let html = result.response.text();
      html = html.replace(/```html/g, '').replace(/```/g, '').trim();
      setRoastHtml(html);
    } catch (e) {
      console.error(e);
      setRoastHtml('<div class="text-red-500">Failed to generate ATS evaluation.</div>');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          {/* Side Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-[400px] h-full bg-surface shadow-2xl z-50 border-l border-outline-variant/30 flex flex-col"
          >
            <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2 text-stitch-primary">
                <Bot size={24} />
                <h2 className="font-headline-sm font-bold">ATS Copilot</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface-variant/50 rounded-full transition-colors">
                <X size={20} className="text-on-surface-variant" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                Our AI Copilot simulates a strict ATS system. Have it scan your resume to find missing metrics, weak verbs, and formatting red flags before you apply.
              </p>

              {!roastHtml && !loading && (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle size={32} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Ready for a reality check?</h3>
                  <button
                    onClick={generateRoast}
                    className="mt-4 px-6 py-2 bg-stitch-primary text-white rounded-full hover:bg-stitch-primary/90 hover:scale-105 transition-all shadow-md flex items-center gap-2"
                  >
                    <Bot size={18} />
                    Run ATS Scan
                  </button>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-stitch-primary">
                  <LoaderCircle size={40} className="animate-spin mb-4" />
                  <p className="font-medium animate-pulse">Scanning resume structure...</p>
                </div>
              )}

              {roastHtml && !loading && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div dangerouslySetInnerHTML={{ __html: roastHtml }} />
                  <button
                    onClick={generateRoast}
                    className="w-full mt-6 px-4 py-2 border border-outline-variant rounded-lg text-sm hover:bg-surface-variant/30 transition-colors text-on-surface-variant flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    Scan Again
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
