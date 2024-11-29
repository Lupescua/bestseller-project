<template>
  <div class="plp">
    <MainHeader
      :categories="categories"
      :breadcrumbs="breadcrumbs"
      :currentCategories="currentCategoriesWithImages"
      :showHomeButton="selectedCategoryId !== 'root'"
      @categorySelected="updateSelectedCategory"
      @goHome="backToHome"
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
  components: { MainHeader, ProductCard, PromotionalSpot },
  setup() {
    const categories = ref([]);
    const products = ref([]);
    const promotionalSpots = ref([]);
    const selectedCategoryId = ref('root');
    const breadcrumbs = ref([]);
    const combinedItems = ref([]);

    const currentCategories = computed(() => {
      if (selectedCategoryId.value === 'root') {
        return categories.value;
      }
      const selectedCategory = findCategoryById(
        selectedCategoryId.value,
        categories.value
      );
      return selectedCategory?.categories || [];
    });

    const currentCategoriesWithImages = computed(() => {
      return currentCategories.value.map((category) => ({
        ...category,
        image: getFirstProductImage(category),
      }));
    });

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

    const getFirstProductImage = (category) => {
      if (category.categories && category.categories.length > 0) {
        for (const subCategory of category.categories) {
          const product = products.value.find((product) =>
            product.categories.includes(subCategory.id)
          );
          if (product) return product.images[0];
        }
      }

      const product = products.value.find((product) =>
        product.categories.includes(category.id)
      );
      return product ? product.images[0] : 'https://via.placeholder.com/150';
    };

    const updateBreadcrumbs = () => {
      const crumbs = [];
      let currentCategory = findCategoryById(
        selectedCategoryId.value,
        categories.value
      );
      while (currentCategory) {
        crumbs.unshift({
          id: currentCategory.id,
          name: currentCategory.name.en,
        });
        currentCategory = findCategoryById(
          currentCategory.parent_category_id,
          categories.value
        );
      }
      if (!crumbs.length || crumbs[0].id !== 'root') {
        crumbs.unshift({ id: 'root', name: 'Home' });
      }
      breadcrumbs.value = crumbs;
    };

    const updateSelectedCategory = (categoryId) => {
      selectedCategoryId.value = categoryId;
      updateBreadcrumbs();
    };

    const backToHome = () => {
      selectedCategoryId.value = 'root';
      updateBreadcrumbs();
    };

    const findCategoryById = (id, categories) => {
      if (id === 'root') return { id: 'root', name: { en: 'Home' } };
      for (const category of categories) {
        if (category.id === id) return category;
        if (category.categories) {
          const found = findCategoryById(id, category.categories);
          if (found) return found;
        }
      }
      return null;
    };

    const getAllCategoryIds = (category) => {
      const ids = [category.id];
      if (category.categories) {
        category.categories.forEach((subCategory) => {
          ids.push(...getAllCategoryIds(subCategory));
        });
      }
      return ids;
    };

    onMounted(() => {
      import('../assets/data.json')
        .then((data) => {
          categories.value = data.categories.categories;
          products.value = data.products;
          promotionalSpots.value = data.promotionalSpots;
          updateBreadcrumbs();
          recalculateCombinedItems();
        })
        .catch((err) => {
          console.error('Error loading data:', err);
        });
    });

    watch([selectedCategoryId, promotionalSpots, filteredProducts], () => {
      recalculateCombinedItems();
    });

    return {
      categories,
      breadcrumbs,
      currentCategoriesWithImages, // Pass this to MainHeader
      combinedItems,
      selectedCategoryId,
      updateSelectedCategory,
      backToHome,
    };
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}
</style>
