import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import ExperienceCard from "./shared/ExperienceCard";
import EducationCard from "./shared/EducationCard";
import SkillBadge from "./shared/SkillBadge";
import SectionHeading from "./shared/SectionHeading";

const ModernTemplate = ({ data, accentColor }) => {
	const formatDate = (dateStr) => {
		if (!dateStr) return "";
		const [year, month] = dateStr.split("-");
		return new Date(year, month - 1).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short"
		});
	};

	return (
		<div className="max-w-4xl mx-auto bg-white text-gray-800">
			{/* Header */}
			<header className="p-8 text-white" style={{ backgroundColor: accentColor }}>
				<h1 className="text-4xl font-light mb-3">
					{data.personal_info?.full_name || "Your Name"}
				</h1>
                {data.personal_info?.profession && (
                    <h2 className="text-xl font-medium mb-4 text-white/90">
                        {data.personal_info.profession}
                    </h2>
                )}

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm ">
					{data.personal_info?.email && (
						<div className="flex items-center gap-2">
							<Mail className="size-4" />
							<span>{data.personal_info.email}</span>
						</div>
					)}
					{data.personal_info?.phone && (
						<div className="flex items-center gap-2">
							<Phone className="size-4" />
							<span>{data.personal_info.phone}</span>
						</div>
					)}
					{data.personal_info?.location && (
						<div className="flex items-center gap-2">
							<MapPin className="size-4" />
							<span>{data.personal_info.location}</span>
						</div>
					)}
					{data.personal_info?.linkedin && (
						<a target="_blank" href={data.personal_info?.linkedin} className="flex items-center gap-2">
							<Linkedin className="size-4" />
							<span className="break-all text-xs">{data.personal_info.linkedin.split("https://www.")[1] ? data.personal_info.linkedin.split("https://www.")[1] : data.personal_info.linkedin}</span>
						</a>
					)}
					{data.personal_info?.website && (
						<a target="_blank" href={data.personal_info?.website} className="flex items-center gap-2">
							<Globe className="size-4" />
							<span className="break-all text-xs">{data.personal_info.website.split("https://")[1] ? data.personal_info.website.split("https://")[1] : data.personal_info.website}</span>
						</a>
					)}
				</div>
			</header>

			<div className="p-8">
				{/* Professional Summary */}
				{data.professional_summary && (
					<section className="mb-8">
						<SectionHeading title="Professional Summary" accentColor={accentColor} variant="modern" />
						<p className="text-gray-700 ">{data.professional_summary}</p>
					</section>
				)}

				{/* Experience */}
				{data.experience && data.experience.length > 0 && (
					<section className="mb-8">
						<SectionHeading title="Experience" accentColor={accentColor} variant="modern" />

						<div className="space-y-6">
							{data.experience.map((exp, index) => (
								<ExperienceCard key={index} experience={exp} accentColor={accentColor} variant="modern" />
							))}
						</div>
					</section>
				)}

				{/* Projects */}
				{data.project && data.project.length > 0 && (
					<section className="mb-8">
						<SectionHeading title="Projects" accentColor={accentColor} variant="modern" />

						<div className="space-y-6">
							{data.project.map((p, index) => (
								<div key={index} className="relative pl-6 border-l border-gray-200" style={{borderLeftColor: accentColor}}>
									<div className="flex justify-between items-start">
										<div>
											<h3 className="text-lg font-medium text-gray-900">{p.name}</h3>
										</div>
									</div>
									{p.description && (
										<div className="text-gray-700 leading-relaxed text-sm mt-3">
											{p.description}
										</div>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				<div className="grid sm:grid-cols-2 gap-8">
					{/* Education */}
					{data.education && data.education.length > 0 && (
						<section>
							<SectionHeading title="Education" accentColor={accentColor} variant="modern" />

							<div className="space-y-4">
								{data.education.map((edu, index) => (
									<EducationCard key={index} education={edu} accentColor={accentColor} variant="modern" />
								))}
							</div>
						</section>
					)}

					{/* Skills */}
					{data.skills && data.skills.length > 0 && (
						<section>
							<SectionHeading title="Skills" accentColor={accentColor} variant="modern" />

							<div className="flex flex-wrap gap-2">
								{data.skills.map((skill, index) => (
									<SkillBadge 
										key={index} 
										name={typeof skill === 'string' ? skill : skill.name} 
										rating={skill.rating || 0} 
										accentColor={accentColor} 
										variant="pill" 
									/>
								))}
							</div>
						</section>
					)}
				</div>
			</div>
		</div>
	);
}

export default ModernTemplate;