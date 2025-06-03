<template>
  <div>
    <h2 v-if="!noProductsFound" class="mt-2 mb-4">Kedvenc termékeim</h2>

    <loading-state
      :loading="loading"
      :not-found="noProductsFound"
      error-text="Nincsenek kedvenc termékeid! Vegyél fel párat a kezdőlapon! 🐈"
      :homeButton="true">
      <ProductPreviews
        :filteredProducts="favoriteProducts"
        :show-favorite-icon="true"
        @toggle-favorite="handleToggleFavorite" />
    </loading-state>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ProductPreviews from "@/components/ProductPreviews.vue";
import LoadingState from "@/components/LoadingState.vue";

export default {
  name: "FavoritesView",
  components: {
    ProductPreviews,
    LoadingState,
  },

  data() {
    return {
      loading: true,
      noProductsFound: false,
    };
  },

  computed: {
    ...mapGetters("data", ["productList"]),
    favorites() {
      return this.$store.state.favorites.favorites || [];
    },

    favoriteProducts() {
      // Filter products to only those favorited by user
      return this.productList.filter((product) => this.favorites.includes(product.id));
    },
  },

  methods: {
    handleToggleFavorite(productId) {
      this.$store.dispatch("favorites/toggleFavorite", productId);
    },

    evaluateProductState() {
      this.noProductsFound = this.favoriteProducts.length === 0;
      this.loading = false;
    },
  },

  watch: {
    productList: {
      immediate: true,
      handler() {
        this.evaluateProductState();
      },
    },
    favorites: {
      immediate: true,
      handler() {
        this.evaluateProductState();
      },
    },
  },
};
</script>

<style scoped>
h2 {
  font-weight: 600;
}
</style>
