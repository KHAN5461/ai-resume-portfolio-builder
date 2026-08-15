import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from "lucide-react";
import SectionHeading from './shared/SectionHeading';
import ExperienceCard from './shared/ExperienceCard';
import EducationCard from './shared/EducationCard';

const InteractiveTemplate = ({ data, accentColor }) => {
    return (
        <div className="max-w-4xl mx-auto p-12 bg-[#FAFAFA] text-slate-800 shadow-sm rounded-xl border border-gray-100" style={{ fontFamily: 'var(--theme-font, "Inter")' }}>
            
            {/* Header: Interactive Digital-First */}
            <header className="mb-12 text-center">
                <div className="inline-block p-1 rounded-full mb-6" style={{ background: `linear-gradient(135deg, ${accentColor}, #4f46e5)` }}>
                    <div className="bg-white rounded-full p-4">
                        <span className="text-3xl font-black bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, #4f46e5)` }}>
                            {data?.personal_info?.full_name ? data.personal_info.full_name.charAt(0) : 'A'}
                        </span>
                    </div>
                </div>
                
                <h1 className="text-5xl font-extrabold tracking-tight mb-3 text-slate-900">
                    {data?.personal_info?.full_name || 'Your Name'}
                </h1>
                
                {data?.personal_info?.profession && (
                    <h2 className="text-xl font-medium text-slate-500 mb-6">
                        {data.personal_info.profession}
                    </h2>
                )}

                <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                    {data?.personal_info?.email && (
                        <a href={`mailto:${data.personal_info.email}`} className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 text-slate-600 hover:text-slate-900">
                            <Mail className="w-4 h-4" style={{ color: accentColor }} />
                            <span>Email Me</span>
                        </a>
                    )}
                    {data?.personal_info?.linkedin && (
                        <a href={data.personal_info.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 text-slate-600 hover:text-slate-900">
                            <Linkedin className="w-4 h-4" style={{ color: accentColor }} />
                            <span>LinkedIn</span>
                        </a>
                    )}
                    {data?.personal_info?.website && (
                        <a href={data.personal_info.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 text-slate-600 hover:text-slate-900">
                            <Globe className="w-4 h-4" style={{ color: accentColor }} />
                            <span>Portfolio</span>
                        </a>
                    )}
                    {data?.personal_info?.location && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 text-slate-600">
                            <MapPin className="w-4 h-4" style={{ color: accentColor }} />
                            <span>{data.personal_info.location}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data?.professional_summary && (
                <section className="mb-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: accentColor }}></div>
                    <p className="text-lg text-slate-600 leading-relaxed font-light">{data.professional_summary}</p>
                </section>
            )}

            {/* Skills as Interactive Pills */}
            {data?.skills && data.skills.length > 0 && (
                <section className="mb-10 text-center">
                    <div className="flex flex-wrap justify-center gap-3">
                        {data.skills.map((skill, idx) => (
                            <span 
                                key={idx} 
                                className="px-5 py-2.5 rounded-full text-sm font-semibold transition-transform hover:scale-105 cursor-default shadow-sm border"
                                style={{ backgroundColor: `${accentColor}10`, color: accentColor, borderColor: `${accentColor}30` }}
                            >
                                {typeof skill === 'string' ? skill : skill.name}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-1 gap-10">
                {/* Experience */}
                {data?.experience && data.experience.length > 0 && (
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <SectionHeading title="Experience" accentColor={accentColor} variant="modern" />
                        <div className="space-y-6 mt-6">
                            {data.experience.map((exp, idx) => (
                                <ExperienceCard key={idx} experience={exp} accentColor={accentColor} variant="modern" />
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {data?.project && data.project.length > 0 && (
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <SectionHeading title="Featured Projects" accentColor={accentColor} variant="modern" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {data.project.map((proj, idx) => (
                                <div key={idx} className="p-6 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors bg-[#FAFAFA]">
                                    <h4 className="text-lg font-bold text-slate-900 mb-2">{proj.name}</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data?.education && data.education.length > 0 && (
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <SectionHeading title="Education" accentColor={accentColor} variant="modern" />
                        <div className="space-y-4 mt-6">
                            {data.education.map((edu, idx) => (
                                <EducationCard key={idx} education={edu} accentColor={accentColor} variant="modern" />
                            ))}
                        </div>
                    </section>
                )}
            </div>
            
        </div>
    );
};

export default InteractiveTemplate;
