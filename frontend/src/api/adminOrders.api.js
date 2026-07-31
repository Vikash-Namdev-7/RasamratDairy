import axiosClient from './axiosClient';

export const adminOrdersApi = {
  getOrders: (status) => axiosClient.get(`/admin/orders${status && status !== 'all' ? '?status=' + status : ''}`),
  updateStatus: (id, data) => axiosClient.patch(`/admin/orders/${id}/status`, data)
};

export default adminOrdersApi;
