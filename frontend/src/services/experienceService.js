import api from './api';

export const getExperiences = async () => {
  const response = await api.get('/experience');
  return response.data;
};

export const createExperience = async (formData) => {
  const response = await api.post('/experience', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateExperience = async (id, formData) => {
  const response = await api.put(`/experience/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteExperience = async (id) => {
  const response = await api.delete(`/experience/${id}`);
  return response.data;
};
