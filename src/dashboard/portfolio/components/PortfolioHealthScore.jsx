import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

export default function PortfolioHealthScore({ portfolioId }) {
  const portfolioData = useSelector((state) => state.portfolio.present.portfolios[portfolioId]);

  const checks = useMemo(() => {
    if (!portfolioData) return [];
    
    const { heroSection, aboutSection, projectsSection, contactSection, skillsSection, siteConfig } = portfolioData;

    return [
      {
        id: 'hero-headline',
        label: 'Hero has a headline',
        points: 10,
        isCompleted: !!(heroSection?.headline?.trim().length > 0)
      },
      {
        id: 'hero-subtitle',
        label: 'Hero has a subtitle',
        points: 10,
        isCompleted: !!(heroSection?.subheadline?.trim().length > 0)
      },
      {
        id: 'about-bio',
        label: 'About has > 50 words',
        points: 20,
        isCompleted: !!(aboutSection?.bioDescription && aboutSection.bioDescription.trim().split(/\s+/).length > 50)
      },
      {
        id: 'projects-exist',
        label: 'Added at least one project',
        points: 20,
        isCompleted: !!(projectsSection && projectsSection.length > 0)
      },
      {
        id: 'projects-links',
        label: 'Projects have links',
        points: 10,
        isCompleted: !!(projectsSection && projectsSection.length > 0 && projectsSection.some(p => p.link || p.github || p.url))
      },
      {
        id: 'contact-info',
        label: 'Added contact info',
        points: 10,
        isCompleted: !!(contactSection?.email || (contactSection?.socialLinks && contactSection.socialLinks.length > 0))
      },
      {
        id: 'skills-exist',
        label: 'Added skills',
        points: 10,
        isCompleted: !!(skillsSection?.categories && skillsSection.categories.length > 0)
      },
      {
        id: 'seo-desc',
        label: 'Custom SEO Description',
        points: 10,
        isCompleted: !!(siteConfig?.seo?.metaDescription && siteConfig.seo.metaDescription !== "My professional portfolio")
      }
    ];
  }, [portfolioData]);

  const score = checks.reduce((total, check) => total + (check.isCompleted ? check.points : 0), 0);
  
  let colorClass = 'text-red-500';
  let strokeClass = 'stroke-red-500';
  if (score >= 80) {
    colorClass = 'text-green-500';
    strokeClass = 'stroke-green-500';
  } else if (score >= 50) {
    colorClass = 'text-yellow-500';
    strokeClass = 'stroke-yellow-500';
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 hover:bg-surface-variant p-2 rounded-full transition-colors relative group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="stroke-outline-variant/30"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${strokeClass} transition-all duration-1000 ease-out`}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className={`absolute text-[10px] font-bold ${colorClass}`}>{score}</span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low rounded-t-md">
          <h3 className="font-bold text-base flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            Portfolio Health
          </h3>
          <p className="text-sm text-on-surface-variant mt-1">
            Complete these suggestions to build a stellar portfolio.
          </p>
        </div>
        <div className="p-2 max-h-80 overflow-y-auto">
          {checks.map((check) => (
            <div key={check.id} className="flex items-center justify-between p-2 rounded hover:bg-surface-variant/50 transition-colors">
              <div className="flex items-center gap-3">
                {check.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-outline-variant" />
                )}
                <span className={`text-sm ${check.isCompleted ? 'text-on-surface-variant line-through opacity-70' : 'text-on-surface'}`}>
                  {check.label}
                </span>
              </div>
              <span className="text-xs font-medium text-on-surface-variant/70">
                +{check.points}
              </span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
