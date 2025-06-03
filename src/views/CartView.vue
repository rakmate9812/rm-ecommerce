<template>
  <v-container>
    <h1>Kosár</h1>
    <v-card v-for="item in cartItems" :key="item.productId" class="mb-4">
      <v-card-text>
        <p>{{ getProduct(item.productId).name }}</p>
        <p>Darabszám: {{ item.quantity }}</p>
        <p>Egységár: {{ item.unitPrice }} Ft</p>
        <p>Összesen: {{ item.quantity * item.unitPrice }} Ft</p>
        <v-btn @click="removeFromCart(item.productId)">Eltávolítás</v-btn>
      </v-card-text>
    </v-card>

    <v-divider class="my-6"></v-divider>

    <p class="text-h6">Végösszeg: {{ cartTotal }} Ft</p>
    <v-btn color="primary" @click="placeOrder">Megrendelés leadása</v-btn>
  </v-container>
</template>

<script>
export default {
  computed: {
    cartItems() {
      return this.$store.getters["cart/cartItems"];
    },
    cartTotal() {
      return this.$store.getters["cart/cartTotal"];
    },
  },
  methods: {
    getProduct(id) {
      return this.$store.getters["data/getData"]("products")[id] || {};
    },
    removeFromCart(productId) {
      this.$store.dispatch("cart/removeFromCart", productId);
    },
    placeOrder() {
      console.log("placeorder");
      this.$store.dispatch("cart/placeOrder");
    },
  },
};
</script>
