/**
 * Unified GlobalApi delegating to StorageService with active Firestore cloud sync
 */
import StorageService, { migrateResumeSchema, migratePortfolioSchema } from '../src/service/StorageService';

export const GetUserResumes = async (userEmail) => {
  const data = await StorageService.getUserResumes(userEmail);
  return { data: { data } };
};

export const GetUserPortfolios = async (userEmail) => {
  const data = await StorageService.getUserPortfolios(userEmail);
  return { data: { data } };
};

export const CreateNewResume = async (payload) => {
  const created = await StorageService.createResume(payload);
  return { data: { data: created } };
};

export const CreateNewPortfolio = async (payload) => {
  const created = await StorageService.createPortfolio(payload);
  return { data: { data: created } };
};

export const GetResumeById = async (id) => {
  const resume = await StorageService.getResumeById(id);
  return { data: { data: resume } };
};

export const GetPortfolioById = async (id) => {
  const portfolio = await StorageService.getPortfolioById(id);
  return { data: { data: portfolio } };
};

export const UpdateResumeDetail = async (id, payload) => {
  const updated = await StorageService.updateResume(id, payload.data);
  return { data: { data: updated } };
};

export const UpdatePortfolioDetail = async (id, payload) => {
  const updated = await StorageService.updatePortfolio(id, payload.data);
  return { data: { data: updated } };
};

export const DeleteResumeById = async (id) => {
  await StorageService.deleteResume(id);
  return { data: { data: { success: true } } };
};

export const DeletePortfolioById = async (id) => {
  await StorageService.deletePortfolio(id);
  return { data: { data: { success: true } } };
};

export const IncrementPortfolioViews = async (id) => {
  const views = await StorageService.incrementPortfolioViews(id);
  return { data: { success: true, views } };
};

export default {
  GetUserResumes,
  GetUserPortfolios,
  CreateNewResume,
  CreateNewPortfolio,
  GetResumeById,
  GetPortfolioById,
  UpdateResumeDetail,
  UpdatePortfolioDetail,
  DeleteResumeById,
  DeletePortfolioById,
  IncrementPortfolioViews
};