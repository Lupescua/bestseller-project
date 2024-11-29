<template>
  <div class="pdp">
    <div class="pdp-image">
      <img :src="product?.images?.[0] || $fallbackImage" :alt="productName" />
    </div>
    <div class="pdp-info">
      <h1 class="product-name">{{ productName }}</h1>
      <p class="product-price">
        {{ product?.price ? product.price + ' DKK' : 'Price not available' }}
      </p>
      <div class="product-in-stock">
        <p v-if="product?.stock > 0">In Stock: {{ product.stock }}</p>
        <p v-else>Out of Stock</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import data from '../assets/data.json';

export default {
  setup() {
    const route = useRoute();
    const product = ref(null);

    const fetchProductById = (id) => {
      const foundProduct = data.products.find((prod) => prod.id === Number(id));
      if (foundProduct) {
        product.value = foundProduct;
      } else {
        console.error(`Product with ID ${id} not found.`);
      }
    };

    const productName = computed(
      () =>
        product.value?.name?.en ||
        product.value?.name?.dk ||
        'Product Not Found'
    );

    onMounted(() => {
      const productId = route.params.id;
      if (productId) {
        fetchProductById(productId);
      } else {
        console.error('No product ID provided in route params.');
      }
    });

    return { product, productName };
  },
};
</script>

<style scoped>
.pdp {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.pdp-image {
  flex: 1;
}

.pdp-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.pdp-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.product-name {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.product-price {
  font-size: 1.5rem;
  color: #444;
  margin-bottom: 5px;
}

.product-in-stock {
  font-size: 1rem;
  color: #666;
}

/* Responsive Design */
@media (min-width: 768px) {
  .pdp {
    flex-direction: row;
    align-items: center;
  }

  .pdp-image {
    max-width: 40%;
  }

  .pdp-info {
    max-width: 60%;
    padding-left: 20px;
  }
}

@media (max-width: 767px) {
  .pdp {
    flex-direction: column;
  }

  .pdp-image {
    max-width: 100%;
  }

  .pdp-info {
    width: 100%;
    text-align: center;
  }

  .product-name {
    font-size: 1.8rem;
  }
}
</style>
