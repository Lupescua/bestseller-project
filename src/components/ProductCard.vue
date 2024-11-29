<template>
  <router-link :to="`/product/${product.id}`" class="product-card">
    <img :src="productImage" :alt="productName" class="product-image" />
    <h3>{{ productName }}</h3>
    <p v-if="product?.price">{{ product.price }} DKK</p>
    <p v-else>Price not available</p>
  </router-link>
</template>

<script>
import { computed, defineComponent } from 'vue';
import fallbackImage from '../assets/fallback-image.png';

export default defineComponent({
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const productImage = computed(
      () => props.product?.images?.[0] || fallbackImage
    );
    const productName = computed(
      () =>
        props.product?.name?.en || props.product?.name?.dk || 'Unnamed Product'
    );

    return {
      productImage,
      productName,
    };
  },
});
</script>

<style scoped>
.product-card:hover {
  transform: scale(1.05);
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
</style>
