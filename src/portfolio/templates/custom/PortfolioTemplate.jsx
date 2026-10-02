import React, { useState } from "react";
import {
  Github,
  ExternalLink,
  Mail,
  MapPin,
  Briefcase,
  Terminal,
  Award,
  Globe,
  Quote,
  MessageSquare,
  Menu,
  X
} from "lucide-react";

export const templateMetadata = {
  id: "harshit-dev-portfolio",
  name: "Developer Dark Theme",
  description: "A dark theme full-stack developer portfolio with a terminal vibe and internal multi-page routing.",
  category: "Tech",
  badge: "Custom",
};

export default function PortfolioTemplate({ portfolioData }) {
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    personalInfo = {},
    projects = [],
    skills = [],
    experience = [],
    education = [],
    siteConfig = {},
  } = portfolioData || {};

  const name = personalInfo.name || "Default Name";
  const title = personalInfo.title || "Software Engineer";
  const bio = personalInfo.bio || "From Frontend Flourishes to Backend Brilliance: Powering Digital Dreams with Full Stack Wizardry";
  const location = personalInfo.location || "";
  const email = personalInfo.email || "";
  const avatarUrl = personalInfo.avatarUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60";
  const socialLinks = personalInfo.socialLinks || [];

  const accentColor = siteConfig.accentColor || "#C778DD";
  const textMuted = "#ABB2BF";
  const bgColor = "#282C33";

  const navItems = [
    { name: "home", id: "home" },
    { name: "works", id: "works" },
    { name: "about-me", id: "about" },
    { name: "contact", id: "contact" }
  ];

  const navigateTo = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => navigateTo(item.id)}
          className={`hover:text-white transition-colors relative ${activeTab === item.id ? 'font-bold' : ''}`}
          style={{ color: activeTab === item.id ? '#fff' : textMuted }}
        >
          <span style={{ color: accentColor }}>#</span>{item.name}
          {activeTab === item.id && (
            <span className="absolute -bottom-1 left-0 w-full h-[2px]" style={{ backgroundColor: accentColor }}></span>
          )}
        </button>
      ))}
    </>
  );

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: bgColor, color: "#fff" }}>
      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-50 py-4 px-5 max-w-6xl mx-auto flex justify-between items-center" style={{ backgroundColor: bgColor }}>
        <div 
          className="flex gap-2 items-center cursor-pointer" 
          onClick={() => navigateTo('home')}
        >
          <Terminal size={24} style={{ color: accentColor }} />
          <h1 className="font-bold text-lg">{name}</h1>
        </div>
        
        <div className="hidden md:flex gap-6 items-center">
          <NavLinks />
        </div>

        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col p-5" style={{ backgroundColor: bgColor }}>
          <div className="flex justify-between items-center mb-10">
            <div className="flex gap-2 items-center" onClick={() => navigateTo('home')}>
              <Terminal size={24} style={{ color: accentColor }} />
              <h1 className="font-bold text-lg">{name}</h1>
            </div>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col gap-8 text-2xl">
            <NavLinks />
          </div>
        </div>
      )}

      {/* PAGE CONTENT */}
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col gap-24">
        
        {/* HOME PAGE */}
        {activeTab === "home" && (
          <>
            <main className="flex flex-col md:flex-row items-center gap-10 justify-between mt-10">
              <div className="flex-1 flex flex-col gap-8">
                <h2 className="text-4xl font-semibold leading-tight">
                  {name} is a{" "}
                  <span style={{ color: accentColor }}>
                    {title}
                  </span>
                </h2>
                <p className="font-normal text-base leading-relaxed" style={{ color: textMuted }}>
                  {bio}
                </p>
                {email && (
                  <div>
                    <button
                      onClick={() => navigateTo('contact')}
                      className="inline-block px-6 py-2 border hover:bg-white/10 transition-colors duration-300"
                      style={{ borderColor: accentColor, color: "#fff" }}
                    >
                      Contact Me!!
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="object-cover w-64 h-80 lg:w-80 lg:h-96"
                  />
                  <div 
                    className="absolute -z-10 w-full h-full border border-dashed top-4 left-4" 
                    style={{ borderColor: accentColor }}
                  ></div>
                </div>
                {location && (
                  <div className="mt-8 text-sm border p-2 text-center flex items-center justify-center gap-2" style={{ borderColor: textMuted, color: textMuted }}>
                    <MapPin size={16} style={{ color: accentColor }} />
                    <span>Located in <span className="text-white font-semibold">{location}</span></span>
                  </div>
                )}
              </div>
            </main>

            {projects.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-10">
                  <div className="flex gap-3 items-center w-full">
                    <div className="text-3xl font-medium">
                      <span style={{ color: accentColor }}>#</span>
                      <span>projects</span>
                    </div>
                    <div className="h-[1px] flex-1 max-w-sm hidden md:block" style={{ backgroundColor: accentColor }}></div>
                  </div>
                  <button onClick={() => navigateTo('works')} className="hidden md:block whitespace-nowrap hover:text-white" style={{ color: textMuted }}>
                    View all ~~&gt;
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.slice(0, 3).map((project, index) => (
                    <div key={project.id || index} className="border flex flex-col h-full" style={{ borderColor: textMuted }}>
                      <img src={project.image || "https://images.unsplash.com/photo-1618477247222-accd0b14c30c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} alt={project.title} className="w-full h-48 object-cover border-b" style={{ borderColor: textMuted }} />
                      <div className="p-2 border-b text-sm" style={{ borderColor: textMuted, color: textMuted }}>
                        {Array.isArray(project.tags) ? project.tags.join(" ") : (project.tags || "Tech Stack")}
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-2xl font-medium mb-4">{project.title}</h3>
                        <p className="text-sm mb-6 flex-1" style={{ color: textMuted }}>{project.description}</p>
                        <div className="flex gap-4">
                          {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="px-4 py-2 border transition-colors hover:bg-white/10" style={{ borderColor: accentColor }}>Live &lt;~&gt;</a>}
                          {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="px-4 py-2 border transition-colors hover:bg-white/10 flex items-center justify-center" style={{ borderColor: textMuted, color: textMuted }}><Github size={18} /></a>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {skills.length > 0 && (
              <section>
                <div className="flex justify-between items-center mb-10">
                  <div className="flex gap-3 items-center w-full">
                    <div className="text-3xl font-medium">
                      <span style={{ color: accentColor }}>#</span>
                      <span>skills</span>
                    </div>
                    <div className="h-[1px] flex-1 max-w-sm hidden md:block" style={{ backgroundColor: accentColor }}></div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {skills.slice(0, 8).map((skill, index) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    return (
                      <div key={index} className="border px-4 py-2" style={{ borderColor: textMuted, color: textMuted }}>
                        {skillName}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}

        {/* WORKS PAGE */}
        {activeTab === "works" && (
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-medium">
                <span style={{ color: accentColor }}>/</span>projects
              </h2>
              <p style={{ color: textMuted }}>List of my projects</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {projects.map((project, index) => (
                <div key={project.id || index} className="border flex flex-col h-full" style={{ borderColor: textMuted }}>
                  <img src={project.image || "https://images.unsplash.com/photo-1618477247222-accd0b14c30c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} alt={project.title} className="w-full h-48 object-cover border-b" style={{ borderColor: textMuted }} />
                  <div className="p-2 border-b text-sm" style={{ borderColor: textMuted, color: textMuted }}>
                    {Array.isArray(project.tags) ? project.tags.join(" ") : (project.tags || "Tech Stack")}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-2xl font-medium mb-4">{project.title}</h3>
                    <p className="text-sm mb-6 flex-1" style={{ color: textMuted }}>{project.description}</p>
                    <div className="flex gap-4">
                      {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="px-4 py-2 border transition-colors hover:bg-white/10" style={{ borderColor: accentColor }}>Live &lt;~&gt;</a>}
                      {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="px-4 py-2 border transition-colors hover:bg-white/10 flex items-center justify-center" style={{ borderColor: textMuted, color: textMuted }}><Github size={18} /></a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABOUT ME PAGE */}
        {activeTab === "about" && (
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-medium">
                <span style={{ color: accentColor }}>/</span>about-me
              </h2>
              <p style={{ color: textMuted }}>Who am I?</p>
            </div>
            <div className="flex flex-col md:flex-row gap-10 items-start mt-4">
              <div className="flex-1 text-base leading-relaxed" style={{ color: textMuted }}>
                {bio}
                {experience.length > 0 && (
                  <div className="mt-10">
                    <h3 className="text-2xl text-white mb-6">Experience</h3>
                    <div className="flex flex-col gap-4">
                      {experience.map((exp, index) => (
                        <div key={index} className="border p-4" style={{ borderColor: textMuted }}>
                          <h4 className="text-lg font-bold text-white">{exp.role}</h4>
                          <p style={{ color: accentColor }}>{exp.company} | {exp.duration}</p>
                          <p className="mt-2 text-sm">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {education.length > 0 && (
                  <div className="mt-10">
                    <h3 className="text-2xl text-white mb-6">Education</h3>
                    <div className="flex flex-col gap-4">
                      {education.map((edu, index) => (
                        <div key={index} className="border p-4" style={{ borderColor: textMuted }}>
                          <h4 className="text-lg font-bold text-white">{edu.degree}</h4>
                          <p style={{ color: accentColor }}>{edu.institution} | {edu.year}</p>
                          {edu.details && <p className="mt-2 text-sm">{edu.details}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl text-white mb-6">Skills</h3>
                <div className="flex flex-wrap gap-4">
                  {skills.map((skill, index) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    return (
                      <div key={index} className="border px-4 py-2" style={{ borderColor: textMuted, color: textMuted }}>
                        {skillName}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT PAGE */}
        {activeTab === "contact" && (
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-medium">
                <span style={{ color: accentColor }}>/</span>contact
              </h2>
              <p style={{ color: textMuted }}>Get in touch</p>
            </div>
            <div className="flex flex-col md:flex-row gap-10 mt-4">
              <div className="flex-1 text-base leading-relaxed" style={{ color: textMuted }}>
                I'm interested in freelance opportunities and open to new roles. However, if you have other requests or questions, don't hesitate to contact me!
              </div>
              <div className="border p-4 h-fit" style={{ borderColor: textMuted }}>
                <h3 className="text-white mb-4">Message me here</h3>
                <div className="flex flex-col gap-3">
                  {email && (
                    <a href={`mailto:${email}`} className="flex gap-2 items-center hover:text-white" style={{ color: textMuted }}>
                      <Mail size={20} />
                      {email}
                    </a>
                  )}
                  {socialLinks.map((link, i) => {
                    const platform = link.platform?.toLowerCase() || '';
                    let Icon = Globe;
                    if (platform.includes('github')) Icon = Github;
                    if (platform.includes('linkedin')) Icon = Briefcase;
                    if (platform.includes('twitter') || platform.includes('x')) Icon = MessageSquare;
                    return (
                      <a key={i} href={link.url} target="_blank" rel="noreferrer" className="flex gap-2 items-center hover:text-white" style={{ color: textMuted }}>
                        <Icon size={20} />
                        {link.platform}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="border-t pt-8 pb-16 flex flex-col md:flex-row justify-between items-center gap-6" style={{ borderColor: textMuted }}>
          <div className="flex flex-col gap-2 items-center md:items-start">
            <div className="flex items-center gap-2">
              <Terminal size={24} style={{ color: accentColor }} />
              <span className="text-xl font-semibold">{name}</span>
            </div>
            <p className="text-sm" style={{ color: textMuted }}>{title}</p>
          </div>
          
          <div className="flex flex-col gap-2 items-center md:items-end">
            <h3 className="text-lg font-medium text-white">Media</h3>
            <div className="flex gap-4">
              {socialLinks.map((link, i) => {
                const platform = link.platform?.toLowerCase() || '';
                let Icon = Globe;
                if (platform.includes('github')) Icon = Github;
                if (platform.includes('linkedin')) Icon = Briefcase;
                if (platform.includes('twitter') || platform.includes('x')) Icon = MessageSquare;
                
                return (
                  <a key={i} href={link.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors" style={{ color: textMuted }}>
                    <Icon size={24} />
                  </a>
                );
              })}
              {email && (
                <a href={`mailto:${email}`} className="hover:text-white transition-colors" style={{ color: textMuted }}>
                  <Mail size={24} />
                </a>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
