import { useApi } from './useApi';
import * as resumeService from '../services/resumeService';

export const useResume = () => {
  return useApi(resumeService.getResume);
};
