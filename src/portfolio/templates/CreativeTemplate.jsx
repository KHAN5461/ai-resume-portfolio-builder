import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

export default function CreativeTemplate({ portfolioData }) {
  if (!portfolioData) return null;
  const { heroSection, aboutSection, projectsSection, skillsSection, contactSection } = portfolioData;

  const accentColor = portfolioData.siteConfig?.accentColor || '#ec4899'; // Default pink for creative

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-pink-500 selection:text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse" style={{backgroundColor: accentColor}}></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 space-y-32">
        
        {/* Bento Grid Header */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-12 flex flex-col justify-center">
            <p className="text-pink-400 font-mono mb-4 text-lg">Hi, {heroSection?.greeting}</p>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {heroSection?.headline}
            </h1>
            <p className="text-xl text-slate-400 max-w-xl">{heroSection?.subheadline}</p>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
            <h3 className="text-xl font-bold mb-4">{aboutSection?.bioTitle || "About Me"}</h3>
            <p className="text-slate-400 leading-relaxed mb-6">{aboutSection?.bioDescription}</p>
            <div className="flex gap-4">
              {aboutSection?.stats?.slice(0, 2).map((stat, i) => (
                <div key={i} className="flex-1 bg-slate-950 rounded-2xl p-4 border border-slate-800 text-center">
                  <div className="text-2xl font-black text-pink-400 mb-1">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bento Projects */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-black">Featured Projects</h2>
            <div className="h-px bg-slate-800 flex-1 ml-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectsSection?.map((project, i) => (
              <div key={project.id || i} className={`group relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden ${i === 0 ? 'md:col-span-2 h-[500px]' : 'h-[400px]'}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent z-10"></div>
                <img src={project.thumbnailUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'} alt={project.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
                
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  <h3 className="text-3xl font-bold mb-2">{project.title}</h3>
                  <p className="text-slate-300 mb-6 max-w-xl">{project.tagline}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs font-mono bg-slate-800/80 backdrop-blur border border-slate-700 px-3 py-1 rounded-full text-pink-300">{tag}</span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white text-slate-950 px-5 py-2 rounded-full font-bold hover:bg-pink-400 hover:text-white transition-colors">
                        View Live <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Marquee (Simulated with Bento Cards) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
           {skillsSection?.categories?.map((cat, i) => (
             <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 hover:border-pink-500/50 transition-colors">
               <h4 className="text-lg font-bold mb-6 text-pink-400">{cat.categoryName}</h4>
               <ul className="space-y-3">
                 {cat.skills?.map(skill => (
                   <li key={skill} className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div>
                     <span className="text-slate-300 font-medium">{skill}</span>
                   </li>
                 ))}
               </ul>
             </div>
           ))}
        </section>

        {/* Contact Footer */}
        <section className="bg-gradient-to-br from-pink-500/10 to-blue-600/10 border border-slate-800 rounded-3xl p-12 text-center relative overflow-hidden">
           <div className="relative z-10 max-w-2xl mx-auto space-y-8">
             <h2 className="text-5xl font-black">{contactSection?.heading || "Let's Connect"}</h2>
             <p className="text-xl text-slate-400">{contactSection?.subheading}</p>
             
             <a href={`mailto:${contactSection?.email}`} className="inline-flex items-center justify-center bg-white text-slate-950 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(236,72,153,0.3)]">
               Say Hello
             </a>
           </div>
        </section>
      </div>
    </div>
  );
}
