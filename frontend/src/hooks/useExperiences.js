import { useApi } from './useApi';
import { getExperiences } from '../services/experienceService';

export const useExperiences = () => {
  return useApi(getExperiences);
};
