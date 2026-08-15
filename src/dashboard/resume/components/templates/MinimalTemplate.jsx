import ExperienceCard from "./shared/ExperienceCard";
import EducationCard from "./shared/EducationCard";
import SkillBadge from "./shared/SkillBadge";
import SectionHeading from "./shared/SectionHeading";

const MinimalTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [year, month] = dateStr.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light">
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-4xl font-thin mb-2 tracking-wide">
                    {data.personal_info?.full_name || "Your Name"}
                </h1>
                {data.personal_info?.profession && (
                    <h2 className="text-lg font-medium mb-4 text-gray-500 uppercase tracking-wider">
                        {data.personal_info.profession}
                    </h2>
                )}

                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    {data.personal_info?.email && <span>{data.personal_info.email}</span>}
                    {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
                    {data.personal_info?.location && <span>{data.personal_info.location}</span>}
                    {data.personal_info?.linkedin && (
                        <span className="break-all">{data.personal_info.linkedin}</span>
                    )}
                    {data.personal_info?.website && (
                        <span className="break-all">{data.personal_info.website}</span>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {data.professional_summary && (
                <section className="mb-10">
                    <p className=" text-gray-700">
                        {data.professional_summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-10">
                    <SectionHeading title="Experience" accentColor={accentColor} variant="minimal" />

                    <div className="space-y-6">
                        {data.experience.map((exp, index) => (
                            <ExperienceCard key={index} experience={exp} accentColor={accentColor} variant="minimal" />
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.project && data.project.length > 0 && (
                <section className="mb-10">
                    <SectionHeading title="Projects" accentColor={accentColor} variant="minimal" />

                    <div className="space-y-4">
                        {data.project.map((proj, index) => (
                            <div key={index} className="flex flex-col gap-2 justify-between items-baseline">
                                <h3 className="text-lg font-medium ">{proj.name}</h3>
                                <p className="text-gray-600">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-10">
                    <SectionHeading title="Education" accentColor={accentColor} variant="minimal" />

                    <div className="space-y-4">
                        {data.education.map((edu, index) => (
                            <EducationCard key={index} education={edu} accentColor={accentColor} variant="minimal" />
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section>
                    <SectionHeading title="Skills" accentColor={accentColor} variant="minimal" />

                    <div className="text-gray-700">
                        {data.skills.map((skill, index) => (
                            <SkillBadge 
                                key={index} 
                                name={typeof skill === 'string' ? skill : skill.name} 
                                rating={skill.rating || 0} 
                                accentColor={accentColor} 
                                variant="tag" 
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default MinimalTemplate;