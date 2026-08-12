import React from 'react';

export default function MinimalistTemplate({ portfolioData }) {
  if (!portfolioData) return null;
  const { heroSection, aboutSection, projectsSection, skillsSection, contactSection } = portfolioData;

  return (
    <div className="max-w-4xl mx-auto px-8 py-20 space-y-32 font-sans tracking-tight text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Hero Section */}
      <section className="space-y-6 pt-20">
        <h2 className="text-xl font-medium text-slate-500">{heroSection?.greeting}</h2>
        <h1 className="text-6xl font-black leading-tight max-w-3xl">{heroSection?.headline}</h1>
        <p className="text-2xl text-slate-600 max-w-2xl leading-relaxed">{heroSection?.subheadline}</p>
      </section>

      {/* About Section */}
      <section className="grid md:grid-cols-3 gap-12 border-t border-slate-200 pt-12">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">01 / Background</h3>
        <div className="md:col-span-2 space-y-8">
          <p className="text-xl leading-relaxed">{aboutSection?.bioDescription}</p>
          <div className="grid grid-cols-2 gap-8 pt-8">
            {aboutSection?.stats?.map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-light mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="border-t border-slate-200 pt-12">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-12">02 / Selected Works</h3>
        <div className="space-y-24">
          {projectsSection?.map((project, i) => (
            <div key={project.id || i} className="group cursor-pointer">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/3 space-y-4">
                  <h4 className="text-3xl font-bold group-hover:underline underline-offset-8">{project.title}</h4>
                  <p className="text-slate-500">{project.tagline}</p>
                  <div className="flex flex-wrap gap-2 pt-4">
                    {project.tags?.map(tag => (
                      <span key={tag} className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <img src={project.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'} alt={project.title} className="w-full h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="grid md:grid-cols-3 gap-12 border-t border-slate-200 pt-12">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">03 / Capabilities</h3>
        <div className="md:col-span-2 grid grid-cols-2 gap-x-8 gap-y-12">
          {skillsSection?.categories?.map((cat, i) => (
            <div key={i}>
              <h4 className="text-lg font-bold mb-4">{cat.categoryName}</h4>
              <ul className="space-y-2 text-slate-600">
                {cat.skills?.map(skill => <li key={skill}>{skill}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="border-t border-slate-900 pt-20 pb-32">
        <div className="text-center space-y-8">
          <h2 className="text-5xl font-black">{contactSection?.heading || "Let's build something."}</h2>
          <a href={`mailto:${contactSection?.email}`} className="inline-block text-2xl font-medium border-b-2 border-slate-900 pb-1 hover:text-slate-500 transition-colors">
            {contactSection?.email}
          </a>
        </div>
      </section>
    </div>
  );
}
