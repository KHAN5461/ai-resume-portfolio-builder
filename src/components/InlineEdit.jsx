import React, { useEffect, useRef } from 'react';

export default function InlineEdit({ 
  value, 
  onSave, 
  tagName = 'span', 
  className = '', 
  style = {},
  placeholder = 'Click to edit...'
}) {
  const contentEditableRef = useRef(null);

  // Check if we are in edit mode based on URL
  const isEditMode = window.location.pathname.includes('/edit');

  useEffect(() => {
    if (contentEditableRef.current && contentEditableRef.current.innerText !== value) {
      contentEditableRef.current.innerText = value || '';
    }
  }, [value]);

  const handleBlur = () => {
    if (!isEditMode) return;
    const currentText = contentEditableRef.current.innerText;
    if (currentText !== value) {
      onSave(currentText);
    }
  };

  const handleKeyDown = (e) => {
    if (!isEditMode) return;
    if (e.key === 'Enter' && tagName !== 'div' && tagName !== 'p') {
      e.preventDefault();
      contentEditableRef.current.blur();
    }
  };

  const Tag = tagName;

  if (!isEditMode) {
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  return (
    <Tag
      ref={contentEditableRef}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`relative hover:ring-2 hover:ring-stitch-primary/30 hover:bg-stitch-primary/5 rounded px-1 -mx-1 outline-none focus:ring-2 focus:ring-stitch-primary focus:bg-white transition-all cursor-text min-w-[20px] empty:before:content-[attr(placeholder)] empty:before:text-gray-400 ${className}`}
      style={style}
      placeholder={placeholder}
    >
      {value}
    </Tag>
  );
}
