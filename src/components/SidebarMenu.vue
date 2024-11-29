<template>
  <aside class="sidebar-menu">
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
  </aside>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    categories: {
      type: Array,
      required: true,
    },
    currentCategories: {
      type: Array,
      required: true,
    },
    showHomeButton: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['categorySelected', 'goHome'],
  setup(props, { emit }) {
    const selectCategory = (categoryId) => {
      emit('categorySelected', categoryId);
    };

    const goHome = () => {
      emit('goHome');
    };

    return {
      selectCategory,
      goHome,
    };
  },
});
</script>

<style scoped>
.sidebar-menu {
  width: 250px;
  padding: 20px;
  border-right: 1px solid #ddd;
  background-color: #f9f9f9;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.category-card {
  text-align: center;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  transition: transform 0.2s ease;
}

.category-card:hover {
  transform: scale(1.05);
}

.category-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  margin-bottom: 10px;
}

.back-button {
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #0056b3;
}
</style>
