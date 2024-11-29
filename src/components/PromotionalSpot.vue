<template>
  <div class="promotional-spot">
    <a v-if="spot.link" target="_blank" rel="noopener noreferrer">
      <img :src="imageUrl" :alt="imageAlt" />
    </a>
    <img v-else :src="imageUrl" :alt="imageAlt" />
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';

export default defineComponent({
  props: {
    spot: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const imageUrl = computed(() => props.spot.image?.imageUrl || '');
    const imageAlt = computed(
      () => props.spot.image?.alt || 'Promotional Image'
    );

    return {
      imageUrl,
      imageAlt,
    };
  },
});
</script>

<style scoped>
.promotional-spot img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
</style>
