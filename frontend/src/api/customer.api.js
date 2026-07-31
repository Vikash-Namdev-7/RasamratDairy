import axiosClient from './axiosClient';

export const customerApi = {
  getProfile: () => axiosClient.get('/customers/me'),
  updateProfile: (data) => axiosClient.put('/customers/me', data),
  addAddress: (data) => axiosClient.post('/customers/me/addresses', data),
  updateAddress: (id, data) => axiosClient.put(`/customers/me/addresses/${id}`, data),
  deleteAddress: (id) => axiosClient.delete(`/customers/me/addresses/${id}`)
};

export default customerApi;
