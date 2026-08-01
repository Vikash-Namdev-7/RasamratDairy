import axiosClient from './axiosClient';

export const notificationsApi = {
  getMyNotifications: () => axiosClient.get('/notifications/me'),
  getAdminNotifications: () => axiosClient.get('/notifications/admin'),
  markAsRead: (id) => axiosClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => axiosClient.patch('/notifications/read-all')
};

export default notificationsApi;
