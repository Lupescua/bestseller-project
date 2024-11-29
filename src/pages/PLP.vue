<template>
  <div class="plp">
    <MainHeader
      :categories="categories"
      @categorySelected="updateSelectedCategory"
    />
    <main>
      <div class="grid">
        <!--<PromotionalSpot
            v-for="spot in promotionalSpots"
            :key="spot.position"
            :spot="spot"
            :position="'spot-' + spot.position"
          />-->

        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import MainHeader from '../components/MainHeader.vue';
import ProductCard from '../components/ProductCard.vue';
// import PromotionalSpot from "../components/PromotionalSpot.vue";

export default {
  /* eslint-disable */
  //  components: { MainHeader,  ProductCard, PromotionalSpot },
  components: { MainHeader, ProductCard },
  setup() {
    // Reactive variables
    const categories = ref([]);
    const products = ref([]);
    const promotionalSpots = ref([]);
    const selectedCategoryId = ref('root');

    // Computed property for filtered products
    const filteredProducts = computed(() => {
      const selectedCategory = findCategoryById(
        selectedCategoryId.value,
        categories.value
      );

      // If no category is found (unlikely), return an empty array
      if (!selectedCategory) return [];

      // If root is selected, return all products
      if (selectedCategory.id === 'root') {
        return products.value;
      }

      // Otherwise, filter products based on category hierarchy
      const categoryIds = getAllCategoryIds(selectedCategory);

      return products.value.filter((product) =>
        product.categories.some((category) => categoryIds.includes(category))
      );
    });

    // Update selected category
    const updateSelectedCategory = (categoryId) => {
      selectedCategoryId.value = categoryId;
    };

    // Helper function: Find category by ID
    const findCategoryById = (id, categories) => {
      // Explicitly handle root category
      if (id === 'root') {
        return { id: 'root', name: { en: 'All Products' }, categories };
      }

      // Search through categories recursively
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
      const ids = [category.id]; // Start with the current category ID
      if (category.categories && category.categories.length > 0) {
        for (const subCategory of category.categories) {
          ids.push(...getAllCategoryIds(subCategory)); // Recursively add subcategory IDs
        }
      }
      return ids;
    };

    // Load data on component mount
    onMounted(() => {
      import('../assets/data.json')
        .then((data) => {
          console.log('Data loaded:', data); // Debug: Check the loaded data
          categories.value = data.categories.categories; // Assign categories
          products.value = data.products;
          promotionalSpots.value = data.promotionalSpots;
        })
        .catch((err) => {
          console.error('Failed to load data:', err); // Handle data loading errors
        });
    });

    // Return reactive data and methods
    return {
      categories,
      products,
      promotionalSpots,
      selectedCategoryId,
      filteredProducts,
      updateSelectedCategory,
    };
  },
};
</script>

<style>
/* Add basic styling */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
</style>
