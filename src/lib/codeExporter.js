import JSZip from 'jszip';

export function generatePortfolioReactCode(portfolioData) {
  const { siteConfig, heroSection, aboutSection, projectsSection, skillsSection } = portfolioData || {};

  return `import React from 'react';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
        <h2 className="text-sm uppercase tracking-widest text-indigo-400 font-semibold mb-3">
          {${JSON.stringify(heroSection?.greeting || 'Hello World')}}
        </h2>
        <h1 className="text-4xl md:text-6xl font-extrabold max-w-3xl tracking-tight mb-6">
          {${JSON.stringify(heroSection?.headline || 'I build exceptional digital experiences.')}}
        </h1>
        <p className="text-slate-400 max-w-xl text-base md:text-lg mb-8 leading-relaxed">
          {${JSON.stringify(heroSection?.subheadline || 'Full-stack developer focused on scalable applications.')}}
        </p>
        <div className="flex gap-4">
          <a href="#projects" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20">
            View Work
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 max-w-4xl mx-auto border-t border-slate-800/80">
        <h3 className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-2">01. Biography</h3>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">About Me</h2>
        <p className="text-slate-300 leading-relaxed text-lg">
          {${JSON.stringify(aboutSection?.bioDescription || 'Add your bio description here...')}}
        </p>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 max-w-5xl mx-auto border-t border-slate-800/80">
        <h3 className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-2">02. Portfolio</h3>
        <h2 className="text-2xl md:text-3xl font-bold mb-10">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map Projects */}
          {/* Example static card output */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-all">
            <h4 className="text-lg font-bold text-white mb-2">Project Showcase</h4>
            <p className="text-slate-400 text-sm mb-4">High performance full-stack application built with React and Tailwind CSS.</p>
            <div className="flex gap-2">
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-mono">React</span>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-mono">Tailwind</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}`;
}

export async function downloadPortfolioZip(portfolioData) {
  const zip = new JSZip();

  // 1. package.json
  zip.file("package.json", JSON.stringify({
    "name": "portfolio-source",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "lucide-react": "^0.300.0"
    },
    "devDependencies": {
      "@types/react": "^18.2.43",
      "@types/react-dom": "^18.2.17",
      "@vitejs/plugin-react": "^4.2.1",
      "autoprefixer": "^10.4.16",
      "postcss": "^8.4.32",
      "tailwindcss": "^3.4.0",
      "vite": "^5.0.8"
    }
  }, null, 2));

  // 2. index.html
  zip.file("index.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Portfolio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`);

  // 3. vite.config.js
  zip.file("vite.config.js", `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`);

  // 4. tailwind.config.js
  zip.file("tailwind.config.js", `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`);

  // 5. postcss.config.js
  zip.file("postcss.config.js", `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`);

  // 6. src/main.jsx
  zip.file("src/main.jsx", `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`);

  // 7. src/index.css
  zip.file("src/index.css", `@tailwind base;
@tailwind components;
@tailwind utilities;`);

  // 8. src/App.jsx (Using the existing generator for simplicity and robustness)
  zip.file("src/App.jsx", generatePortfolioReactCode(portfolioData));

  // Generate ZIP and trigger download
  const content = await zip.generateAsync({ type: "blob" });
  
  // Create a temporary anchor element to trigger the download
  const url = window.URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'portfolio-source.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
