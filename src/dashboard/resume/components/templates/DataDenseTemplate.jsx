import React from 'react';
import SectionHeading from './shared/SectionHeading';
import ExperienceCard from './shared/ExperienceCard';
import EducationCard from './shared/EducationCard';

const DataDenseTemplate = ({ data, accentColor }) => {
    return (
        <div className="max-w-[1000px] mx-auto p-8 bg-white text-gray-900 shadow-sm" style={{ fontFamily: 'var(--theme-font, "Inter")' }}>
            <div className="flex flex-col md:flex-row gap-8">
                
                {/* LEFT SIDEBAR: Personal Info & Skills Matrix */}
                <div className="w-full md:w-1/3 flex flex-col gap-6">
                    <header className="border-b-4 pb-4" style={{ borderColor: accentColor }}>
                        <h1 className="text-3xl font-bold tracking-tight uppercase leading-none text-gray-900 mb-1">{data?.personal_info?.full_name || 'Your Name'}</h1>
                        <h2 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">{data?.personal_info?.profession || 'Job Title'}</h2>
                    </header>

                    <div className="flex flex-col gap-2 text-xs font-medium text-gray-700">
                        {data?.personal_info?.email && <span>{data.personal_info.email}</span>}
                        {data?.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                        {data?.personal_info?.location && <span>{data.personal_info.location}</span>}
                        {data?.personal_info?.linkedin && <span className="break-all">{data.personal_info.linkedin}</span>}
                        {data?.personal_info?.website && <span className="break-all">{data.personal_info.website}</span>}
                    </div>

                    {data?.skills && data.skills.length > 0 && (
                        <section className="mt-4">
                            <SectionHeading title="Tech Stack" accentColor={accentColor} variant="minimal" />
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                                {data.skills.map((skill, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-gray-100 py-1">
                                        <span className="font-semibold">{typeof skill === 'string' ? skill : skill.name}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data?.education && data.education.length > 0 && (
                        <section className="mt-4">
                            <SectionHeading title="Education" accentColor={accentColor} variant="minimal" />
                            <div className="space-y-4">
                                {data.education.map((edu, idx) => (
                                    <EducationCard key={idx} education={edu} accentColor={accentColor} variant="minimal" />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* RIGHT MAIN: Summary, Experience, Projects */}
                <div className="w-full md:w-2/3 flex flex-col gap-6">
                    {data?.professional_summary && (
                        <section>
                            <SectionHeading title="Summary" accentColor={accentColor} variant="minimal" />
                            <p className="text-sm text-gray-800 leading-relaxed font-medium">{data.professional_summary}</p>
                        </section>
                    )}

                    {data?.experience && data.experience.length > 0 && (
                        <section>
                            <SectionHeading title="Experience" accentColor={accentColor} variant="minimal" />
                            <div className="space-y-6">
                                {data.experience.map((exp, idx) => (
                                    <ExperienceCard key={idx} experience={exp} accentColor={accentColor} variant="minimal" />
                                ))}
                            </div>
                        </section>
                    )}

                    {data?.project && data.project.length > 0 && (
                        <section>
                            <SectionHeading title="Projects" accentColor={accentColor} variant="minimal" />
                            <div className="space-y-4">
                                {data.project.map((proj, idx) => (
                                    <div key={idx} className="mb-3">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="text-sm font-bold text-gray-900">{proj.name}</h4>
                                        </div>
                                        <p className="text-xs text-gray-700 leading-relaxed">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataDenseTemplate;
