import axiosClient from './axiosClient';

export const subscriptionsApi = {
  createSubscription: (data) => axiosClient.post('/subscriptions', data),
  getMySubscriptions: () => axiosClient.get('/subscriptions/my'),
  togglePauseDate: (id, date) => axiosClient.patch(`/subscriptions/${id}/pause-toggle`, { date }),
  cancelSubscription: (id) => axiosClient.patch(`/subscriptions/${id}/cancel`, {})
};

export default subscriptionsApi;
