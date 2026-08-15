import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Generates a Next.js App Router boilerplate and triggers a ZIP download.
 */
export async function exportNextJsPortfolio(portfolioData) {
    const zip = new JSZip();

    // 1. package.json
    const packageJson = {
        "name": "my-portfolio",
        "version": "0.1.0",
        "private": true,
        "scripts": {
            "dev": "next dev",
            "build": "next build",
            "start": "next start",
            "lint": "next lint"
        },
        "dependencies": {
            "react": "^18",
            "react-dom": "^18",
            "next": "14.2.3",
            "lucide-react": "^0.394.0"
        },
        "devDependencies": {
            "postcss": "^8",
            "tailwindcss": "^3.4.1",
            "eslint": "^8",
            "eslint-config-next": "14.2.3"
        }
    };
    zip.file("package.json", JSON.stringify(packageJson, null, 2));

    // 2. tailwind.config.js
    const themeMode = portfolioData?.siteConfig?.themeMode || 'light';
    const primaryHex = portfolioData?.siteConfig?.accentColor || '#6366f1';
    // Just a simple setup, letting CSS variables handle it mostly
    const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
      },
    },
  },
  plugins: [],
};
`;
    zip.file("tailwind.config.js", tailwindConfig);

    // 3. postcss.config.js
    const postcssConfig = `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {}, }, };`;
    zip.file("postcss.config.js", postcssConfig);

    // 4. src/app/globals.css
    // Calculate raw CSS variables
    const bgColor = themeMode === 'dark' ? '#0f172a' : '#ffffff';
    const fgColor = themeMode === 'dark' ? '#f8fafc' : '#0f172a';
    const globalsCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: ${bgColor};
  --foreground: ${fgColor};
  --primary: ${primaryHex};
  --primary-foreground: ${themeMode === 'dark' ? '#000000' : '#ffffff'};
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}
`;
    zip.file("src/app/globals.css", globalsCss);

    // 5. src/app/layout.js
    const layoutJs = `
import "./globals.css";
export const metadata = {
  title: "${portfolioData?.seo?.title || 'My Portfolio'}",
  description: "${portfolioData?.seo?.description || 'Portfolio generated with Sparkfolio'}",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
    zip.file("src/app/layout.js", layoutJs);

    // 6. src/app/page.js
    // Extract data
    const hero = portfolioData?.heroSection || {};
    const about = portfolioData?.aboutSection || {};
    const projects = portfolioData?.projectsSection || [];

    const pageJs = `
import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24 max-w-5xl mx-auto space-y-16">
      
      {/* Hero Section */}
      <section className="space-y-4">
        <h1 className="text-5xl font-bold text-primary">{ \`${hero.greeting || ''} ${hero.headline || ''}\` }</h1>
        <p className="text-xl text-foreground/80">{ \`${hero.subheadline || ''}\` }</p>
      </section>

      {/* About Section */}
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold border-b pb-2">About Me</h2>
        <p className="text-lg leading-relaxed">{ \`${about.bioDescription || ''}\` }</p>
      </section>

      {/* Projects Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold border-b pb-2">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${projects.map(p => `
            <div className="border border-foreground/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">${p.name || ''}</h3>
              <p className="text-sm mb-4">${p.description || ''}</p>
              ${p.url ? `<a href="${p.url}" target="_blank" className="text-primary hover:underline">View Project &rarr;</a>` : ''}
            </div>
          `).join('\n')}
        </div>
      </section>
      
    </main>
  );
}
`;
    zip.file("src/app/page.js", pageJs);

    // 7. raw-data.json
    zip.file("raw-data.json", JSON.stringify(portfolioData, null, 2));

    // Generate ZIP
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "sparkfolio-nextjs-export.zip");
}
