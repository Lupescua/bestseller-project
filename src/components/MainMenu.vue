<template>
  <header class="header">
    <div>
      <nav class="breadcrumbs">
        <span v-for="(crumb, index) in breadcrumbs" :key="index">
          <a
            href="#"
            @click.prevent="selectCategory(crumb.id)"
            class="breadcrumb-link"
          >
            {{ crumb.name }}
          </a>
          <span v-if="index < breadcrumbs.length - 1"> / </span>
        </span>
      </nav>
    </div>
  </header>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    breadcrumbs: Array,
  },
  emits: ['categorySelected'],
  setup(props, { emit }) {
    const selectCategory = (categoryId) => {
      emit('categorySelected', categoryId);
    };

    return {
      selectCategory,
    };
  },
});
</script>

<style scoped>
.breadcrumbs {
  margin-bottom: 20px;
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}
.category-card {
  text-align: center;
  cursor: pointer;
}
.back-button {
  margin-top: 20px;
}
</style>
