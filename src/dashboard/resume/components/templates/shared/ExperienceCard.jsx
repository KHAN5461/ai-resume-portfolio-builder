import React from 'react';

/**
 * Shared experience entry component used across all resume templates.
 * @param {object} props
 * @param {object} props.experience - { position, company, city, state, start_date, end_date, is_current, description }
 * @param {string} props.accentColor - Theme accent color
 * @param {'classic'|'modern'|'minimal'} props.variant - Visual variant
 */
const ExperienceCard = React.memo(({ experience, accentColor, variant = 'classic' }) => {
  const { position, company, city, state, start_date, end_date, is_current, description } = experience;
  const dateRange = is_current ? `${start_date} - Present` : `${start_date} - ${end_date}`;
  const location = [city, state].filter(Boolean).join(', ');

  // Variant-specific styles
  const styles = {
    classic: {
      container: 'mb-3',
      title: 'font-bold text-[11pt]',
      meta: 'text-[9pt] text-gray-600',
      description: 'text-[10pt] mt-1 text-gray-700',
      border: `border-l-2 pl-3`,
    },
    modern: {
      container: 'mb-4 p-3 rounded-lg bg-gray-50',
      title: 'font-semibold text-[11pt]',
      meta: 'text-[9pt] text-gray-500',
      description: 'text-[10pt] mt-2 text-gray-600',
      border: '',
    },
    minimal: {
      container: 'mb-4',
      title: 'font-medium text-[11pt]',
      meta: 'text-[9pt] text-gray-400 uppercase tracking-wider',
      description: 'text-[10pt] mt-1 text-gray-600 leading-relaxed',
      border: '',
    },
  };
  const s = styles[variant] || styles.classic;

  return (
    <div className={`${s.container} ${s.border}`} style={s.border ? { borderColor: accentColor } : {}}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className={s.title} style={{ color: variant === 'modern' ? accentColor : undefined }}>{position}</h4>
          <p className={s.meta}>{company}{location ? ` • ${location}` : ''}</p>
        </div>
        <span className={s.meta}>{dateRange}</span>
      </div>
      {description && (
        <div className={s.description} dangerouslySetInnerHTML={{ __html: description }} />
      )}
    </div>
  );
});

ExperienceCard.displayName = 'ExperienceCard';
export default ExperienceCard;
