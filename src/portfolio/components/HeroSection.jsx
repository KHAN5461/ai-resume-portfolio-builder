import React from 'react';

export default function HeroSection({ data }) {
  if (!data) return null;

  return (
    <section className="min-h-[80vh] flex items-center justify-center text-center py-24 px-8 bg-gradient-to-br from-[#5A8DEE] to-[#3366BB] text-white">
      <div className="max-w-6xl mx-auto">
        {/* We can use the Space Grotesk font by adding the font-['Space_Grotesk'] utility if loaded, or just sans-serif */}
        <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold mb-4 leading-[1.1] font-['Space_Grotesk',sans-serif]">
          {data.headline || "Building Digital Experiences"}
        </h1>
        
        <p className="text-[clamp(1rem,2vw,1.25rem)] mb-8 opacity-90 mx-auto max-w-[600px]">
          {data.subheadline || "A passionate developer creating modern and responsive web applications. Welcome to my creative space."}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {data.primaryCta && (
            <a 
              href={data.primaryCta.link || "#projects"} 
              className="inline-block bg-white text-[#3366BB] px-[30px] py-[12px] rounded-full no-underline font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
            >
              {data.primaryCta.text || "View My Work"}
            </a>
          )}
          {data.secondaryCta && (
            <a 
              href={data.secondaryCta.link || "#"} 
              className="inline-block bg-transparent border-2 border-white text-white px-[30px] py-[12px] rounded-full no-underline font-bold transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
            >
              {data.secondaryCta.text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
