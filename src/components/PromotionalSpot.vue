<template>
  <div class="spot">
    <a :href="spot.link">
      <img :src="spot.image.imageUrl" :alt="spot.image.alt" />
    </a>
  </div>
</template>

<script>
export default {
  props: {
    spot: Object,
    position: String,
  },
};
</script>

<style scoped>
.spot img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
</style>
