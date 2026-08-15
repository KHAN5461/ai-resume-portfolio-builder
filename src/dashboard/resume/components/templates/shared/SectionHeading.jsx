import React from 'react';

/**
 * Shared section heading component used across all resume templates.
 * @param {object} props
 * @param {string} props.title - Section title
 * @param {string} props.accentColor - Theme accent color
 * @param {'classic'|'modern'|'minimal'} props.variant - Visual variant
 * @param {React.ReactNode} [props.icon] - Optional icon
 */
const SectionHeading = React.memo(({ title, accentColor, variant = 'classic', icon }) => {
  if (variant === 'modern') {
    return (
      <div className="flex items-center gap-2 mb-4 border-b pb-2" style={{ borderColor: accentColor }}>
        {icon && <span style={{ color: accentColor }}>{icon}</span>}
        <h3 className="font-bold text-[13pt]" style={{ color: accentColor }}>{title}</h3>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="mb-4 border-b border-gray-200 pb-1">
        <h3 className="font-semibold text-[11pt] tracking-widest uppercase text-gray-500">
          {title}
        </h3>
      </div>
    );
  }

  // Default 'classic' variant
  return (
    <h3 
      className="font-bold text-[14pt] mb-4 border-l-4 pl-3"
      style={{ borderColor: accentColor }}
    >
      {title}
    </h3>
  );
});

SectionHeading.displayName = 'SectionHeading';
export default SectionHeading;
