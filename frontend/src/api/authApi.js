import axiosInstance from './axiosInstance';

export const authApi = {
    login: (username, password) =>
        axiosInstance.post('/auth/login', { username, password }),
    getMe: () => axiosInstance.get('/auth/me'),
};

export default authApi;
