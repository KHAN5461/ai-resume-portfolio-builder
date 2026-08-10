import React from 'react';

export default function SkillsSection({ data }) {
  if (!data || !data.categories || data.categories.length === 0) return null;

  return (
    <section className="relative">
      <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
        <span className="text-stitch-primary font-headline-md text-xl">03.</span>
        <span className="text-on-surface">Technical Arsenal</span>
        <div className="flex-grow h-px bg-outline-variant/30 ml-4" />
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.categories.map((category, idx) => (
          <div key={idx} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
            <h3 className="font-label-md text-on-surface mb-6 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-stitch-primary" />
              {category.categoryName}
            </h3>
            
            <div className="flex flex-wrap gap-3">
              {category.skills?.map((skill, sIdx) => (
                <span 
                  key={sIdx} 
                  className="px-3 py-1.5 bg-surface text-on-surface-variant rounded-lg font-label-sm border border-outline-variant/30 hover:border-stitch-primary/50 hover:text-stitch-primary transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
