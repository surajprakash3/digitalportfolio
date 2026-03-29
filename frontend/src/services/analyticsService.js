import api from './api';

export const getAnalyticsSummary = async (days = 30) => {
  const { data } = await api.get('/analytics/summary', { params: { days } });
  return data;
};

export const getPageViews = async () => {
  const { data } = await api.get('/analytics/pageviews');
  return data;
};

export const trackPageView = async (page) => {
  let visitorId = localStorage.getItem('portfolio_visitor_id');
  if (!visitorId) {
    visitorId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('portfolio_visitor_id', visitorId);
  }
  const { data } = await api.post('/analytics/track', { page, visitorId });
  return data;
};
