import api from './api';

export const getCertifications = async () => {
  const response = await api.get('/certifications');
  return response.data;
};

export const createCertification = async (formData) => {
  const response = await api.post('/certifications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateCertification = async (id, formData) => {
  const response = await api.put(`/certifications/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteCertification = async (id) => {
  const response = await api.delete(`/certifications/${id}`);
  return response.data;
};
