import React from 'react';
import { Terminal, ExternalLink, Github, Mail, MapPin, Briefcase, FolderGit2 } from 'lucide-react';

export const templateMetadata = {
  id: 'developer-terminal',
  name: 'Developer Terminal',
  description: 'Cyberpunk inspired developer terminal layout with clean monospace accents.',
  category: 'Developer',
  badge: 'Custom'
};

export default function DeveloperTerminalTemplate({ portfolioData }) {
  const {
    personalInfo = {},
    projects = [],
    skills = [],
    experience = [],
    siteConfig = {}
  } = portfolioData || {};

  const accentColor = siteConfig.accentColor || '#10b981';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/20 selection:text-emerald-400">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Terminal Window Header */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-slate-400 ml-2 font-mono flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                ~/portfolio/{personalInfo.name ? personalInfo.name.toLowerCase().replace(/\s+/g, '-') : 'profile'}.sh
              </span>
            </div>
            <div className="text-[11px] text-slate-500 uppercase tracking-widest font-sans">
              BASH TERMINAL
            </div>
          </div>

          {/* Hero Profile Output */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="text-xs text-slate-500">
              <span className="text-emerald-400">$</span> whoami --full
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {personalInfo.name || "Alex Morgan"}
                </h1>
                <p className="text-base text-emerald-400 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {personalInfo.title || "Full Stack Engineer & System Architect"}
                </p>
                {personalInfo.location && (
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {personalInfo.location}
                  </p>
                )}
              </div>

              {personalInfo.avatarUrl && (
                <img
                  src={personalInfo.avatarUrl}
                  alt={personalInfo.name}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-emerald-500/40 shadow-lg"
                />
              )}
            </div>

            {personalInfo.bio && (
              <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
                {personalInfo.bio}
              </p>
            )}

            {/* Quick Contact Badges */}
            <div className="flex flex-wrap gap-3 pt-3">
              {personalInfo.email && (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700/60 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {personalInfo.email}
                </a>
              )}
              {personalInfo.socialLinks?.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700/60 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {s.platform || 'Social'}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs text-slate-500">
              <span className="text-emerald-400">$</span> cat skills.json | jq .core_competencies
            </div>
            <div className="flex flex-wrap gap-2 p-5 rounded-xl border border-slate-800 bg-slate-900/50">
              {skills.map((skill, idx) => {
                const skillName = typeof skill === 'string' ? skill : (skill.name || skill.title);
                return (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded bg-slate-800 text-emerald-300 border border-emerald-500/20 font-medium"
                  >
                    #{skillName}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500">
              <span className="text-emerald-400">$</span> ls -la ./projects --sort=relevance
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 transition-all space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-emerald-400" />
                      {proj.title || "Project Title"}
                    </h3>
                    <div className="flex items-center gap-2">
                      {proj.github && (
                        <a href={proj.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-400">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {proj.description || "Production-grade system built for scale and seamless user experience."}
                  </p>

                  {proj.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(Array.isArray(proj.tags) ? proj.tags : String(proj.tags).split(',')).map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                          {String(tag).trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500">
              <span className="text-emerald-400">$</span> git log --stat --oneline career_history
            </div>
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-1">
                    <span className="font-semibold text-sm text-white flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                      {exp.role} @ <span className="text-emerald-300">{exp.company}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">{exp.duration}</span>
                  </div>
                  {exp.description && (
                    <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Terminal Footer */}
        <div className="pt-8 text-center text-xs text-slate-600">
          <span>[process completed with exit code 0]</span>
        </div>

      </div>
    </div>
  );
}
