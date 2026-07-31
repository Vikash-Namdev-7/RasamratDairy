import axiosClient from './axiosClient';

export const adminCategoriesApi = {
  getCategories: () => axiosClient.get('/admin/categories'),
  createCategory: (data) => axiosClient.post('/admin/categories', data),
  updateCategory: (id, data) => axiosClient.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => axiosClient.delete(`/admin/categories/${id}`)
};

export default adminCategoriesApi;
