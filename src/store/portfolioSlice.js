import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  portfolios: {}, // Store multiple portfolios keyed by portfolioId
  currentPortfolioId: null,
};

// Default empty portfolio schema
const defaultPortfolioData = {
  title: "Untitled Portfolio",
  siteConfig: {
    themePreset: "default",
    accentColor: "#6366f1",
    enableAnimations: true,
    themeMode: "light",
    seo: {
      metaTitle: "Portfolio",
      metaDescription: "My professional portfolio",
      ogImage: ""
    },
    layout: [
      { id: 'hero', visible: true, name: 'Hero' },
      { id: 'about', visible: true, name: 'About' },
      { id: 'projects', visible: true, name: 'Projects' },
      { id: 'skills', visible: true, name: 'Skills' },
      { id: 'contact', visible: true, name: 'Contact' }
    ]
  },
  heroSection: {
    greeting: "",
    headline: "",
    subheadline: "",
    primaryCta: { text: "", link: "" },
    secondaryCta: { text: "", link: "" },
    terminalCodeSnippet: ""
  },
  aboutSection: {
    bioTitle: "",
    bioDescription: "",
    stats: []
  },
  projectsSection: [],
  skillsSection: {
    categories: []
  },
  communitySection: {
    title: "",
    items: []
  },
  contactSection: {
    heading: "",
    subheading: "",
    email: "",
    socialLinks: []
  }
};

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    createPortfolio: (state, action) => {
      const { id, title } = action.payload;
      state.portfolios[id] = { ...defaultPortfolioData, title: title || "Untitled Portfolio" };
    },
    setCurrentPortfolio: (state, action) => {
      state.currentPortfolioId = action.payload;
      if (!state.portfolios[action.payload]) {
         state.portfolios[action.payload] = { ...defaultPortfolioData };
      }
    },
    updateHeroSection: (state, action) => {
      const { id, data } = action.payload;
      if (state.portfolios[id]) {
        state.portfolios[id].heroSection = { ...state.portfolios[id].heroSection, ...data };
      }
    },
    updateAboutSection: (state, action) => {
      const { id, data } = action.payload;
      if (state.portfolios[id]) {
        state.portfolios[id].aboutSection = { ...state.portfolios[id].aboutSection, ...data };
      }
    },
    // We can add more specific reducers later, or a generic one:
    updatePortfolioData: (state, action) => {
      const { id, data } = action.payload;
      const current = state.portfolios[id] || { ...defaultPortfolioData };
      state.portfolios[id] = {
        ...current,
        ...data,
        heroSection: { ...defaultPortfolioData.heroSection, ...(current.heroSection || {}), ...(data.heroSection || {}) },
        aboutSection: { ...defaultPortfolioData.aboutSection, ...(current.aboutSection || {}), ...(data.aboutSection || {}) },
        siteConfig: { ...defaultPortfolioData.siteConfig, ...(current.siteConfig || {}), ...(data.siteConfig || {}) },
        contactSection: { ...defaultPortfolioData.contactSection, ...(current.contactSection || {}), ...(data.contactSection || {}) },
        projectsSection: data.projectsSection || current.projectsSection || defaultPortfolioData.projectsSection,
        skillsSection: data.skillsSection || current.skillsSection || defaultPortfolioData.skillsSection,
      };
    },
    moveBlockUp: (state, action) => {
      const { portfolioId, blockId } = action.payload;
      const portfolio = state.portfolios[portfolioId];
      if (portfolio && portfolio.siteConfig && portfolio.siteConfig.layout) {
        const layout = portfolio.siteConfig.layout;
        const index = layout.findIndex(b => b.id === blockId);
        if (index > 0) {
          const temp = layout[index];
          layout[index] = layout[index - 1];
          layout[index - 1] = temp;
        }
      }
    },
    moveBlockDown: (state, action) => {
      const { portfolioId, blockId } = action.payload;
      const portfolio = state.portfolios[portfolioId];
      if (portfolio && portfolio.siteConfig && portfolio.siteConfig.layout) {
        const layout = portfolio.siteConfig.layout;
        const index = layout.findIndex(b => b.id === blockId);
        if (index >= 0 && index < layout.length - 1) {
          const temp = layout[index];
          layout[index] = layout[index + 1];
          layout[index + 1] = temp;
        }
      }
    }
  },
});

export const { createPortfolio, setCurrentPortfolio, updateHeroSection, updateAboutSection, updatePortfolioData, moveBlockUp, moveBlockDown } = portfolioSlice.actions;
export default portfolioSlice.reducer;
