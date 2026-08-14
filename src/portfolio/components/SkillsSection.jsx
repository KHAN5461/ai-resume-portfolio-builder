import React from 'react';

export default function SkillsSection({ data }) {
  if (!data || !data.categories || data.categories.length === 0) return null;

  return (
    <section className="py-24 px-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
        <span className="text-[#3366BB] font-['Space_Grotesk',sans-serif] text-xl">03.</span>
        <span className="text-[#2c3e50] font-['Space_Grotesk',sans-serif]">Technical Arsenal</span>
        <div className="flex-grow h-px bg-gray-300 ml-4" />
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.categories.map((category, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
            <h3 className="font-semibold text-[#2c3e50] mb-6 flex items-center gap-3 font-['Space_Grotesk',sans-serif]">
              <div className="w-2 h-2 rounded-full bg-[#3366BB]" />
              {category.categoryName}
            </h3>
            
            <div className="flex flex-wrap gap-3">
              {category.skills?.map((skill, sIdx) => (
                <span 
                  key={sIdx} 
                  className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-200 hover:border-[#3366BB] hover:text-[#3366BB] transition-colors cursor-default"
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
