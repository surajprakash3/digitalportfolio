import { useApi } from './useApi';
import * as analyticsService from '../services/analyticsService';

export const useAnalytics = (days = 30) => {
  return useApi(() => analyticsService.getAnalyticsSummary(days), [days]);
};
