import axiosInstance from './axiosInstance';

export const imageApi = {
    getAll: () => axiosInstance.get('/images'),
    getById: (id) => axiosInstance.get(`/images/${id}`),
    create: (data) => axiosInstance.post('/images', data),
    update: (id, data) => axiosInstance.put(`/images/${id}`, data),
    delete: (id) => axiosInstance.delete(`/images/${id}`),
};

export default imageApi;
