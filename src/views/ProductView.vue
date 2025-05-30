<template>
    <v-container class="py-8">
      <div v-if="loading" class="text-center my-10">
        <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
      </div>
  
      <v-card v-else-if="product" class="mt-6 pa-6 rounded-xl" elevation="3">
        <v-row>
          <v-col cols="12" md="5">
            <v-img :src="product.imageUrl || logoImage" height="400px" cover class="rounded-lg"></v-img>
          </v-col>
  
          <v-col cols="12" md="7">
            <h1 class="text-h4 font-weight-bold mb-4">{{ product.name }}</h1>
            <v-divider class="mb-4"></v-divider>
  
            <v-row>
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
  
              <v-col cols="12" md="7">
                <h3 class="font-weight-medium mb-2">Leírás</h3>
                <div class="description-container">
                  <p class="text-body-1">
                    {{ product.description || "Nincs leírás megadva." }}
                  </p>
                </div>
              </v-col>
            </v-row>
  
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
  
      <div v-else class="text-center my-16">
        <v-icon size="64" color="error">mdi-alert-circle-outline</v-icon>
        <h2 class="text-h5 mt-4 mb-2">A termék nem található</h2>
        <p>A keresett termék nem létezik vagy eltávolították.</p>
        <v-btn class="mt-6" color="primary" @click="$router.push('/')">
          <v-icon start>mdi-home</v-icon> Vissza a főoldalra
        </v-btn>
      </div>
    </v-container>
  </template>
  
  <script>
  import logoImage from "@/assets/logo-smaller.png";
  
  export default {
    data() {
      return {
        product: null,
        categoryName: null,
        subcategoryName: null,
        logoImage,
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
  
        if (!Object.keys(products).length) {
          return;
        }
  
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
        }
  
        this.loading = false;
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
  