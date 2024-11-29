<template>
    <div class="pdp">
      <h1>{{ product.name.en || product.name.dk }}</h1>
      <img :src="product.images[0]" :alt="product.name.en || product.name.dk" />
      <p>{{ product.price }} DKK</p>
      <div>
        <h2>Sizes</h2>
        <ul>
          <li v-for="size in product.size" :key="size">{{ size }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      product: Object,
    },
  };
  </script>
  
  <style>
  /* Add basic styling */
  </style>
    