import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addBlock,
  removeBlock,
  moveBlockUp,
  moveBlockDown,
  updateHeroSection,
  updateAboutSection,
  updatePortfolioData,
} from '@/store/portfolioSlice';
import { AIChatSession } from '@/service/AIModal';
import { Sparkles, User, Loader2, Zap, Palette, Layout, Type, FileText, Wand2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AIPortfolioChat = ({ portfolioId }) => {
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.present?.portfolios?.[portfolioId] || state.portfolio.portfolios?.[portfolioId]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: "Hey! 👋 I'm **Sparkfolio AI** — your intelligent portfolio architect.\n\nI can **generate content**, **add/remove sections**, **change themes**, **write your bio**, **craft project descriptions**, and much more.\n\nTry the quick actions below, or just tell me what you need!"
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ── Intent Engine ───────────────────────────────────────────────
  const processIntent = async (userText) => {
    const lower = userText.toLowerCase();

    // ── Section Management ──────────────────────────────────────
    const sectionTypes = ['hero', 'about', 'projects', 'skills', 'contact', 'experience', 'education', 'testimonials', 'blog', 'gallery', 'faq', 'services', 'stats', 'timeline', 'community'];

    // ADD SECTION
    if (lower.match(/\b(add|create|insert|include|new)\b.*\b(section|block|area|part)\b/) || sectionTypes.some(s => lower.match(new RegExp(`\\b(add|create|insert)\\b.*\\b${s}\\b`)))) {
      const found = sectionTypes.find(s => lower.includes(s));
      if (found) {
        dispatch(addBlock({ portfolioId, blockType: found, blockName: found.charAt(0).toUpperCase() + found.slice(1) }));
        return `✅ Added a **${found.charAt(0).toUpperCase() + found.slice(1)}** section to your portfolio!`;
      }
    }

    // REMOVE SECTION
    if (lower.match(/\b(remove|delete|drop|hide)\b/)) {
      const found = sectionTypes.find(s => lower.includes(s));
      if (found) {
        const layout = portfolioData?.siteConfig?.layout || [];
        const block = layout.find(b => b.type === found);
        if (block) {
          dispatch(removeBlock({ portfolioId, blockId: block.id }));
          return `🗑️ Removed the **${found}** section.`;
        }
        return `Couldn't find a **${found}** section to remove.`;
      }
    }

    // MOVE SECTION
    if (lower.match(/\b(move|reorder|shift)\b.*\b(up|higher|above)\b/)) {
      const found = sectionTypes.find(s => lower.includes(s));
      if (found) {
        const layout = portfolioData?.siteConfig?.layout || [];
        const block = layout.find(b => b.type === found);
        if (block) {
          dispatch(moveBlockUp({ portfolioId, blockId: block.id }));
          return `⬆️ Moved **${found}** up.`;
        }
      }
    }
    if (lower.match(/\b(move|reorder|shift)\b.*\b(down|lower|below)\b/)) {
      const found = sectionTypes.find(s => lower.includes(s));
      if (found) {
        const layout = portfolioData?.siteConfig?.layout || [];
        const block = layout.find(b => b.type === found);
        if (block) {
          dispatch(moveBlockDown({ portfolioId, blockId: block.id }));
          return `⬇️ Moved **${found}** down.`;
        }
      }
    }

    // ── Theme & Color ───────────────────────────────────────────
    if (lower.match(/\b(dark\s*mode|dark\s*theme|night\s*mode)\b/)) {
      dispatch(updatePortfolioData({
        id: portfolioId,
        data: { siteConfig: { ...portfolioData?.siteConfig, themeMode: 'dark' } }
      }));
      return "🌙 Switched to **dark mode**!";
    }
    if (lower.match(/\b(light\s*mode|light\s*theme|day\s*mode)\b/)) {
      dispatch(updatePortfolioData({
        id: portfolioId,
        data: { siteConfig: { ...portfolioData?.siteConfig, themeMode: 'light' } }
      }));
      return "☀️ Switched to **light mode**!";
    }

    const colorPatterns = {
      blue: '#3b82f6', red: '#ef4444', green: '#22c55e', purple: '#8b5cf6',
      orange: '#f97316', pink: '#ec4899', teal: '#14b8a6', yellow: '#eab308',
      indigo: '#6366f1', cyan: '#06b6d4', rose: '#f43f5e', emerald: '#10b981',
    };
    if (lower.match(/\b(change|set|switch|make)\b.*\b(color|accent|theme color|primary)\b/)) {
      const colorName = Object.keys(colorPatterns).find(c => lower.includes(c));
      if (colorName) {
        dispatch(updatePortfolioData({
          id: portfolioId,
          data: { siteConfig: { ...portfolioData?.siteConfig, accentColor: colorPatterns[colorName] } }
        }));
        return `🎨 Accent color changed to **${colorName}** (${colorPatterns[colorName]})!`;
      }
    }

    // ── Template Switch ─────────────────────────────────────────
    const templates = ['default', 'developer', 'designer', 'minimal', 'bold', 'magazine'];
    if (lower.match(/\b(switch|change|use|apply)\b.*\b(template|layout|style|design)\b/)) {
      const tmpl = templates.find(t => lower.includes(t));
      if (tmpl) {
        dispatch(updatePortfolioData({
          id: portfolioId,
          data: { siteConfig: { ...portfolioData?.siteConfig, themePreset: tmpl } }
        }));
        return `🎭 Switched to the **${tmpl}** template!`;
      }
    }

    // ── Quick Content Updates (no AI needed) ────────────────────
    if (lower.match(/\b(set|change|update)\b.*\b(title|name|headline)\b.*\bto\b/i)) {
      const match = userText.match(/to\s+["""]?(.+?)["""]?\s*$/i);
      if (match) {
        dispatch(updateHeroSection({ id: portfolioId, data: { headline: match[1].trim() } }));
        return `✏️ Updated your headline to: **"${match[1].trim()}"**`;
      }
    }
    if (lower.match(/\b(set|change|update)\b.*\b(greeting)\b.*\bto\b/i)) {
      const match = userText.match(/to\s+["""]?(.+?)["""]?\s*$/i);
      if (match) {
        dispatch(updateHeroSection({ id: portfolioId, data: { greeting: match[1].trim() } }));
        return `👋 Updated your greeting to: **"${match[1].trim()}"**`;
      }
    }

    // ── List Sections ───────────────────────────────────────────
    if (lower.match(/\b(list|show|what)\b.*\b(sections?|blocks?|layout)\b/)) {
      const layout = portfolioData?.siteConfig?.layout || [];
      if (layout.length === 0) return "Your portfolio is empty! Ask me to add some sections.";
      const list = layout.map((b, i) => `${i + 1}. **${b.name}** (${b.type}) ${b.visible ? '✅' : '👁️‍🗨️ hidden'}`).join('\n');
      return `📋 Your current sections:\n\n${list}`;
    }

    // ── AI-Powered Content Generation ───────────────────────────
    // These require calling the real Gemini API
    if (lower.match(/\b(write|generate|create|craft|build)\b.*\b(bio|about|biography|introduction|intro)\b/)) {
      return await generateWithAI(
        `Write a compelling, professional 2-paragraph biography for a portfolio. Current data: ${JSON.stringify(portfolioData?.aboutSection || {})}. Make it conversational and engaging. Return ONLY the bio text, no JSON.`,
        (text) => {
          dispatch(updateAboutSection({ id: portfolioId, data: { bioTitle: 'About Me', bioDescription: text } }));
        },
        "✍️ Generated a new bio for your About section!"
      );
    }

    if (lower.match(/\b(write|generate|create|craft)\b.*\b(headline|tagline|title|hero)\b/)) {
      return await generateWithAI(
        `Write a punchy, professional 3-6 word headline for a portfolio hero section. Current name: ${portfolioData?.heroSection?.greeting || 'Unknown'}. Return ONLY the headline text, nothing else.`,
        (text) => {
          dispatch(updateHeroSection({ id: portfolioId, data: { headline: text.replace(/"/g, '').trim() } }));
        },
        "🚀 Generated a new hero headline!"
      );
    }

    if (lower.match(/\b(write|generate|create|craft)\b.*\b(subheadline|subtitle|description|tagline|value\s*prop)\b/)) {
      return await generateWithAI(
        `Write a compelling 1-2 sentence value proposition/subheadline for a portfolio. Current headline: "${portfolioData?.heroSection?.headline || ''}". Return ONLY the subheadline text.`,
        (text) => {
          dispatch(updateHeroSection({ id: portfolioId, data: { subheadline: text.replace(/"/g, '').trim() } }));
        },
        "💬 Generated a new subheadline!"
      );
    }

    if (lower.match(/\b(generate|create|build|fill|populate)\b.*\b(full|entire|complete|whole|everything|all|portfolio)\b/)) {
      return await generateFullPortfolio();
    }

    if (lower.match(/\b(improve|enhance|refine|polish|rewrite|make.*better)\b/)) {
      const target = lower.includes('hero') ? 'hero' : lower.includes('about') ? 'about' : lower.includes('bio') ? 'about' : null;
      if (target === 'hero') {
        return await generateWithAI(
          `Improve this portfolio hero section. Make it more punchy and professional. Current: ${JSON.stringify(portfolioData?.heroSection || {})}. Return JSON: {"greeting":"...","headline":"...","subheadline":"..."}`,
          (text) => {
            try {
              const data = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
              dispatch(updateHeroSection({ id: portfolioId, data }));
            } catch { /* fallback */ }
          },
          "✨ Improved your hero section!"
        );
      }
      if (target === 'about') {
        return await generateWithAI(
          `Improve and rewrite this portfolio bio to be more engaging and professional. Current: "${portfolioData?.aboutSection?.bioDescription || ''}". Return ONLY the improved bio text.`,
          (text) => {
            dispatch(updateAboutSection({ id: portfolioId, data: { bioDescription: text } }));
          },
          "✨ Improved your About section!"
        );
      }
      return await generateWithAI(
        `Improve this portfolio data. Make all text more professional and compelling. Current: ${JSON.stringify({ hero: portfolioData?.heroSection, about: portfolioData?.aboutSection })}. Return JSON with improved heroSection and aboutSection.`,
        (text) => {
          try {
            const data = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
            if (data.heroSection) dispatch(updateHeroSection({ id: portfolioId, data: data.heroSection }));
            if (data.aboutSection) dispatch(updateAboutSection({ id: portfolioId, data: data.aboutSection }));
          } catch { /* fallback */ }
        },
        "✨ Improved your portfolio content!"
      );
    }

    // ── Help ─────────────────────────────────────────────────────
    if (lower.match(/\b(help|what can you|commands?|how to|guide)\b/)) {
      return `🧠 Here's everything I can do:\n\n**📦 Sections**\n• "Add a projects section"\n• "Remove the contact section"\n• "Move skills up"\n• "List my sections"\n\n**🎨 Theming**\n• "Switch to dark mode"\n• "Change color to purple"\n• "Use the magazine template"\n\n**✍️ AI Content**\n• "Write my bio"\n• "Generate a headline"\n• "Create a subheadline"\n• "Generate full portfolio"\n• "Improve my hero section"\n\n**✏️ Quick Edits**\n• "Set headline to Creative Developer"\n• "Set greeting to Hi, I'm Alex"`;
    }

    // ── Fallback: Send to Gemini for free-form response ─────────
    return await generateWithAI(
      `You are Sparkfolio AI, a friendly portfolio design assistant. The user said: "${userText}". Their current portfolio has these sections: ${JSON.stringify(portfolioData?.siteConfig?.layout?.map(b => b.name) || [])}. Give a brief, helpful response (2-3 sentences max). If they seem to want something specific, suggest the right command.`,
      null,
      null
    );
  };

  // ── Gemini AI Helper ────────────────────────────────────────────
  const generateWithAI = async (prompt, onSuccess, successMessage) => {
    try {
      const result = await AIChatSession.sendMessage(prompt);
      const text = result.response.text();
      if (onSuccess) onSuccess(text);
      return successMessage || text;
    } catch (error) {
      console.error('AI generation failed:', error);
      return "⚠️ AI generation failed. Please make sure you're logged in and try again.";
    }
  };

  // ── Generate Full Portfolio ─────────────────────────────────────
  const generateFullPortfolio = async () => {
    try {
      const result = await AIChatSession.sendMessage(`
        You are an expert portfolio architect. Generate a complete, professional portfolio data payload.
        Return ONLY valid JSON matching this structure:
        {
          "heroSection": { "greeting": "Hi, I'm [Name]", "headline": "3-5 word title", "subheadline": "1-2 sentence value prop" },
          "aboutSection": { "bioTitle": "About Me", "bioDescription": "2-3 paragraph bio" },
          "skillsSection": { "categories": [{ "categoryName": "Category", "skills": ["Skill1", "Skill2"] }] },
          "contactSection": { "heading": "Get In Touch", "subheading": "Friendly invitation", "email": "hello@example.com" }
        }
      `);
      const rawText = result.response.text();
      const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
      dispatch(updatePortfolioData({ id: portfolioId, data: parsed }));
      return "🎉 Generated a **complete portfolio** with hero, about, skills, and contact sections! Check it out on the canvas →";
    } catch (error) {
      console.error('Full portfolio generation failed:', error);
      return "⚠️ Failed to generate full portfolio. Please try again.";
    }
  };

  // ── Send Handler ───────────────────────────────────────────────
  const handleSend = async (text) => {
    const userText = text || input;
    if (!userText.trim() || isLoading) return;

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await processIntent(userText);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: aiResponse }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: "⚠️ Something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    { icon: <Wand2 className="w-3.5 h-3.5" />, label: "Generate full portfolio" },
    { icon: <Type className="w-3.5 h-3.5" />, label: "Write my bio" },
    { icon: <Zap className="w-3.5 h-3.5" />, label: "Generate a headline" },
    { icon: <Layout className="w-3.5 h-3.5" />, label: "Add a projects section" },
    { icon: <Palette className="w-3.5 h-3.5" />, label: "Switch to dark mode" },
    { icon: <FileText className="w-3.5 h-3.5" />, label: "List my sections" },
    { icon: <RotateCcw className="w-3.5 h-3.5" />, label: "Improve my hero" },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-surface to-surface-container-lowest border-r border-outline-variant/20 shadow-sm relative z-10">
      {/* Header */}
      <div className="p-5 border-b border-outline-variant/20 flex items-center gap-3 bg-surface/50 backdrop-blur-md sticky top-0 z-20">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stitch-primary to-stitch-secondary flex items-center justify-center shadow-sm">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="font-headline-sm font-bold text-on-surface leading-tight">Sparkfolio AI</h2>
          <p className="text-[11px] font-medium text-on-surface-variant/70 uppercase tracking-wider">
            {isLoading ? '● Thinking...' : 'Design Assistant'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-surface border border-outline-variant/30' : 'bg-gradient-to-br from-stitch-primary to-stitch-secondary'}`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-on-surface-variant" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`px-4 py-3 rounded-2xl max-w-[85%] shadow-sm ${msg.role === 'user' ? 'bg-surface border border-outline-variant/20 text-on-surface rounded-tr-sm' : 'bg-surface-container text-on-surface rounded-tl-sm'}`}>
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{
                  msg.text.split(/(\*\*.*?\*\*)/).map((part, i) =>
                    part.startsWith('**') && part.endsWith('**')
                      ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
                      : part
                  )
                }</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-stitch-primary to-stitch-secondary shadow-sm">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-surface-container rounded-tl-sm shadow-sm">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 rounded-full bg-on-surface-variant/40 animate-bounce [animation-delay:0ms]" />
                <div className="w-2 h-2 rounded-full bg-on-surface-variant/40 animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 rounded-full bg-on-surface-variant/40 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface/80 backdrop-blur-md border-t border-outline-variant/20 shrink-0">
        {/* Quick Suggestions */}
        <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar no-scrollbar">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s.label)}
              disabled={isLoading}
              className="whitespace-nowrap px-3 py-1.5 rounded-full border border-outline-variant/30 bg-surface hover:bg-surface-container hover:border-stitch-primary/30 text-[12px] font-medium text-on-surface-variant transition-all hover:-translate-y-0.5 shadow-sm flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="relative flex items-center bg-surface rounded-2xl border border-outline-variant/30 focus-within:border-stitch-primary focus-within:ring-2 focus-within:ring-stitch-primary/20 overflow-hidden shadow-sm transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? 'AI is thinking...' : 'Describe what you want to build...'}
            disabled={isLoading}
            className="w-full bg-transparent border-none focus:ring-0 resize-none py-3.5 pl-4 pr-14 text-[14px] text-on-surface max-h-32 min-h-[52px] placeholder:text-on-surface-variant/50 disabled:opacity-50"
            rows={1}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-1.5 p-2.5 rounded-xl bg-stitch-primary text-white hover:bg-stitch-primary/90 disabled:bg-surface-variant disabled:text-on-surface-variant/30 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPortfolioChat;
