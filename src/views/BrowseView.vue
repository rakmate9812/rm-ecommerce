<template>
  <div>
    <!-- Categories & Subcategories (desktop only) -->
    <div class="desktop-only">
      <TheCategories
        v-if="!hasSearch"
        :categories="categoryList"
        :selectedCategoryId="selectedCategoryId"
        @categorySelected="onCategorySelected"
        class="categories-scroll" />

      <TheSubcategories
        v-if="subcategoryVisible && !hasSearch && displayedSubcategories.length"
        :key="subcategoryListKey"
        :subcategories="displayedSubcategories"
        :selectedCategoryId="selectedCategoryId"
        @subcategorySelected="onSubcategorySelected"
        class="subcategories-scroll" />
    </div>

    <TheSaleItems />

    <v-container v-if="!hasSearch" class="separator-line" fluid>
      <!-- Show current category name -->
      <h2 v-if="currentCategoryName" class="mt-2 mb-2">{{ currentCategoryName }}</h2>
    </v-container>

    <!-- Products title -->
    <h2 v-if="!noProductsFound" class="mt-2 mb-4">Termékek</h2>

    <loading-state :loading="loading" :not-found="noProductsFound" :error-text="errorText">
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
      errorText: "Nem található termék.",
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

    displayedSubcategories() {
      return this.filteredSubcategories(this.selectedCategoryId);
    },

    displayedProducts() {
      if (this.hasSearch) {
        this.onCategorySelected(1);
        const search = this.$store.state.data.searchText.toLowerCase();
        const allProducts = this.filteredProducts(1, null);
        return allProducts.filter((product) => product.name.toLowerCase().includes(search));
      }
      // Use Vuex getter for sorting with storeConfig sortingOption
      return this.$store.getters["data/sortedProducts"](
        this.filteredProducts(this.selectedCategoryId, this.selectedSubcategoryId)
        // no need to pass sortingOption, will use storeConfig
      );
    },

    hasSearch() {
      return !!this.$store.state.data.searchText;
    },

    currentCategoryName() {
      const found = this.categoryList.find((c) => String(c.id) === String(this.selectedCategoryId));
      return found ? found.name : null;
    },

    subcategoryVisible() {
      return this.$store.getters["config/getConfigValue"]("SubcategoryVisible") ?? false;
    },
  },

  methods: {
    onCategorySelected(categoryId) {
      this.$store.commit("data/setSelectedCategoryId", categoryId);
      this.$store.commit("data/setSelectedSubcategoryId", null);
      this.subcategoryListKey = Math.random();
      this.loading = true;
      this.evaluateProductState();
    },

    onSubcategorySelected(subcategoryId) {
      this.$store.commit("data/setSelectedSubcategoryId", subcategoryId);
      this.loading = true;
      this.evaluateProductState();
    },

    evaluateProductState() {
      if (!Object.keys(this.activeProductList).length) return;

      if (!this.hasSearch) {
        this.errorText = "Nem találhatóak termékek ebben a kategóriában.";
      } else {
        this.errorText = "A keresés nem hozott találatot.";
      }

      this.noProductsFound = !this.displayedProducts.length;
      this.loading = false;
    },

    sortFilteredProducts(products) {
      return [...products].sort((a, b) => a.name.localeCompare(b.name, "hu", { sensitivity: "base" }));
    },
  },

  watch: {
    activeProductList: {
      handler() {
        this.evaluateProductState();
      },
      immediate: true,
    },
    displayedProducts() {
      this.evaluateProductState();
    },
  },
};
</script>

<style scoped>
.separator-line {
  background-color: #f5f5f5;
}

/* Hide categories + subcategories on mobile */
@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }
}
</style>
