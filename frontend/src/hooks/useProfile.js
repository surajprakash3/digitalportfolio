import { useApi } from './useApi';
import { getProfile } from '../services/profileService';

export const useProfile = () => {
  return useApi(getProfile);
};
