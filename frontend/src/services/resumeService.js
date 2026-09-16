import api from './api';

export const uploadResume = async (formData) => {
  const { data } = await api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const getResume = async () => {
  const { data } = await api.get('/resume/status');
  return data;
};

export const getResumeDownloadUrl = (directUrl) => {
  if (directUrl && directUrl.trim().startsWith('http')) {
    return directUrl.trim();
  }
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return `${apiUrl}/resume/download`;
};

export const downloadResume = (directUrl) => {
  const url = getResumeDownloadUrl(directUrl);
  window.open(url, '_blank');
};
