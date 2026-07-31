import axiosClient from './axiosClient';

export const adminLogin = (data) => axiosClient.post('/auth/admin/login', data);
