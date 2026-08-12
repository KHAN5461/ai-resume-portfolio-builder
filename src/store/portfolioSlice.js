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
    seo: {
      metaTitle: "Portfolio",
      metaDescription: "My professional portfolio",
      ogImage: ""
    }
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
    }
  },
});

export const { createPortfolio, setCurrentPortfolio, updateHeroSection, updateAboutSection, updatePortfolioData } = portfolioSlice.actions;
export default portfolioSlice.reducer;
