<template>
  <div class="promotional-spot" :style="{ gridArea: position }">
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

<style>
/* Add basic styling */
</style>
