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

      <div class="category-grid">
        <div
          v-for="category in currentCategories"
          :key="category.id"
          class="category-card"
          @click="selectCategory(category.id)"
        >
          <img
            :src="category.image"
            alt="Category Image"
            class="category-image"
          />
          <h3>{{ category.name.en }}</h3>
        </div>
      </div>

      <button v-if="showHomeButton" @click="goHome" class="back-button">
        Back to Home
      </button>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    categories: Array,
    breadcrumbs: Array,
    currentCategories: Array, // Already has precomputed images
    showHomeButton: Boolean,
  },
  emits: ['categorySelected', 'goHome'],
  methods: {
    selectCategory(categoryId) {
      this.$emit('categorySelected', categoryId);
    },
    goHome() {
      this.$emit('goHome');
    },
  },
};
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
