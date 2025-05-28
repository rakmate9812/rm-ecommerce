<template>
  <v-container>
    <TheCategories
      :categories="categoryList"
      :selectedCategoryId="selectedCategoryId"
      @categorySelected="onCategorySelected" />

    <TheSubcategories
      :subcategories="subcategoryList"
      :selectedCategoryId="selectedCategoryId"
      :selectedSubcategoryId="selectedSubcategoryId"
      @subcategorySelected="onSubcategorySelected" />

    <TheProductPreviews
      :products="productList"
      :selectedCategoryId="selectedCategoryId"
      :selectedSubcategoryId="selectedSubcategoryId" />
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
    };
  },
  computed: {
    ...mapGetters(["getData"]),

    categoryList() {
      const categories = this.getData("categories");
      return Object.entries(categories || {}).map(([id, value]) => ({
        id,
        ...value,
      }));
    },

    subcategoryList() {
      const subcategories = this.getData("subcategories");
      return Object.entries(subcategories || {}).map(([id, value]) => ({
        id,
        ...value,
      }));
    },

    productList() {
      const products = this.getData("products");
      return Object.entries(products || {}).map(([id, value]) => ({
        id,
        ...value,
      }));
    },

    filteredSubcategories() {
      if (this.selectedCategoryId === "1") return this.subcategoryList;
      return this.subcategoryList.filter((sub) => sub.categoryId === this.selectedCategoryId);
    },

    filteredProducts() {
      if (!this.selectedSubcategoryId) return [];
      return this.productList.filter((product) => product.subcategoryId === this.selectedSubcategoryId);
    },
  },
  methods: {
    onCategorySelected(categoryId) {
      this.selectedCategoryId = categoryId;
      this.selectedSubcategoryId = null;
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
