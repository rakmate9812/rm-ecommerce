<template>
  <v-container class="py-6">
    <loading-state
      :loading="loading"
      :not-found="productNotFound"
      error-text="A termék nem található vagy eltávolították."
      :icon="true"
      :home-button="true">
      <v-card class="mt-4 pa-4 pa-md-6 rounded-xl" elevation="3">
        <v-row class="product-row" align="start">
          <!-- IMAGE -->
          <v-col cols="12" md="5" class="mb-4 mb-md-0">
            <div class="image-wrapper">
              <v-img :src="product.imageUrl || logoImage" class="product-image" contain></v-img>
            </div>
          </v-col>

          <!-- DETAILS -->
          <v-col cols="12" md="7">
            <h1 class="product-title text-h5 text-md-h4 font-weight-bold mb-3">
              {{ product.name }}
            </h1>
            <v-divider class="mb-4"></v-divider>

            <v-row>
              <!-- LEFT: price, category, subcategory -->
              <v-col cols="12" md="5" class="mb-3 mb-md-0">
                <div class="mb-4">
                  <h3 class="section-heading">Ár</h3>
                  <p class="price-text">{{ formatPrice(product.price) }} Ft</p>
                  <!-- Updated line -->
                </div>

                <div class="mb-3">
                  <h3 class="section-heading">Kategória</h3>
                  <p>{{ categoryName || "-" }}</p>
                </div>

                <div>
                  <h3 class="section-heading">Alkategória</h3>
                  <p>{{ subcategoryName || "-" }}</p>
                </div>
              </v-col>

              <!-- RIGHT: description -->
              <v-col cols="12" md="7">
                <h3 class="section-heading mb-2">Leírás</h3>
                <div class="description-container">
                  <p class="description text-body-1">
                    {{ product.description || "Nincs leírás megadva." }}
                  </p>
                </div>
              </v-col>
            </v-row>

            <!-- ACTIONS - Only visible on desktop -->
            <div class="action-buttons d-none d-md-flex flex-column flex-sm-row justify-center ga-3 mt-6">
              <RateLimitedButton
                :color="isAddedToCart ? 'primary' : 'secondary'"
                variant="elevated"
                :debounceTime="1000"
                class="flex-grow-1"
                @rlb-click="toggleToCart">
                <v-icon start>
                  {{ isAddedToCart ? "mdi-cart" : "mdi-cart-outline" }}
                </v-icon>
                {{ isAddedToCart ? "Már kosárban" : "Kosárba" }}
              </RateLimitedButton>

              <RateLimitedButton
                :color="isFavorited ? 'pink' : 'grey'"
                variant="outlined"
                :debounceTime="1000"
                class="flex-grow-1"
                @rlb-click="toggleToFavorites">
                <v-icon start>
                  {{ isFavorited ? "mdi-heart" : "mdi-heart-outline" }}
                </v-icon>
                {{ isFavorited ? "Már kedvenc" : "Kedvencekhez" }}
              </RateLimitedButton>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <!-- Mobile sticky buttons -->
      <div v-if="!productNotFound" class="mobile-actions d-md-none">
        <RateLimitedButton
          :color="isAddedToCart ? 'primary' : 'secondary'"
          variant="elevated"
          :debounceTime="1000"
          class="mobile-button"
          @rlb-click="toggleToCart">
          <v-icon start>
            {{ isAddedToCart ? "mdi-cart" : "mdi-cart-outline" }}
          </v-icon>
          {{ isAddedToCart ? "Már kosárban" : "Kosárba" }}
        </RateLimitedButton>

        <RateLimitedButton
          :color="isFavorited ? 'pink' : 'grey'"
          variant="outlined"
          :debounceTime="1000"
          class="mobile-button"
          @rlb-click="toggleToFavorites">
          <v-icon start>
            {{ isFavorited ? "mdi-heart" : "mdi-heart-outline" }}
          </v-icon>
          {{ isFavorited ? "Már kedvenc" : "Kedvencekhez" }}
        </RateLimitedButton>
      </div>
    </loading-state>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import logoImage from "@/assets/logo-smaller.png";
