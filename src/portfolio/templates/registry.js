/**
 * Portfolio Template Auto-Registration Engine
 * 
 * Auto-discovers any React template dropped into `src/portfolio/templates/custom/`
 * via Vite's `import.meta.glob`, and merges with the built-in system templates.
 */

import ModernTemplate from './ModernTemplate';
import MinimalistTemplate from './MinimalistTemplate';
import CreativeTemplate from './CreativeTemplate';
import BentoTemplate from './BentoTemplate';
import MagazineTemplate from './MagazineTemplate';

// 1. Built-in Core Templates
const BUILT_IN_TEMPLATES = [
  {
    id: 'bento',
    name: 'Bento Grid',
    description: 'High-contrast modular grid layout inspired by modern tech interfaces.',
    category: 'Product & Tech',
    badge: 'Popular',
    component: BentoTemplate,
    isCustom: false
  },
  {
    id: 'modern',
    name: 'Modern Clean',
    description: 'Polished portfolio with rich interactive cards and full-width layout.',
    category: 'Engineering',
    badge: 'Standard',
    component: ModernTemplate,
    isCustom: false
  },
  {
    id: 'minimalist',
    name: 'Minimalist Editorial',
    description: 'Refined Swiss-style typography with generous whitespace.',
    category: 'Design & Writing',
    badge: 'Clean',
    component: MinimalistTemplate,
    isCustom: false
  },
  {
    id: 'creative',
    name: 'Creative Showcase',
    description: 'Expressive gradient visual styling designed for artists and innovators.',
    category: 'Creative Arts',
    badge: 'Vibrant',
    component: CreativeTemplate,
    isCustom: false
  },
  {
    id: 'magazine',
    name: 'Magazine Edition',
    description: 'Sophisticated multi-column editorial style for thought leaders.',
    category: 'Executive & Editorial',
    badge: 'Editorial',
    component: MagazineTemplate,
    isCustom: false
  }
];

// 2. Dynamic Auto-Discovery of User Uploaded Custom Templates
const customModules = import.meta.glob('./custom/*.{jsx,tsx}', { eager: true });

function formatFilenameToTitle(fileName) {
  return fileName
    .replace(/Template\.(jsx|tsx)$/, '')
    .replace(/\.(jsx|tsx)$/, '')
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .trim();
}

function formatFilenameToId(fileName) {
  return fileName
    .replace(/Template\.(jsx|tsx)$/, '')
    .replace(/\.(jsx|tsx)$/, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

const discoveredCustomTemplates = Object.entries(customModules)
  .map(([path, module]) => {
    const Component = module.default;
    if (!Component) return null;

    const rawFileName = path.split('/').pop() || '';
    const meta = module.templateMetadata || {};

    const id = meta.id || formatFilenameToId(rawFileName);
    const name = meta.name || formatFilenameToTitle(rawFileName);
    const description = meta.description || 'Custom uploaded portfolio template.';
    const category = meta.category || 'Custom Uploads';
    const badge = meta.badge || 'Uploaded';

    return {
      id,
      name,
      description,
      category,
      badge,
      component: Component,
      isCustom: true,
      filePath: path
    };
  })
  .filter(Boolean);

// 3. Combined Template Registry
export const ALL_PORTFOLIO_TEMPLATES = [
  ...BUILT_IN_TEMPLATES,
  ...discoveredCustomTemplates
];

export function getAllPortfolioTemplates() {
  return ALL_PORTFOLIO_TEMPLATES;
}

export function getPortfolioTemplateById(id) {
  if (!id) return ALL_PORTFOLIO_TEMPLATES[0];
  const normalizedId = String(id).toLowerCase().trim();
  
  const found = ALL_PORTFOLIO_TEMPLATES.find(
    t => t.id.toLowerCase() === normalizedId || (normalizedId === 'default' && t.id === 'modern')
  );

  return found || ALL_PORTFOLIO_TEMPLATES[0];
}

export default ALL_PORTFOLIO_TEMPLATES;
