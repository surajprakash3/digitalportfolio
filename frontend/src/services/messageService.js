import api from './api';

export const getMessages = async () => {
  const { data } = await api.get('/contact');
  return data;
};

export const deleteMessage = async (id) => {
  const { data } = await api.delete(`/contact/${id}`);
  return data;
};

export const markAsRead = async (id) => {
  const { data } = await api.put(`/contact/${id}/read`);
  return data;
};
