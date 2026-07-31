import axiosClient from './axiosClient';

export const customerSignup = (data) => axiosClient.post('/auth/customer/signup', data);
export const customerLogin = (data) => axiosClient.post('/auth/customer/login', data);
