<template>
  <div class="card">
    <img
      :src="product?.images?.[0] || fallbackImage"
      :alt="product?.name?.en || product?.name?.dk || 'Unnamed Product'"
      class="max-w-md"
    />
    <h3>{{ product?.name?.en || product?.name?.dk || 'Unnamed Product' }}</h3>
    <p>{{ product?.price ? product.price + ' DKK' : 'Price not available' }}</p>
  </div>
</template>

<script>
import fallbackImage from '@/assets/fallback-image.png';

export default {
  props: {
    product: Object,
  },
  data() {
    return {
      fallbackImage,
    };
  },
};
</script>

<style scoped>
.card img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
</style>
