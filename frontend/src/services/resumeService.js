import api from './api';

export const uploadResume = async (formData) => {
  const { data } = await api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const getResume = async () => {
  const { data } = await api.get('/resume');
  return data;
};

export const deleteResume = async () => {
  const { data } = await api.delete('/resume');
  return data;
};
