import api from './api';

export const getPublishedPosts = async (params) => {
  const { data } = await api.get('/blog', { params });
  return data;
};

export const getAllBlogPosts = async () => {
  const { data } = await api.get('/blog');
  return data;
};

export const getPostBySlug = async (slug) => {
  const { data } = await api.get(`/blog/${slug}`);
  return data;
};

export const createBlogPost = async (formData) => {
  const response = await api.post('/blog', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateBlogPost = async (id, formData) => {
  const response = await api.put(`/blog/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteBlogPost = async (id) => {
  const response = await api.delete(`/blog/${id}`);
  return response.data;
};
