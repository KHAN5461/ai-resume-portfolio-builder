import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  resumeData: {
    personalInfo: {
      fullName: "",
      targetTitle: "",
      email: "",
      phone: "",
      location: "",
      portfolioUrl: "",
      githubUrl: "",
      linkedinUrl: ""
    },
    professionalSummary: "",
    workExperience: [],
    projects: [],
    education: [],
    skills: {
      languages: [],
      frameworksAndLibraries: [],
      databasesAndTools: []
    },
    certifications: []
  },
  portfolioData: {
    // Basic placeholder for portfolio state, can be populated later
  }
};

export const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setResumeData: (state, action) => {
      state.resumeData = action.payload;
    },
    setPortfolioData: (state, action) => {
      state.portfolioData = action.payload;
    },
    importAIState: (state, action) => {
      if (action.payload.resumeData) {
        state.resumeData = {
          ...state.resumeData,
          ...action.payload.resumeData,
          personalInfo: { ...(state.resumeData?.personalInfo || {}), ...(action.payload.resumeData?.personalInfo || {}) },
          skills: { ...(state.resumeData?.skills || {}), ...(action.payload.resumeData?.skills || {}) }
        };
      }
      if (action.payload.portfolioData) {
        state.portfolioData = {
          ...state.portfolioData,
          ...action.payload.portfolioData
        };
      }
    }
  },
});

export const { setResumeData, setPortfolioData, importAIState } = resumeSlice.actions;

export default resumeSlice.reducer;
