import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  personalInfo: {},
  workExperience: [],
  projects: [],
  education: [],
  skills: {
    languages: [],
    frameworksAndLibraries: [],
    databasesAndTools: []
  },
  certifications: []
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      return action.payload;
    },
    updatePersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    addWorkExperience: (state, action) => {
      state.workExperience.push(action.payload);
    },
    updateWorkExperience: (state, action) => {
      const { index, data } = action.payload;
      if (state.workExperience[index]) {
        state.workExperience[index] = { ...state.workExperience[index], ...data };
      }
    },
    removeWorkExperience: (state, action) => {
      state.workExperience.splice(action.payload, 1);
    },
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action) => {
      const { index, data } = action.payload;
      if (state.projects[index]) {
        state.projects[index] = { ...state.projects[index], ...data };
      }
    },
    removeProject: (state, action) => {
      state.projects.splice(action.payload, 1);
    },
    addEducation: (state, action) => {
      state.education.push(action.payload);
    },
    updateEducation: (state, action) => {
      const { index, data } = action.payload;
      if (state.education[index]) {
        state.education[index] = { ...state.education[index], ...data };
      }
    },
    removeEducation: (state, action) => {
      state.education.splice(action.payload, 1);
    },
    updateSkills: (state, action) => {
      state.skills = { ...state.skills, ...action.payload };
    },
    addCertification: (state, action) => {
      state.certifications.push(action.payload);
    },
    updateCertification: (state, action) => {
      const { index, data } = action.payload;
      if (state.certifications[index]) {
        state.certifications[index] = { ...state.certifications[index], ...data };
      }
    },
    removeCertification: (state, action) => {
      state.certifications.splice(action.payload, 1);
    },
    updateProfileData: (state, action) => {
      const data = action.payload;
      if (data.personalInfo) state.personalInfo = { ...state.personalInfo, ...data.personalInfo };
      if (data.workExperience) state.workExperience = data.workExperience;
      if (data.projects) state.projects = data.projects;
      if (data.education) state.education = data.education;
      if (data.skills) state.skills = { ...state.skills, ...data.skills };
      if (data.certifications) state.certifications = data.certifications;
    }
  }
});

export const {
  setProfileData,
  updatePersonalInfo,
  addWorkExperience,
  updateWorkExperience,
  removeWorkExperience,
  addProject,
  updateProject,
  removeProject,
  addEducation,
  updateEducation,
  removeEducation,
  updateSkills,
  addCertification,
  updateCertification,
  removeCertification,
  updateProfileData
} = profileSlice.actions;

export default profileSlice.reducer;
