<template>
  <div class="pdp">
    <h1 class="product-name">{{ productName }}</h1>
    <img :src="productImage" :alt="productName" />
    <p class="product-price">{{ productPrice }}</p>
    <div class="product-in-stock">
      <p v-if="productInStock > 0">In Stock: {{ productInStock }}</p>
      <p v-else>Out of Stock</p>
    </div>
  </div>
</template>

<script>
import { useProductStore } from '../stores/productStore';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const productStore = useProductStore();
    const route = useRoute();

    onMounted(() => {
      const productId = route.params.id;
      if (productId) {
        productStore.fetchProductById(productId); // Fetch product from store
      }
    });

    const productName = computed(
      () => productStore.selectedProduct?.name?.en || 'Product Not Found'
    );
    const productImage = computed(
      () =>
        productStore.selectedProduct?.images?.[0] ||
        'https://via.placeholder.com/150'
    );
    const productPrice = computed(() =>
      productStore.selectedProduct?.price
        ? `${productStore.selectedProduct.price} DKK`
        : 'Price not available'
    );
    const productInStock = computed(
      () => productStore.selectedProduct?.stock || 0
    );

    return {
      productName,
      productImage,
      productPrice,
      productInStock,
    };
  },
};
</script>

<style scoped>
.pdp {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

img {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}

p {
  font-size: 18px;
  color: #333;
}
</style>
