<template>
  <v-container fluid>
    <h2 class="mt-2 mb-4">Termékek</h2>

    <v-row v-if="filteredProducts.length">
      <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="rounded-xl" elevation="3">
          <v-img :src="product.imageUrl || logoImage" class="logo-image" cover></v-img>

          <v-card-title class="text-truncate">{{ product.name }}</v-card-title>

          <v-card-subtitle class="text-grey">
            {{ product.shortDescription || "-" }}
          </v-card-subtitle>

          <v-card-text>
            <strong>{{ product.price }} Ft</strong>
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" variant="plain" class="font-weight-bold" block @click="viewDetails(product.id)">
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
import logoImage from "@/assets/logo-smaller.png"; // This way the logo can be added dynamically to the product cards

export default {
  data() {
    return {
      logoImage,
    };
  },

  props: {
    filteredProducts: {
      type: Array,
      required: true,
    },
  },

  methods: {
    viewDetails(productId) {
      this.$router.push({ name: "product", params: { productId } });
    },
  },
};
</script>

<style scoped>
.v-card-title {
  font-size: 1.1rem;
}

.logo-image {
  height: 23em;
}
</style>
