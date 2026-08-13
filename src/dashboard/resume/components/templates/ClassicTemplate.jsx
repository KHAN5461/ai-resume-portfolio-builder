import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ClassicTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        if (dateStr.toLowerCase() === 'present') return 'Present';
        const [year, month] = dateStr.split("-");
        if (!year || !month) return dateStr;
        const date = new Date(year, month - 1);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-10 bg-white text-gray-800 leading-relaxed shadow-sm">
            {/* Top Accent Bar */}
            <div className="h-2 w-full absolute top-0 left-0" style={{ backgroundColor: accentColor }}></div>
            
            {/* Header */}
            <header className="mb-10 pb-6 border-b border-gray-200">
                <h1 className="text-4xl font-light mb-1 tracking-tight" style={{ color: accentColor }}>
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                {data.personal_info?.profession && (
                    <h2 className="text-lg font-medium tracking-wide uppercase text-gray-500 mb-4">
                        {data.personal_info.profession}
                    </h2>
                )}

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                    {data.personal_info?.email && (
                        <div className="flex items-center gap-1.5">
                            <Mail className="size-3.5" style={{ color: accentColor }} />
                            <span>{data.personal_info.email}</span>
                        </div>
                    )}
                    {data.personal_info?.phone && (
                        <div className="flex items-center gap-1.5">
                            <Phone className="size-3.5" style={{ color: accentColor }} />
                            <span>{data.personal_info.phone}</span>
                        </div>
                    )}
                    {data.personal_info?.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="size-3.5" style={{ color: accentColor }} />
                            <span>{data.personal_info.location}</span>
                        </div>
                    )}
                    {data.personal_info?.linkedin && (
                        <div className="flex items-center gap-1.5">
                            <Linkedin className="size-3.5" style={{ color: accentColor }} />
                            <span className="break-all">{data.personal_info.linkedin}</span>
                        </div>
                    )}
                    {data.personal_info?.website && (
                        <div className="flex items-center gap-1.5">
                            <Globe className="size-3.5" style={{ color: accentColor }} />
                            <span className="break-all">{data.personal_info.website}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold tracking-widest uppercase mb-4 border-b pb-1" style={{ color: accentColor, borderColor: accentColor }}>
                        Professional Summary
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{data.professional_summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold tracking-widest uppercase mb-5 border-b pb-1" style={{ color: accentColor, borderColor: accentColor }}>
                        Professional Experience
                    </h2>

                    <div className="space-y-4">
                        {data.experience.map((exp, index) => (
                            <div key={index} className="border-l-3 pl-4" style={{ borderColor: accentColor }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                        <p className="text-gray-700 font-medium">
                                            {exp.company}
                                            {(exp.city || exp.state) && (
                                                <span>
                                                    {exp.company ? ', ' : ''}
                                                    {exp.city}{exp.city && exp.state ? ', ' : ''}{exp.state}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        <p>{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                                    </div>
                                </div>
                                {exp.description && (
                                    <div 
                                        className="text-gray-700 leading-relaxed preview-html-content" 
                                        dangerouslySetInnerHTML={{ __html: exp.description }} 
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.project && data.project.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold tracking-widest uppercase mb-5 border-b pb-1" style={{ color: accentColor, borderColor: accentColor }}>
                        Projects
                    </h2>

                    <ul className="space-y-3 ">
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex justify-between items-start border-l-3 border-gray-300 pl-6">
                                <div>
                                    <li className="font-semibold text-gray-800 ">{proj.name}</li>
                                    <p className="text-gray-600">{proj.description}</p>
                                </div>
                            </div>
                        ))}
                    </ul>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold tracking-widest uppercase mb-5 border-b pb-1" style={{ color: accentColor, borderColor: accentColor }}>
                        Education
                    </h2>

                    <div className="space-y-3">
                        {data.education.map((edu, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {edu.degree} {edu.field && `in ${edu.field}`}
                                        </h3>
                                        <p className="text-gray-700">{edu.institution}</p>
                                        {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        <p>{formatDate(edu.graduation_date)}</p>
                                    </div>
                                </div>
                                {edu.description && (
                                    <p className="text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-wrap">{edu.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold tracking-widest uppercase mb-5 border-b pb-1" style={{ color: accentColor, borderColor: accentColor }}>
                        Core Skills
                    </h2>

                    <div className="flex gap-x-4 gap-y-2 flex-wrap">
                        {data.skills.map((skill, index) => (
                            <div key={index} className="text-gray-700 bg-gray-50 px-3 py-1 rounded-md text-sm border border-gray-100">
                                {skill}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default ClassicTemplate;