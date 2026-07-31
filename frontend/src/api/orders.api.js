import axiosClient from './axiosClient';

export const ordersApi = {
  createOrder: (data) => axiosClient.post('/orders', data),
  getMyOrders: () => axiosClient.get('/orders/my'),
  getOrderById: (id) => axiosClient.get(`/orders/${id}`)
};

export default ordersApi;
