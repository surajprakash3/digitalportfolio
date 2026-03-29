import { useApi } from './useApi';
import { getCertifications } from '../services/certificationService';

export const useCertifications = () => {
  return useApi(getCertifications);
};
