import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';

export default function MagazineTemplate({ portfolioData }) {
  if (!portfolioData) return null;
  const { 
    heroSection = {}, 
    aboutSection = {}, 
    projectsSection = [], 
    skillsSection = {},
    contactSection = {} 
  } = portfolioData;

  const flatSkills = skillsSection?.categories?.flatMap(c => c.skills) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-900 font-sans antialiased selection:bg-[var(--accent)] selection:text-white">
      {/* 
        Editorial Design Language:
        - Asymmetric grids
        - Edge-to-edge structural blocks
        - Large, tracked-tight typography
      */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full"
      >
        {/* HERO SECTION - Asymmetric 2-column layout */}
        <section id="hero" className="w-full grid grid-cols-1 md:grid-cols-12 min-h-[90vh] md:min-h-screen">
          <motion.div variants={itemVariants} className="md:col-span-7 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20 bg-white relative z-10 border-r border-slate-200 shadow-[20px_0_40px_-15px_rgba(0,0,0,0.05)]">
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] mb-8 text-slate-900">
              {heroSection.greeting?.split(' ')[0] || "Hello"}
              <span className="block text-[var(--accent)]">{heroSection.greeting?.split(' ').slice(1).join(' ') || "World."}</span>
            </h1>
            <p className="text-2xl md:text-4xl font-light text-slate-600 tracking-tight leading-tight max-w-2xl mb-8">
              {heroSection.headline || 'Creative Designer & Developer.'}
            </p>
            <p className="text-lg md:text-xl text-slate-500 font-serif italic max-w-lg mb-12">
              {heroSection.subheadline || 'Crafting digital experiences that merge function with editorial beauty.'}
            </p>
            <div className="flex gap-6 mt-auto">
              {contactSection.email && (
                <a href={`mailto:${contactSection.email}`} className="text-sm font-bold uppercase tracking-widest border-b-2 border-slate-900 pb-1 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors">
                  Contact Me
                </a>
              )}
              <a href="#projects" className="text-sm font-bold uppercase tracking-widest border-b-2 border-slate-900 pb-1 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors">
                View Work
              </a>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="md:col-span-5 bg-slate-100 relative overflow-hidden h-[50vh] md:h-auto">
             <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300"></div>
             {/* Abstract placeholder for edge-to-edge image */}
             <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070')] bg-cover bg-center"></div>
             
             {/* Big bold overlapping text */}
             <div className="absolute top-1/4 -left-16 transform -rotate-90 hidden md:block mix-blend-difference text-white/20 text-9xl font-black whitespace-nowrap z-20 select-none">
                {aboutSection.bioTitle || "PORTFOLIO"}
             </div>
          </motion.div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-24 px-8 md:px-16 lg:px-24 bg-slate-900 text-white relative">
          <motion.div variants={itemVariants} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative">
            <div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-none">
                {aboutSection.bioTitle || "The"} <br/> 
                <span className="text-slate-400 font-serif italic">{aboutSection.bioTitle ? "Story" : "Author"}</span>
              </h2>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xl md:text-2xl font-light leading-relaxed text-slate-300 border-l-4 border-[var(--accent)] pl-8">
                {aboutSection.bioDescription || "I am a multi-disciplinary creator focused on bridging the gap between elegant design and robust engineering."}
              </p>
            </div>
            {/* Overlapping decorative element */}
            <div className="absolute -top-32 -right-12 text-[15rem] font-black text-white/5 select-none pointer-events-none hidden lg:block">
              "
            </div>
          </motion.div>
        </section>

        {/* PROJECTS SECTION - Editorial Grid */}
        {projectsSection.length > 0 && (
          <section id="projects" className="py-32 bg-[#faf9f6]">
            <motion.div variants={itemVariants} className="px-8 md:px-16 lg:px-24 mb-20">
               <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-4">Selected Work</h2>
               <div className="w-24 h-2 bg-[var(--accent)]"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 md:gap-y-32">
               {projectsSection.map((project, idx) => {
                 // Alternate alignment for asymmetric editorial feel
                 const isEven = idx % 2 === 0;
                 return (
                   <motion.div variants={itemVariants} key={idx} className={`col-span-1 md:col-span-10 ${isEven ? 'md:col-start-2' : 'md:col-start-3'} group`}>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                         <div className={`md:col-span-8 ${isEven ? 'order-1' : 'order-1 md:order-2'} relative overflow-hidden bg-slate-200 aspect-[4/3]`}>
                            {project.thumbnailUrl ? (
                              <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out grayscale group-hover:grayscale-0" />
                            ) : (
                              <div className="w-full h-full bg-slate-200 group-hover:bg-slate-300 transition-colors"></div>
                            )}
                         </div>
                         <div className={`md:col-span-4 ${isEven ? 'order-2 md:-ml-16 md:mt-32' : 'order-2 md:order-1 md:-mr-16 md:-mt-32'} relative z-20 bg-white p-8 shadow-xl border border-slate-100`}>
                            <div className="text-sm font-bold tracking-widest text-[var(--accent)] mb-4 uppercase">{idx < 9 ? `0${idx+1}` : idx+1}</div>
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{project.title}</h3>
                            <p className="text-slate-600 mb-8 font-serif italic text-lg leading-relaxed">{project.description || project.tagline}</p>
                            {project.liveUrl && (
                              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[var(--accent)] transition-colors">
                                Explore <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                         </div>
                      </div>
                   </motion.div>
                 );
               })}
            </div>
          </section>
        )}

        {/* SKILLS SECTION */}
        {flatSkills.length > 0 && (
          <section id="skills" className="py-24 px-8 md:px-16 lg:px-24 bg-white border-y border-slate-200">
             <motion.div variants={itemVariants} className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-start">
                <div className="md:w-1/3">
                   <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6">Expertise</h2>
                   <p className="text-slate-500 font-serif italic">Tools of the trade and technical competencies.</p>
                </div>
                <div className="md:w-2/3 flex flex-wrap gap-4">
                   {flatSkills.map((skill, idx) => (
                      <span key={idx} className="text-xl md:text-3xl font-light tracking-tight text-slate-800 border-b border-transparent hover:border-slate-800 transition-colors cursor-default">
                         {skill}{idx < flatSkills.length - 1 ? <span className="text-slate-300 mx-2">/</span> : ''}
                      </span>
                   ))}
                </div>
             </motion.div>
          </section>
        )}

        {/* CONTACT SECTION */}
        <section id="contact" className="py-32 px-8 md:px-16 lg:px-24 bg-slate-900 text-white flex flex-col items-center text-center">
           <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">
                 {contactSection.heading || "Let's"} <br/>
                 <span className="text-[var(--accent)] italic font-serif lowercase tracking-normal">Collaborate</span>
              </h2>
              {contactSection.subheading && (
                 <p className="text-xl md:text-2xl font-light text-slate-400 mb-12 max-w-2xl mx-auto">
                   {contactSection.subheading}
                 </p>
              )}
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
                 {contactSection.email && (
                   <a href={`mailto:${contactSection.email}`} className="text-2xl md:text-4xl font-medium hover:text-[var(--accent)] transition-colors border-b-2 border-transparent hover:border-[var(--accent)] pb-2">
                     {contactSection.email}
                   </a>
                 )}
              </div>

              <div className="flex items-center justify-center gap-8 mt-12 pt-12 border-t border-slate-800 w-full">
                <a href="#" className="hover:text-[var(--accent)] transition-colors"><Github className="w-6 h-6" /></a>
                <a href="#" className="hover:text-[var(--accent)] transition-colors"><Linkedin className="w-6 h-6" /></a>
                <a href="#" className="hover:text-[var(--accent)] transition-colors"><Twitter className="w-6 h-6" /></a>
              </div>
           </motion.div>
        </section>

      </motion.div>
    </div>
  );
}
