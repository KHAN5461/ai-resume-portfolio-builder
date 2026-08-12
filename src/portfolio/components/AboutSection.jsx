import React from 'react';

export default function AboutSection({ data }) {
  if (!data) return null;

  return (
    <section className="py-[clamp(2rem,6vw,4rem)] px-8 max-w-[1200px] mx-auto">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
        <span className="text-[#3366BB] font-['Space_Grotesk',sans-serif] text-xl">01.</span>
        <span className="text-[#2c3e50] font-['Space_Grotesk',sans-serif]">{data.bioTitle || "About Me"}</span>
        <div className="flex-grow h-px bg-gray-300 ml-4" />
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="text-[#555] font-['Inter',sans-serif] leading-relaxed space-y-4 text-lg">
          {data.bioDescription?.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
        
        {data.stats && data.stats.length > 0 && (
          <div className="grid grid-cols-2 gap-6">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-[#3366BB] mb-2 font-['Space_Grotesk',sans-serif]">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
