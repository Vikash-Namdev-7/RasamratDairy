import axiosClient from './axiosClient';

export const productsApi = {
  getProducts: (params) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return axiosClient.get(`/products${queryString}`);
  },
  getProductById: (id) => axiosClient.get(`/products/${id}`),
  getCategories: (params) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return axiosClient.get(`/categories${queryString}`);
  }
};

export default productsApi;
