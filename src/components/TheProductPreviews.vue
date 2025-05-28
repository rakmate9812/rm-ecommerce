<template>
  <v-container fluid>
    <h2 class="my-4">Products</h2>

    <v-row v-if="filteredProducts.length">
      <v-col
        v-for="product in filteredProducts"
        :key="product.id"
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
            <v-btn color="primary" variant="outlined" block @click="viewDetails(product.id)">
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
  props: {
    products: {
      type: Array,
      required: true,
    },
    selectedCategoryId: {
      type: [String, Number],
      required: true,
    },
    selectedSubcategoryId: {
      type: [String, Number],
      default: null,
    },
  },
  computed: {
    filteredProducts() {
      // Show all if category 1 is selected
      if (String(this.selectedCategoryId) === "1") {
        return this.products;
      }

      // If a subcategory is selected, filter by it
      if (this.selectedSubcategoryId) {
        return this.products.filter(
          (product) => String(product.subcategoryId) === String(this.selectedSubcategoryId)
        );
      }

      // Else, filter by selected category
      return this.products.filter(
        (product) => String(product.categoryId) === String(this.selectedCategoryId)
      );
    },
  },
  methods: {
    truncate(text, length) {
      return text && text.length > length ? text.substring(0, length) + "..." : text;
    },
    viewDetails(productId) {
      console.log("Clicked product:", productId);
      // Future: navigate to product details or open a modal
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
