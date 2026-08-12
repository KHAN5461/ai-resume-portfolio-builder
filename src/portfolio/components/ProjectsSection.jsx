import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

export default function ProjectsSection({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <section id="projects" className="py-[clamp(2rem,8vw,6rem)] px-8 max-w-[1200px] mx-auto">
      <h2 className="text-center text-[clamp(2rem,4vw,3.5rem)] mb-12 text-[#2c3e50] font-['Space_Grotesk',sans-serif] font-bold">
        My Work
      </h2>
      
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-10">
        {data.map((project, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(0,0,0,0.15)] flex flex-col">
            
            <a href={project.liveUrl || project.githubUrl || "#"} target="_blank" rel="noreferrer" className="block text-inherit no-underline flex-grow flex flex-col">
              {project.thumbnailUrl ? (
                <img src={project.thumbnailUrl} alt={project.title} className="w-full h-[240px] object-cover" />
              ) : (
                <div className="w-full h-[240px] bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-4xl">
                  {project.title?.substring(0, 2).toUpperCase()}
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="m-0 mb-2 text-2xl text-[#2c3e50] font-['Space_Grotesk',sans-serif] font-bold">{project.title}</h3>
                <p className="m-0 text-[#555] flex-grow">{project.description || project.tagline}</p>
                
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-xs font-semibold text-[#3366BB] bg-[#E8F0FE] px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </a>
            
          </div>
        ))}
      </div>
    </section>
  );
}
