<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="rounded-xl" elevation="3" @click="viewDetails(product.id)">
          <div class="image-container">
            <v-img :src="product.imageUrl || logoImage" class="logo-image" cover></v-img>

            <v-btn
              v-if="showFavorites"
              icon
              size="small"
              variant="plain"
              class="favorite-btn"
              :color="isFavorite(product.id) ? 'red' : 'white'"
              @click.stop="addToFavorites(product.id)">
              <v-icon>
                {{ isFavorite(product.id) ? "mdi-heart" : "mdi-heart-outline" }}
              </v-icon>
            </v-btn>
          </div>

          <v-card-title class="text-truncate">{{ product.name }}</v-card-title>

          <v-card-subtitle class="text-grey">
            {{ product.shortDescription || "-" }}
          </v-card-subtitle>

          <v-card-text>
            <strong>{{ product.price }} Ft</strong>
          </v-card-text>

          <!-- Yeah, this is pretty f'd up :D -->
          <!-- We need click.stop to prevent the default card clicking event (which is to open the product view) -->
          <!-- rlb click event is to prevent double clicking (this is actually the RateLimitedButton's problem) -->
          <div @click.stop>
            <v-card-actions class="button-actions">
              <RateLimitedButton
                :color="isAddedToCart(product.id) ? 'primary' : 'secondary'"
                variant="plain"
                :debounceTime="1000"
                @rlb-click="() => toggleToCart(product.id)">
                <v-icon start>
                  {{ isAddedToCart(product.id) ? "mdi-cart" : "mdi-cart-outline" }}
                </v-icon>
                {{ isAddedToCart(product.id) ? "Már kosárban" : "Kosárba" }}
              </RateLimitedButton>
            </v-card-actions>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import logoImage from "@/assets/logo-smaller.png";
import { mapState } from "vuex";
import RateLimitedButton from "./RateLimitedButton.vue";

export default {
  components: { RateLimitedButton },

  data() {
    return {
      logoImage,
      favoriteLocks: {}, // preventing idiotic user clicks or bots
    };
  },

  props: {
    filteredProducts: {
      type: Array,
      required: true,
    },
    showFavorites: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    ...mapState("favorites", ["favorites"]), // use this sytax also
  },

  methods: {
    async addToFavorites(productId) {
      if (!this.$store.getters["user/isAuthenticated"]) {
        this.$store.commit("modal/showModal", "A kedvencek eléréséhez be kell jelentkezz!");
        return;
      }

      if (this.favoriteLocks[productId]) return;

      this.favoriteLocks[productId] = true;

      try {
        await this.$store.dispatch("favorites/toggleFavorite", productId);
      } catch (err) {
        console.error(err);
        alert("Hiba történt a kedvencek frissítésekor.");
      }

      setTimeout(() => {
        this.favoriteLocks[productId] = false;
      }, 400);
    },

    viewDetails(productId) {
      this.$router.push({ name: "product", params: { productId } });
    },

    isFavorite(productId) {
      return this.favorites.includes(productId);
    },

    isAddedToCart(productId) {
      return this.$store.state.cart.cartItems.map((items) => items.productId).includes(productId);
    },

    toggleToCart(productId) {
      if (!this.isAddedToCart(productId)) {
        this.$store.dispatch("cart/addToCart", productId);
      } else {
        this.$store.dispatch("cart/removeFromCart", productId);
      }
    },
  },
};
</script>

<style scoped>
.v-card-title {
  font-size: 1.1rem;
}

.image-container {
  position: relative;
}

.logo-image {
  height: 23em;
  border-radius: 0.75rem;
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.button-actions {
  display: flex;
  justify-content: space-between;
  padding: 0.5em;
  gap: 0.5em;
}

.button-actions .v-btn {
  flex: 1;
}
</style>
