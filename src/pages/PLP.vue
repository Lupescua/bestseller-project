<template>
    <div class="plp">
      <MainHeader :categories="categories" />
     <!--  <main>
        <div class="grid">
          <PromotionalSpot
            v-for="spot in promotionalSpots"
            :key="spot.position"
            :spot="spot"
            :position="'spot-' + spot.position"
          />
          
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            />
        </div>
      </main> -->
    </div>
  </template>
  
  <script>
  import MainHeader from "../components/MainHeader.vue";
  // import ProductCard from "../components/ProductCard.vue";
  // import PromotionalSpot from "../components/PromotionalSpot.vue";
  
  export default {
    // components: { MainHeader,  ProductCard, PromotionalSpot },
    components: { MainHeader
     },
    data() {
      return {
        categories: [],
        products: [],
        promotionalSpots: [],
      };
    },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => this.isValidProduct(product));
    },
  },
  methods: {
    isValidProduct(product) {
      return product?.name && product?.images?.length > 0; // Ensure name and images exist
    },
  },
    mounted() {
      // Replace with actual API requests if needed
      import("../assets/data.json").then((data) => {
        this.categories = data.categories.categories;
        console.log(this.categories);
        this.products = data.products;
        this.promotionalSpots = data.promotionalSpots;
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
  