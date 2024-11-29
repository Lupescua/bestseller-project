<template>
  <div class="plp">
    <MainHeader
      :categories="categories"
      @categorySelected="updateSelectedCategory"
    />
    <main>
      <div class="grid">
        <div
          v-for="(item, index) in combinedItems"
          :key="index"
          class="grid-item"
        >
          <PromotionalSpot v-if="item.isPromotionalSpot" :spot="item" />
          <ProductCard v-else :product="item" />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import MainHeader from '../components/MainHeader.vue';
import ProductCard from '../components/ProductCard.vue';
import PromotionalSpot from '../components/PromotionalSpot.vue';

export default {
  /* eslint-disable */
  components: { MainHeader, ProductCard, PromotionalSpot },
  setup() {
    // Reactive variables
    const categories = ref([]);
    const products = ref([]);
    const promotionalSpots = ref([]);
    const selectedCategoryId = ref('root');
    const combinedItems = ref([]);

    const filteredProducts = computed(() => {
      if (selectedCategoryId.value === 'root') {
        return products.value;
      }
      const selectedCategory = findCategoryById(
        selectedCategoryId.value,
        categories.value
      );
      if (!selectedCategory) return [];
      const categoryIds = getAllCategoryIds(selectedCategory);
      return products.value.filter((product) =>
        product.categories.some((category) => categoryIds.includes(category))
      );
    });

    const recalculateCombinedItems = () => {
      const items = [...filteredProducts.value];
      const sortedSpots = [...promotionalSpots.value].sort(
        (a, b) => b.position - a.position
      );

      sortedSpots.forEach((spot) => {
        if (spot.position >= 0 && spot.position <= items.length) {
          items.splice(spot.position, 0, { ...spot, isPromotionalSpot: true });
        }
      });

      combinedItems.value = items;
    };

    // Update selected category
    const updateSelectedCategory = (categoryId) => {
      selectedCategoryId.value = categoryId;
    };

    // Helper function: Find category by ID
    const findCategoryById = (id, categories) => {
      if (id === 'root') {
        return { id: 'root', name: { en: 'All Products' }, categories };
      }
      for (const category of categories) {
        if (category.id === id) return category;
        if (category.categories) {
          const found = findCategoryById(id, category.categories);
          if (found) return found;
        }
      }
      return null;
    };

    // Helper function: Get all category IDs
    const getAllCategoryIds = (category) => {
      const ids = [category.id];
      if (category.categories && category.categories.length > 0) {
        for (const subCategory of category.categories) {
          ids.push(...getAllCategoryIds(subCategory));
        }
      }
      return ids;
    };

    const backToHome = () => {
      selectedCategoryId.value = 'root';
    };

    onMounted(() => {
      import('../assets/data.json')
        .then((data) => {
          categories.value = data.categories.categories;
          products.value = data.products;
          promotionalSpots.value = data.promotionalSpots;
          recalculateCombinedItems();
        })
        .catch((err) => {
          console.error('Failed to load data:', err);
        });
    });

    // Watch for changes in selectedCategoryId and recalculate combinedItems
    watch(selectedCategoryId, () => {
      recalculateCombinedItems();
    });

    // Return reactive data and methods
    return {
      categories,
      products,
      promotionalSpots,
      selectedCategoryId,
      combinedItems,
      updateSelectedCategory,
      backToHome,
    };
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(150px, 1fr)
  ); /* Dynamically adjust columns */
  gap: 1rem; /* Space between grid items */
  max-width: 100%; /* Limit grid width */
  margin: 0 auto; /* Center the grid */
}

.grid-item {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%; /* Match the size of the grid cell */
}

.spot,
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9; /* Optional background */
  transition: transform 0.2s ease;
}

.spot:hover,
.card:hover {
  transform: scale(1.05); /* Add a hover effect */
}
</style>
