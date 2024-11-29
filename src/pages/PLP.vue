<template>
  <div class="plp">
    <MainMenu
      :categories="categories"
      :breadcrumbs="breadcrumbs"
      :currentCategories="currentCategoriesWithImages"
      @categorySelected="updateSelectedCategory"
    />
    <div class="plp-content">
      <SidebarMenu
        :categories="categories"
        :breadcrumbs="breadcrumbs"
        :currentCategories="currentCategoriesWithImages"
        :showHomeButton="selectedCategoryId !== 'root'"
        @categorySelected="updateSelectedCategory"
        @goHome="backToHome"
      />
      <main class="product-grid">
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
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import MainMenu from '../components/MainMenu.vue';
import SidebarMenu from '../components/SidebarMenu.vue';
import ProductCard from '../components/ProductCard.vue';
import PromotionalSpot from '../components/PromotionalSpot.vue';

export default {
  components: { MainMenu, ProductCard, PromotionalSpot, SidebarMenu },
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
      currentCategoriesWithImages, // Pass this to MainMenu
      combinedItems,
      selectedCategoryId,
      updateSelectedCategory,
      backToHome,
    };
  },
};
</script>

<style scoped>
.plp {
  display: flex;
  flex-direction: column;
}

.plp-content {
  display: flex;
}

.sidebar-menu {
  flex: 0 0 250px;
  background-color: #f9f9f9;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.product-grid {
  flex: 1;
  padding: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}
</style>
