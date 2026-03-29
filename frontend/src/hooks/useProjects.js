import { useApi } from './useApi';
import { getProjects } from '../services/projectService';

export const useProjects = () => {
  return useApi(getProjects);
};
