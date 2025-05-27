<template>
    <v-container fluid>
      <h2 class="my-4">All Products</h2>
  
      <v-row v-if="products && Object.keys(products).length">
        <v-col
          v-for="(product, id) in products"
          :key="id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card class="rounded-xl" elevation="3">
            <v-img
              :src="product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'"
              height="200px"
              cover
            ></v-img>
  
            <v-card-title class="text-truncate">{{ product.name }}</v-card-title>
  
            <v-card-subtitle class="text-grey">
              {{ truncate(product.description, 60) }}
            </v-card-subtitle>
  
            <v-card-text>
              <strong>{{ product.price }} Ft</strong>
            </v-card-text>
  
            <v-card-actions>
              <v-btn color="primary" variant="outlined" block @click="viewDetails(id)">
                View
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <div v-else class="text-center my-5">
        <v-progress-circular indeterminate color="primary" />
      </div>
    </v-container>
  </template>
  
  <script>
  export default {
    computed: {
      products() {
        return this.$store.getters.getData("products");
      },
    },
    async mounted() {
      if (!this.products || Object.keys(this.products).length === 0) {
        await this.$store.dispatch("fetchData", "products");
      }
    },
    methods: {
      truncate(text, length) {
        return text && text.length > length ? text.substring(0, length) + "..." : text;
      },
      viewDetails(productId) {
        // Future: Navigate to product details or open a modal
        console.log("Clicked product:", productId);
      },
    },
  };
  </script>
  
  <style scoped>
  .v-card-title {
    font-size: 1.1rem;
  }
  .v-card-subtitle {
    min-height: 48px;
  }
  </style>
  