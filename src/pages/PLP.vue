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
import MainHeader from '../components/MainHeader.vue';
import ProductCard from '../components/ProductCard.vue';
// import PromotionalSpot from "../components/PromotionalSpot.vue";

export default {
  /* eslint-disable */
  //  components: { MainHeader,  ProductCard, PromotionalSpot },
  components: { MainHeader, ProductCard },
  data() {
    return {
      categories: [],
      products: [],
      promotionalSpots: [],
      selectedCategoryId: 'root',
    };
  },
  computed: {
    filteredProducts() {
      // Filter products based on the selected category and subcategories
      const selectedCategory = this.findCategoryById(
        this.selectedCategoryId,
        this.categories
      );

      if (!selectedCategory) return [];

      // Get all relevant category IDs (selected category + subcategories)
      const categoryIds = this.getAllCategoryIds(selectedCategory);

      // Filter products whose categories match any of the relevant category IDs
      return this.products.filter((product) =>
        product.categories.some((category) => categoryIds.includes(category))
      );
    },
  },
  methods: {
    updateSelectedCategory(categoryId) {
      this.selectedCategoryId = categoryId;
    },
    findCategoryById(id, categories) {
      for (const category of categories) {
        if (category.id === id) return category;
        if (category.categories) {
          const found = this.findCategoryById(id, category.categories);
          if (found) return found;
        }
      }
      return null;
    },
    getAllCategoryIds(category) {
      const ids = [category.id]; // Start with the current category ID
      if (category.categories && category.categories.length > 0) {
        for (const subCategory of category.categories) {
          ids.push(...this.getAllCategoryIds(subCategory)); // Recursively add subcategory IDs
        }
      }
      return ids;
    },
  },
  mounted() {
    import('../assets/data.json')
      .then((data) => {
        console.log('Data loaded:', data); // **Debug: Check the loaded data**
        this.categories = data.categories.categories; // **Assign categories**
        this.products = data.products;
        this.promotionalSpots = data.promotionalSpots;
      })
      .catch((err) => {
        console.error('Failed to load data:', err); // **Handle data loading errors**
      });
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
