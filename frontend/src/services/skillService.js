import api from './api';

export const getSkills = async () => {
  const response = await api.get('/skills');
  return response.data;
};

export const createSkill = async (formData) => {
  const response = await api.post('/skills', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateSkill = async (id, formData) => {
  const response = await api.put(`/skills/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteSkill = async (id) => {
  const response = await api.delete(`/skills/${id}`);
  return response.data;
};
