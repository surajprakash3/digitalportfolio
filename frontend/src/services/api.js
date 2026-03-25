import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('portfolio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('portfolio_user');
      localStorage.removeItem('portfolio_token');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const cachedGet = async (url, options = {}) => {
  const cacheKey = url + JSON.stringify(options.params || {});
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const response = await api.get(url, options);
  cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
  return response.data;
};

export const clearCache = () => cache.clear();

// ===== Public API =====
export const getProjects = () => cachedGet('/projects');
export const getSkills = () => cachedGet('/skills');
export const getExperiences = () => cachedGet('/experience');
export const getPublishedPosts = (params) => cachedGet('/blog', { params });
export const getPostBySlug = (slug) => cachedGet(`/blog/${slug}`);
export const getResumeStatus = () => cachedGet('/resume/status');
export const getProfile = () => cachedGet('/profile');
export const getCertifications = () => cachedGet('/certifications');
export const getSocials = () => cachedGet('/socials');

export const submitContact = async (data) => {
  const response = await api.post('/contact', data);
  return response.data;
};

export const sendChatMessage = async (message, history = []) => {
  const response = await api.post('/chat', { message, history });
  return response.data;
};

export const trackPageView = async (page) => {
  try {
    const visitorId = localStorage.getItem('portfolio_visitor') || 
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('portfolio_visitor', visitorId);
    await api.post('/analytics/track', { page, visitorId });
  } catch {
    // Silent fail for analytics
  }
};

// ===== Admin API =====
export const getAnalyticsSummary = (days) => cachedGet('/analytics/summary', { params: { days } });
export const getContacts = () => cachedGet('/contact');
export const getAllBlogPosts = () => cachedGet('/blog/admin/all');

export const updateProfile = async (formData) => {
  clearCache();
  const response = await api.put('/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const createProject = async (formData) => {
  clearCache();
  const response = await api.post('/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateProject = async (id, formData) => {
  clearCache();
  const response = await api.put(`/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteProject = async (id) => {
  clearCache();
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

export const createSkill = async (formData) => {
  clearCache();
  const response = await api.post('/skills', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateSkill = async (id, formData) => {
  clearCache();
  const response = await api.put(`/skills/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteSkill = async (id) => {
  clearCache();
  const response = await api.delete(`/skills/${id}`);
  return response.data;
};

export const createExperience = async (formData) => {
  clearCache();
  const response = await api.post('/experience', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateExperience = async (id, formData) => {
  clearCache();
  const response = await api.put(`/experience/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteExperience = async (id) => {
  clearCache();
  const response = await api.delete(`/experience/${id}`);
  return response.data;
};

export const createBlogPost = async (formData) => {
  clearCache();
  const response = await api.post('/blog', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateBlogPost = async (id, formData) => {
  clearCache();
  const response = await api.put(`/blog/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteBlogPost = async (id) => {
  clearCache();
  const response = await api.delete(`/blog/${id}`);
  return response.data;
};

export const deleteContact = async (id) => {
  clearCache();
  const response = await api.delete(`/contact/${id}`);
  return response.data;
};

export const uploadResume = async (formData) => {
  const response = await api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const createCertification = async (formData) => {
  clearCache();
  const response = await api.post('/certifications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateCertification = async (id, formData) => {
  clearCache();
  const response = await api.put(`/certifications/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteCertification = async (id) => {
  clearCache();
  const response = await api.delete(`/certifications/${id}`);
  return response.data;
};

export const createSocial = async (formData) => {
  clearCache();
  const response = await api.post('/socials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateSocial = async (id, formData) => {
  clearCache();
  const response = await api.put(`/socials/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteSocial = async (id) => {
  clearCache();
  const response = await api.delete(`/socials/${id}`);
  return response.data;
};

export default api;
