import React from 'react';

export default function ContactSection({ data }) {
  if (!data) return null;

  return (
    <section className="relative pb-24 text-center max-w-2xl mx-auto">
      <h2 className="font-headline-xl mb-6 text-on-surface">
        {data.heading || "Get In Touch"}
      </h2>
      
      <p className="text-on-surface-variant font-body-lg mb-10 leading-relaxed">
        {data.subheading || "I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!"}
      </p>
      
      {data.email && (
        <a 
          href={`mailto:${data.email}`}
          className="inline-block px-8 py-4 bg-stitch-primary text-on-primary font-label-md rounded-full hover:bg-stitch-primary/90 transition-colors"
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
              className="text-on-surface-variant hover:text-stitch-primary transition-colors capitalize font-label-sm"
            >
              {link.platform}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
