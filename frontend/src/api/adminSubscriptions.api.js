import axiosClient from './axiosClient';

export const adminSubscriptionsApi = {
  getSubscriptions: (params) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return axiosClient.get(`/admin/subscriptions${queryString}`);
  },
  toggleStatus: (id) => axiosClient.patch(`/admin/subscriptions/${id}/toggle-status`, {}),
  cancelSubscription: (id) => axiosClient.patch(`/admin/subscriptions/${id}/cancel`, {})
};

export default adminSubscriptionsApi;
