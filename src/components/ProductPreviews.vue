<template>
  <v-container fluid>
    <v-row v-if="filteredProducts.length">
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

          <v-card-actions>
            <v-btn color="secondary" variant="plain" class="font-weight-bold" block @click="viewDetails(product.id)">
              Megtekintés
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <div v-else class="text-center my-5">
      <p>Nem található termék ebben a kategóriában. Nézz vissza később!</p>
    </div>
  </v-container>
</template>

<script>
import logoImage from "@/assets/logo-smaller.png";
import { mapState } from "vuex";

export default {
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
      if (!this.$store.state.user.user) {
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
</style>
