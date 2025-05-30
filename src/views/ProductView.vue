<template>
  <v-container class="py-8">
    <loading-state
      :loading="loading"
      :not-found="productNotFound"
      error-text="A termék nem található vagy eltávolították."
      icon="true"
      home-button="true">
      <v-card class="mt-6 pa-6 rounded-xl" elevation="3">
        <v-row>
          <!-- Image -->
          <v-col cols="12" md="5">
            <v-img :src="product.imageUrl || logoImage" height="400px" cover class="rounded-lg"></v-img>
          </v-col>

          <!-- Details -->
          <v-col cols="12" md="7">
            <h1 class="text-h4 font-weight-bold mb-4">{{ product.name }}</h1>
            <v-divider class="mb-4"></v-divider>

            <v-row>
              <!-- LEFT: price, category, subcategory -->
              <v-col cols="12" md="5">
                <div class="mb-6">
                  <h3 class="font-weight-medium">Ár</h3>
                  <p class="text-h4 font-weight-bold" style="color: rgba(67, 127, 127)">{{ product.price }} Ft</p>
                </div>

                <div class="mb-4">
                  <h3 class="font-weight-medium">Kategória</h3>
                  <p>{{ categoryName || "-" }}</p>
                </div>

                <div class="mb-4">
                  <h3 class="font-weight-medium">Alkategória</h3>
                  <p>{{ subcategoryName || "-" }}</p>
                </div>
              </v-col>

              <!-- RIGHT: description -->
              <v-col cols="12" md="7">
                <h3 class="font-weight-medium mb-2">Leírás</h3>
                <div class="description-container">
                  <p class="text-body-1">
                    {{ product.description || "Nincs leírás megadva." }}
                  </p>
                </div>
              </v-col>
            </v-row>

            <!-- Actions centered under the details -->
            <div class="d-flex justify-center flex-wrap ga-4 mt-6">
              <v-btn color="primary" variant="elevated" @click="addToCart">
                <v-icon start>mdi-cart</v-icon> Kosárba
              </v-btn>

              <v-btn color="pink" variant="outlined" @click="addToFavorites">
                <v-icon start>mdi-heart-outline</v-icon> Kedvencekhez
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </loading-state>
  </v-container>
</template>

<script>
import logoImage from "@/assets/logo-smaller.png";
import LoadingState from "@/components/LoadingState.vue"; // wherever you place it

export default {
  components: {
    LoadingState,
  },
  data() {
    return {
      product: null,
      categoryName: null,
      subcategoryName: null,
      logoImage,

      // for loading state
      productNotFound: false,
      loading: true,
    };
  },
  created() {
    this.checkProduct();
  },
  methods: {
    checkProduct() {
      const products = this.$store.getters.getData("products");
      const productId = this.$route.params.productId;

      // If products not loaded yet, wait for watcher to trigger this function when smtg comes
      if (!Object.keys(products).length) return;

      this.product = products[productId];

      if (this.product) {
        const category = this.$store.getters.categoryList.find(
          (cat) => String(cat.id) === String(this.product.categoryId)
        );
        this.categoryName = category ? category.name : null;

        const subcategory = this.$store.getters.subcategoryList.find(
          (sub) => String(sub.id) === String(this.product.subcategoryId)
        );
        this.subcategoryName = subcategory ? subcategory.name : null;

        this.productNotFound = false;
      } else {
        this.productNotFound = true;
      }

      this.loading = false; // stop loading state
    },
    addToCart() {
      console.log("Adding to cart:", this.product);
    },
    addToFavorites() {
      console.log("Adding to favorites:", this.product);
    },
  },
  watch: {
    "$store.state.data.products": {
      handler() {
        this.checkProduct();
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
h1 {
  line-height: 1.2;
}

.description-container {
  max-height: 220px;
  overflow-y: auto;
  padding-right: 6px;
}

.description-container::-webkit-scrollbar {
  width: 6px;
}

.description-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>
