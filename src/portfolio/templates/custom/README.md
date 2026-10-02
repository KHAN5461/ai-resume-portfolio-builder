# Custom Portfolio Templates Directory

Upload or add your custom React JSX/TSX portfolio templates directly into this folder:
`src/portfolio/templates/custom/`

Any file added here is **automatically discovered and registered** by the template engine without requiring manual imports!

---

## Template Contract

Each template should be a React component that receives `portfolioData` as its main prop:

```jsx
import React from 'react';

// Optional: Custom display metadata
export const templateMetadata = {
  id: 'my-custom-template',      // Unique ID (defaults to kebab-case filename)
  name: 'My Custom Template',    // Human-readable title
  description: 'A stylish bespoke portfolio template.',
  category: 'Modern',           // Category in gallery
  badge: 'Custom'               // Optional pill badge
};

export default function MyCustomTemplate({ portfolioData }) {
  const {
    personalInfo = {},
    projects = [],
    skills = [],
    experience = [],
    education = [],
    siteConfig = {}
  } = portfolioData || {};

  return (
    <div className="min-h-screen py-16 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold">{personalInfo.name || 'Your Name'}</h1>
      <p className="text-lg text-slate-500">{personalInfo.title || 'Professional Title'}</p>
      
      {/* Your custom layout, sections, animations, and typography */}
    </div>
  );
}
```

---

## Standard `portfolioData` Structure

- `personalInfo`:
  - `name`: string
  - `title`: string
  - `bio`: string
  - `location`: string
  - `email`: string
  - `phone`: string
  - `avatarUrl`: string
  - `socialLinks`: array of `{ platform, url }`
- `projects`: array of `{ id, title, description, tags, link, github, image }`
- `skills`: array of strings or `{ name, level, category }`
- `experience`: array of `{ id, role, company, duration, description, highlights }`
- `education`: array of `{ degree, institution, year, details }`
- `siteConfig`:
  - `accentColor`: hex code (e.g. `#6366f1`)
  - `themeMode`: `'light'` | `'dark'`
  - `themePreset`: template ID string
