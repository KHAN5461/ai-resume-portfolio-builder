import React from 'react';

/**
 * Shared skill badge component used across all resume templates.
 * @param {object} props
 * @param {string} props.name - Skill name
 * @param {number} props.rating - Skill rating
 * @param {string} props.accentColor - Theme accent color
 * @param {'bar'|'pill'|'tag'} props.variant - Visual variant
 */
const SkillBadge = React.memo(({ name, rating, accentColor, variant = 'bar' }) => {
  if (variant === 'pill') {
    return (
      <span className="px-3 py-1 rounded-full text-[9pt] bg-gray-100 text-gray-700" style={{ border: `1px solid ${accentColor}` }}>
        {name}
      </span>
    );
  }

  if (variant === 'tag') {
    return (
      <span className="text-[10pt] text-gray-700 after:content-[',_'] last:after:content-['']">
        {name}
      </span>
    );
  }

  // Default 'bar' variant
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10pt] font-medium">{name}</span>
      {rating > 0 && (
        <div className="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${rating}%`, backgroundColor: accentColor }}
          />
        </div>
      )}
    </div>
  );
});

SkillBadge.displayName = 'SkillBadge';
export default SkillBadge;
