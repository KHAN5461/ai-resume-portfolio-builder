import React from 'react';

export default function AboutSection({ data }) {
  if (!data) return null;

  return (
    <section className="relative">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
        <span className="text-stitch-primary font-headline-md text-xl">01.</span>
        <span className="text-on-surface">{data.bioTitle || "About Me"}</span>
        <div className="flex-grow h-px bg-outline-variant/30 ml-4" />
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="text-on-surface-variant font-body-lg leading-relaxed space-y-4 text-lg">
          {data.bioDescription?.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
        
        {data.stats && data.stats.length > 0 && (
          <div className="grid grid-cols-2 gap-6">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:shadow-sm transition-shadow">
                <div className="font-headline-xl text-stitch-primary mb-2">{stat.value}</div>
                <div className="font-label-sm text-on-surface-variant uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