import LoadingState from "@/components/LoadingState.vue";
import RateLimitedButton from "@/components/RateLimitedButton.vue";

export default {
  components: {
    LoadingState,
    RateLimitedButton,
  },

  data() {
    return {
      product: null,
      categoryName: null,
      subcategoryName: null,
      logoImage,

      productNotFound: false,
      loading: true,
    };
  },

  created() {
    this.checkProduct();
  },

  methods: {
    checkProduct() {
      const activeProducts = this.$store.getters["data/activeProductList"];
      if (!Object.keys(activeProducts).length) return;

      this.product = activeProducts.find((prod) => this.$route.params.productId == prod.id);

      if (this.product) {
        const category = this.$store.getters["data/categoryList"].find(
          (cat) => String(cat.id) === String(this.product.categoryId)
        );
        this.categoryName = category ? category.name : null;

        const subcategory = this.$store.getters["data/subcategoryList"].find(
          (sub) => String(sub.id) === String(this.product.subcategoryId)
        );
        this.subcategoryName = subcategory ? subcategory.name : null;

        this.productNotFound = false;
      } else {
        this.productNotFound = true;
      }

      this.loading = false;
    },

    formatPrice(price) {
      // spaces after every three digits
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },

    toggleToCart() {
      if (!this.isAddedToCart) this.$store.dispatch("cart/addToCart", this.$route.params.productId);
      else this.$store.dispatch("cart/removeFromCart", this.$route.params.productId);
    },

    async toggleToFavorites() {
      if (!this.isAuthenticated) {
        this.$store.commit("modal/showModal", "A kedvencek eléréséhez be kell jelentkezz!");
        return;
      }

      try {
        await this.$store.dispatch("favorites/toggleFavorite", this.$route.params.productId);
      } catch (err) {
        console.error(err);
        alert("Hiba történt a kedvencek frissítésekor.");
      }
    },
  },

  computed: {
    ...mapGetters("user", ["isAuthenticated"]),

    isFavorited() {
      return this.$store.state.favorites.favorites.includes(this.$route.params.productId);
    },

    isAddedToCart() {
      return this.$store.state.cart.cartItems.map((items) => items.productId).includes(this.$route.params.productId);
    },
  },

  watch: {
    "$store.state.data.data.products": {
      handler() {
        this.checkProduct();
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.product-title {
  line-height: 1.3;
}

.section-heading {
  font-weight: 500;
  font-size: 1rem;
}

.price-text {
  font-size: 1.4rem;
  font-weight: bold;
  color: rgba(67, 127, 127);
}

/* IMAGE WRAPPER */
.image-wrapper {
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  border-radius: 0.75rem;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Description scroll */
.description-container {
  max-height: 220px;
  overflow-y: auto;
  padding-right: 6px;
  white-space: pre-line;
}
.description-container::-webkit-scrollbar {
  width: 6px;
}
.description-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

/* ACTION BUTTONS FLEX */
.action-buttons > .v-btn {
  margin-bottom: 0.5rem;
}

/* Mobile actions */
.mobile-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 12px 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 100;
}

.mobile-actions .mobile-button {
  width: 100%;
}

@media (max-width: 768px) {
  .v-container {
    padding-bottom: 140px !important;
  }

  /* Add padding to card bottom to match mobile actions padding */
  .v-card {
    padding-bottom: 16px !important;
  }

  .product-title {
    font-size: 1.3rem;
  }

  .price-text {
    font-size: 1.2rem;
  }

  .action-buttons {
    flex-direction: column !important;
  }

  .mobile-button {
    width: 100%;
    margin-top: 8px;
  }

  /* Add distinct styling for description container on mobile */
  .description-container {
    background-color: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px;
    margin-top: 4px;
  }

  /* Make the scrollbar more visible on mobile */
  .description-container::-webkit-scrollbar {
    width: 4px;
    background-color: #e0e0e0;
  }

  .description-container::-webkit-scrollbar-thumb {
    background-color: #9e9e9e;
    border-radius: 4px;
  }
}
</style>
