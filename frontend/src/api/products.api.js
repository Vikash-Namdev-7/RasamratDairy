import { products } from '../features/customer/data/products';
import { categories } from '../features/customer/data/categories';

export const productsApi = {
  getProducts: async () => products,
  getProductById: async (id) => products.find((p) => p.id === id),
  getCategories: async () => categories,
};

export default productsApi;
