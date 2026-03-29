import { useApi } from './useApi';
import { getSkills } from '../services/skillService';

export const useSkills = () => {
  return useApi(getSkills);
};
