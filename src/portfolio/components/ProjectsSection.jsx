import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

export default function ProjectsSection({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative">
      <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
        <span className="text-stitch-primary font-headline-md text-xl">02.</span>
        <span className="text-on-surface">Selected Works</span>
        <div className="flex-grow h-px bg-outline-variant/30 ml-4" />
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.map((project, idx) => (
          <div key={idx} className="group flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-sm transition-shadow">
            
            {/* Project Image Placeholder */}
            <div className="h-48 w-full bg-surface-container relative overflow-hidden border-b border-outline-variant/30">
              
              {project.thumbnailUrl ? (
                <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-headline-xl opacity-30">
                  {project.title?.substring(0, 2).toUpperCase()}
                </div>
              )}
              
              {/* Overlay Links */}
              <div className="absolute bottom-4 right-4 z-20 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {project.githubUrl && (
                  <a href={project.githubUrl} className="p-2 bg-surface border border-outline-variant/30 text-on-surface rounded-full hover:text-stitch-primary shadow-sm hover:shadow-md transition-all">
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} className="p-2 bg-surface border border-outline-variant/30 text-on-surface rounded-full hover:text-stitch-primary shadow-sm hover:shadow-md transition-all">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Project Details */}
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-headline-md text-on-surface group-hover:text-stitch-primary transition-colors">{project.title}</h3>
                {project.featured && (
                  <span className="px-2 py-1 font-label-sm text-stitch-primary bg-primary-container/20 rounded">Featured</span>
                )}
              </div>
              <p className="text-stitch-primary font-body-sm mb-4">{project.tagline}</p>
              <p className="text-on-surface-variant font-body-sm mb-6 flex-grow">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags?.map((tag, tIdx) => (
                  <span key={tIdx} className="font-label-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
}
