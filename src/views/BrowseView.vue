<template>
  <v-container>
    <TheCategories
      :categories="categoryList"
      :selectedCategoryId="selectedCategoryId"
      @categorySelected="onCategorySelected" />

      <!-- subcategoryListKey is needed for re-rendering the subcategories on each click on every category,  -->
    <TheSubcategories
      v-if="displayedSubcategories.length"
      :key="subcategoryListKey"
      :subcategories="displayedSubcategories"
      :selectedCategoryId="selectedCategoryId"
      @subcategorySelected="onSubcategorySelected" />

    <TheProductPreviews :filteredProducts="displayedProducts" />
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import TheCategories from "@/components/TheCategories.vue";
import TheSubcategories from "@/components/TheSubCategories.vue";
import TheProductPreviews from "@/components/TheProductPreviews.vue";

export default {
  name: "BrowseView",
  components: {
    TheCategories,
    TheSubcategories,
    TheProductPreviews,
  },

  data() {
    return {
      selectedCategoryId: "1", // initialized as string to match db keys
      selectedSubcategoryId: null,
      subcategoryListKey: Math.random(),
    };
  },

  computed: {
    ...mapGetters(["categoryList", "subcategoryList", "productList", "filteredSubcategories", "filteredProducts"]),

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
      this.subcategoryListKey = Math.random(); // force re-render
    },
    onSubcategorySelected(subcategoryId) {
      this.selectedSubcategoryId = subcategoryId;
    },
  },
  async created() {
    await this.$store.dispatch("fetchData", "categories");
    await this.$store.dispatch("fetchData", "subcategories");
    await this.$store.dispatch("fetchData", "products");
  },
};
</script>
