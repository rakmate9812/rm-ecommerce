<template>
  <v-container>
    <TheCategories
      :categories="categoryList"
      :selectedCategoryId="selectedCategoryId"
      @categorySelected="onCategorySelected"
    />
    <TheSubcategories
      v-if="filteredSubcategories.length"
      :subcategories="filteredSubcategories"
      :selectedCategoryId="selectedCategoryId"
      @subcategorySelected="onSubcategorySelected"
    />
    <TheSaleItems :filteredProducts="filteredProducts" />
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import TheCategories from "@/components/TheCategories.vue";
import TheSubcategories from "@/components/TheSubCategories.vue";
import TheSaleItems from "@/components/TheSaleItems.vue";

export default {
  name: "BrowseView",
  components: {
    TheCategories,
    TheSubcategories,
    TheSaleItems,
  },
  data() {
    return {
      selectedCategoryId: null, // Initially null, updated later
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
      return this.subcategoryList.filter((sub) => String(sub.categoryId) === String(this.selectedCategoryId));
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

    // Set default categoryId to default when the component is created
    this.selectedCategoryId = "1"; // TODO - IMPORTANT this is still buggy
  },
};
</script>
