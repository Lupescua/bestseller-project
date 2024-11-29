<template>
  <header class="header">
    <div>
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs">
        <span v-for="(crumb, index) in breadcrumbs" :key="index">
          <router-link :to="crumb.path">{{ crumb.name }}</router-link>
          <span v-if="index < breadcrumbs.length - 1"> / </span>
        </span>
      </nav>

      <!-- Category Cards -->
      <div class="category-grid">
        <!-- Back to Home Button -->
        <div
          v-if="!currentCategories.length"
          class="category-card"
          @click="goToHome"
        >
          <img
            src="../assets/logo.png"
            alt="Application Logo"
            class="category-image"
          />
          <h3>Back to Home</h3>
        </div>

        <div
          v-for="category in currentCategories"
          :key="category.id"
          class="category-card"
          @click="() => selectCategory(category.id)"
        >
          <router-link :to="'/' + category.id">
            <img
              :src="getFirstProductImage(category)"
              alt="Category Image"
              class="category-image"
            />
            <h3>{{ category.name.en }}</h3>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import data from '../assets/data.json';

export default {
  props: {
    categories: Array, // Receive categories from parent
  },
  emits: ['categorySelected'], // Emit selected category
  setup(props, { emit }) {
    /* eslint-disable */
    const allProducts = ref(data.products);
    const breadcrumbs = ref([]);
    const route = useRoute(); // Get the current route
    const router = useRouter(); // Access the router
    const selectedCategoryId = ref(route.params.id || 'root'); // Initialize from route params

    // Navigate back to Home
    const goToHome = () => {
      selectedCategoryId.value = 'root'; // Reset to root category
      emit('categorySelected', 'root');
      breadcrumbs.value = [
        {
          name: 'Home',
          path: '/',
        },
      ];
    };

    // Find a category by its ID
    const findCategoryById = (id, categories) => {
      for (const category of categories) {
        if (category.id === id) return category;
        if (category.categories) {
          const found = findCategoryById(id, category.categories);
          if (found) return found;
        }
      }
      return null;
    };

    // Update breadcrumbs dynamically
    const updateBreadcrumbs = (category) => {
      const crumbs = [];
      let current = category;
      while (current) {
        crumbs.unshift({
          name: current.name.en,
          path: current.id === 'root' ? '/' : `/${current.id}`,
        });
        current = findCategoryById(
          current.parent_category_id,
          props.categories
        );
      }
      if (!crumbs.length || crumbs[0].path !== '/') {
        crumbs.unshift({
          name: 'Home',
          path: '/',
        });
      }
      breadcrumbs.value = crumbs;
    };

    // Compute the current categories to display
    const currentCategories = computed(() => {
      if (!props.categories || props.categories.length === 0) {
        return [];
      }
      if (selectedCategoryId.value === 'root') {
        breadcrumbs.value = [
          { name: 'Home', path: '/' }, // Initialize breadcrumbs
        ];
        return props.categories; // Top-level categories
      }

      const category = findCategoryById(
        selectedCategoryId.value,
        props.categories
      );

      if (category) {
        updateBreadcrumbs(category);
        return category.categories || [];
      }
      return [];
    });
    // Populate breadcrumbs on component mount
    onMounted(() => {
      const initialCategory = findCategoryById(
        selectedCategoryId.value,
        props.categories
      );
      if (initialCategory) {
        updateBreadcrumbs(initialCategory);
      }
    });

    // Watch for route changes and update breadcrumbs
    watch(
      () => route.params.id,
      (newId) => {
        if (selectedCategoryId.value !== (newId || 'root')) {
          selectedCategoryId.value = newId || 'root';
          const category = findCategoryById(
            selectedCategoryId.value,
            props.categories
          );
          if (category) {
            selectCategory(category.id);
            updateBreadcrumbs(category);
          }
        }
      }
    );
    // Emit selected category ID
    const selectCategory = (categoryId) => {
      selectedCategoryId.value = categoryId; // Update selected category
      emit('categorySelected', categoryId); // Notify parent component
    };

    // Get the first product's image for a category
    const getFirstProductImage = (category) => {
      // If the category has subcategories, find the first product in the first subcategory
      if (category.categories && category.categories.length > 0) {
        for (const subCategory of category.categories) {
          const product = allProducts.value.find(
            (product) => product.categories.includes(subCategory.id) // Check if subCategory.id is in product.categories
          );
          if (product) {
            return product.images[0]; // Return the first product's image in the subcategory
          }
        }
      }

      // If no subcategories, get the first product directly for this category
      const product = allProducts.value.find(
        (product) => product.categories.includes(category.id) // Check if category.id is in product.categories
      );
      return product ? product.images[0] : 'https://via.placeholder.com/150'; // Fallback to placeholder
    };
    return {
      currentCategories,
      breadcrumbs,
      goToHome,
      selectCategory,
      getFirstProductImage,
    };
  },
};
</script>

<style scoped>
.breadcrumbs {
  margin-bottom: 20px;
  font-size: 14px;
}
.breadcrumbs span {
  margin-right: 5px;
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}
.category-card {
  text-align: center;
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
</style>
