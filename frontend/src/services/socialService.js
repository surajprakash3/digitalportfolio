import api from './api';

export const getSocials = async () => {
  const response = await api.get('/socials');
  return response.data;
};

export const createSocial = async (formData) => {
  const response = await api.post('/socials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateSocial = async (id, formData) => {
  const response = await api.put(`/socials/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteSocial = async (id) => {
  const response = await api.delete(`/socials/${id}`);
  return response.data;
};
