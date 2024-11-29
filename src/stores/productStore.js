import { defineStore } from 'pinia';
import data from '../assets/data.json';

export const useProductStore = defineStore('productStore', {
  state: () => ({
    products: data.products, // Initialize with data from JSON
    selectedProduct: null,
  }),
  actions: {
    // Fetch a product by ID
    fetchProductById(id) {
      this.selectedProduct = this.products.find(
        (product) => product.id === Number(id)
      );
      if (!this.selectedProduct) {
        console.error(`Product with ID ${id} not found.`);
      }
    },
  },
});
