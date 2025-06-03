<template>
  <div>
    <TheCategories
      :categories="categoryList"
      :selectedCategoryId="selectedCategoryId"
      @categorySelected="onCategorySelected" />

    <TheSaleItems />

    <TheSubcategories
      v-if="displayedSubcategories.length"
      :key="subcategoryListKey"
      :subcategories="displayedSubcategories"
      :selectedCategoryId="selectedCategoryId"
      @subcategorySelected="onSubcategorySelected" />

    <v-container class="separator-line" fluid></v-container>

    <h2 v-if="!noProductsFound" class="mt-2 mb-4">Termékek</h2>

    <!-- Product area with loading state -->
    <loading-state
      :loading="loading"
      :not-found="noProductsFound"
      error-text="Nem találhatóak termékek ebben a kategóriában.">
      <ProductPreviews :filteredProducts="displayedProducts" />
    </loading-state>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TheCategories from "@/components/TheCategories.vue";
import TheSubcategories from "@/components/TheSubCategories.vue";
import ProductPreviews from "@/components/ProductPreviews.vue";
import TheSaleItems from "@/components/TheSaleItems.vue";
import LoadingState from "@/components/LoadingState.vue";

export default {
  name: "BrowseView",
  components: {
    TheCategories,
    TheSaleItems,
    TheSubcategories,
    ProductPreviews,
    LoadingState,
  },

  data() {
    return {
      selectedCategoryId: "1",
      selectedSubcategoryId: null,
      subcategoryListKey: Math.random(),
      loading: true,
      noProductsFound: false,
    };
  },

  computed: {
    ...mapGetters("data", [
      "categoryList",
      "subcategoryList",
      "productList",
      "filteredSubcategories",
      "filteredProducts",
    ]),

    displayedSubcategories() {
      return this.filteredSubcategories(this.selectedCategoryId);
    },

    displayedProducts() {
      return this.filteredProducts(this.selectedCategoryId, this.selectedSubcategoryId);
    },
  },

  methods: {
    onCategorySelected(categoryId) {
      this.selectedCategoryId = categoryId;
      this.selectedSubcategoryId = null;
      this.subcategoryListKey = Math.random();
      this.evaluateProductState();
    },

    onSubcategorySelected(subcategoryId) {
      this.selectedSubcategoryId = subcategoryId;
      this.evaluateProductState();
    },

    evaluateProductState() {
      // Only call this if data is already loaded
      if (!Object.keys(this.productList).length) return; // The watcher will call this again if data came

      this.noProductsFound = !this.displayedProducts.length;
      this.loading = false;
    },
  },

  watch: {
    // Watch for when products data arrives from fb
    productList: {
      handler() {
        this.evaluateProductState();
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.separator-line {
  background-color: #f5f5f5;
}
</style>
