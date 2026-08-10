import React from 'react';

export default function HeroSection({ data }) {
  if (!data) return null;

  return (
    <section className="relative pt-20 pb-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-container/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-start gap-6 max-w-3xl">
        <span className="text-stitch-primary font-label-md tracking-wider uppercase">
          {data.greeting || "Hello World"}
        </span>
        
        <h1 className="font-headline-xl text-[56px] leading-[1.1] text-on-surface">
          {data.headline || "I build things for the web."}
        </h1>
        
        <p className="font-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
          {data.subheadline}
        </p>
        
        <div className="flex gap-4 mt-4">
          {data.primaryCta && (
            <a 
              href={data.primaryCta.link || "#"} 
              className="px-6 py-3 bg-stitch-primary text-on-primary font-label-md rounded-full hover:bg-stitch-primary/90 transition-colors"
            >
              {data.primaryCta.text}
            </a>
          )}
          {data.secondaryCta && (
            <a 
              href={data.secondaryCta.link || "#"} 
              className="px-6 py-3 bg-surface text-on-surface font-label-md rounded-full hover:bg-surface-variant transition-colors border border-outline-variant/30"
            >
              {data.secondaryCta.text}
            </a>
          )}
        </div>

        {data.terminalCodeSnippet && (
          <div className="mt-10 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 font-label-sm text-on-surface w-full shadow-sm">
            <div className="flex gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <code>{data.terminalCodeSnippet}</code>
          </div>
        )}
      </div>
    </section>
  );
}
