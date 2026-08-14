import React from 'react';

export default function ContactSection({ data }) {
  if (!data) return null;

  return (
    <section className="py-24 px-8 text-center max-w-2xl mx-auto">
      <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold mb-6 text-[#2c3e50] font-['Space_Grotesk',sans-serif]">
        {data.heading || "Get In Touch"}
      </h2>
      
      <p className="text-[#555] text-lg mb-10 leading-relaxed font-['Inter',sans-serif]">
        {data.subheading || "I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!"}
      </p>
      
      {data.email && (
        <a 
          href={`mailto:${data.email}`}
          className="inline-block px-8 py-4 bg-[#3366BB] text-white font-bold rounded-full hover:bg-[#5A8DEE] hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-300"
        >
          Say Hello
        </a>
      )}
      
      {data.socialLinks && data.socialLinks.length > 0 && (
        <div className="mt-16 flex justify-center gap-6">
          {data.socialLinks.map((link, idx) => (
            <a 
              key={idx} 
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 hover:text-[#3366BB] transition-colors capitalize font-semibold"
            >
              {link.platform}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
