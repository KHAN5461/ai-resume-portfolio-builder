import JSZip from 'jszip';

// Vite Glob Imports to fetch raw source code of the exact portfolio components and templates
const componentFiles = import.meta.glob('../portfolio/components/*.jsx', { query: '?raw', import: 'default', eager: true });
const templateFiles = import.meta.glob('../portfolio/templates/*.jsx', { query: '?raw', import: 'default', eager: true });

export function generatePortfolioReactCode(portfolioData) {
  // We keep this as a simple fallback if ever needed, but the ZIP now uses exact source code.
  return `import React from 'react';\n\nexport default function Portfolio() { return <div>Basic Portfolio Export</div>; }`;
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
      "lucide-react": "^0.300.0",
      "framer-motion": "^11.0.0"
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${portfolioData?.title || 'My Portfolio'}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`);

  // 3. vite.config.js
  zip.file("vite.config.js", `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`);

  // 4. tailwind.config.js
  zip.file("tailwind.config.js", `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
@tailwind utilities;

.dark {
  background-color: #020617; /* slate-950 */
  color: #f1f5f9; /* slate-100 */
}
`);

  // 8. src/data.json - The actual injected portfolio data
  zip.file("src/data.json", JSON.stringify(portfolioData, null, 2));

  // 9. Add all components dynamically
  Object.keys(componentFiles).forEach((path) => {
    const filename = path.split('/').pop();
    zip.file(`src/components/${filename}`, componentFiles[path]);
  });

  // 10. Add all templates dynamically
  Object.keys(templateFiles).forEach((path) => {
    const filename = path.split('/').pop();
    zip.file(`src/templates/${filename}`, templateFiles[path]);
  });

  // 11. src/App.jsx - Acts as the standalone portfolio index
  zip.file("src/App.jsx", `import React from 'react';
import portfolioData from './data.json';
import PortfolioNav from './components/PortfolioNav';
import PortfolioFooter from './components/PortfolioFooter';
import ModernTemplate from './templates/ModernTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import BentoTemplate from './templates/BentoTemplate';

export default function App() {
  const themePreset = portfolioData.siteConfig?.themePreset || 'bento';
  const themeMode = portfolioData.siteConfig?.themeMode || 'light';
  const style = { '--accent': portfolioData.siteConfig?.accentColor || '#6366f1' };

  return (
    <div className={\`min-h-screen relative \${themeMode === 'dark' ? 'dark bg-slate-950 text-white' : ''}\`} style={style}>
      
      {/* Navigation */}
      <PortfolioNav data={portfolioData} blocks={portfolioData.siteConfig?.layout || []} />

      {/* Dynamic Template Engine */}
      <div className={themeMode === 'dark' ? 'dark' : ''}>
        {themePreset === 'bento' && <BentoTemplate portfolioData={portfolioData} />}
        {themePreset === 'minimalist' && <MinimalistTemplate portfolioData={portfolioData} />}
        {themePreset === 'creative' && <CreativeTemplate portfolioData={portfolioData} />}
        {(themePreset === 'modern' || themePreset === 'default') && <ModernTemplate portfolioData={portfolioData} />}
      </div>

      {/* Footer */}
      <PortfolioFooter data={portfolioData} />
    </div>
  );
}
`);

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
