import axiosClient from './axiosClient';

export const adminProductsApi = {
  getProducts: () => axiosClient.get('/admin/products'),
  createProduct: (data) => axiosClient.post('/admin/products', data),
  updateProduct: (id, data) => axiosClient.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => axiosClient.delete(`/admin/products/${id}`),
  toggleStock: (id) => axiosClient.patch(`/admin/products/${id}/stock`, {})
};

export default adminProductsApi;
