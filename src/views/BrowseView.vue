<template>
  <div>
    <!-- Categories -->
    <TheCategories
      v-if="!hasSearch"
      :categories="categoryList"
      :selectedCategoryId="selectedCategoryId"
      @categorySelected="onCategorySelected"
      class="categories-scroll" />

    <TheSaleItems />

    <!-- Subcategories -->
    <TheSubcategories
      v-if="!hasSearch && displayedSubcategories.length"
      :key="subcategoryListKey"
      :subcategories="displayedSubcategories"
      :selectedCategoryId="selectedCategoryId"
      @subcategorySelected="onSubcategorySelected"
      class="subcategories-scroll" />

    <v-container class="separator-line" fluid></v-container>

    <h2 v-if="!noProductsFound" class="mt-2 mb-4">Termékek</h2>

    <loading-state
      :loading="loading"
      :not-found="noProductsFound"
      error-text="Nem találhatóak termékek ebben a kategóriában.">
      <!-- Products -->
      <div class="product-grid">
        <ProductPreviews :filteredProducts="displayedProducts" />
      </div>
    </loading-state>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
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
      subcategoryListKey: Math.random(),
      loading: true,
      noProductsFound: false,
    };
  },

  computed: {
    ...mapState("data", ["selectedCategoryId", "selectedSubcategoryId"]),
    ...mapGetters("data", [
      "categoryList",
      "subcategoryList",
      "activeProductList",
      "filteredSubcategories",
      "filteredProducts",
    ]),

    selectedCategoryId: {
      get() {
        return this.$store.state.data.selectedCategoryId;
      },
      set(value) {
        this.$store.commit("data/setSelectedCategoryId", value);
      },
    },

    selectedSubcategoryId: {
      get() {
        return this.$store.state.data.selectedSubcategoryId;
      },
      set(value) {
        this.$store.commit("data/setSelectedSubcategoryId", value);
      },
    },

    displayedSubcategories() {
      return this.filteredSubcategories(this.selectedCategoryId);
    },

    displayedProducts() {
      // If global search
      const search = this.$store.state.data.searchText;
      if (search) {
        const lowerSearch = search.toLowerCase();
        const allProducts = this.filteredProducts(1, null);
        // console.log(allProducts);
        return allProducts.filter((product) => product.name.toLowerCase().includes(lowerSearch));
      }

      // Else category search
      const displayed = this.filteredProducts(this.selectedCategoryId, this.selectedSubcategoryId);
      return displayed;
    },

    hasSearch() {
      return !!this.$store.state.data.searchText;
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
      if (!Object.keys(this.activeProductList).length) return; // The watcher will call this again if data came

      this.noProductsFound = !this.displayedProducts.length;
      this.loading = false;
    },
  },

  watch: {
    // Watch for when products data arrives from fb
    activeProductList: {
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
