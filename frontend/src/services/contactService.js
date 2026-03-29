import api from './api';

export const sendMessage = async (formData) => {
  const { data } = await api.post('/contact', formData);
  return data;
};
