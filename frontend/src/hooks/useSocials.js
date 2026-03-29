import { useApi } from './useApi';
import { getSocials } from '../services/socialService';

export const useSocials = () => {
  return useApi(getSocials);
};
