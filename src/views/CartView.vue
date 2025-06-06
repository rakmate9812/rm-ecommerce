<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <h1 class="text-3xl font-bold mb-6">🛒 Kosár</h1>

        <div v-if="cartItems.length === 0" class="text-center py-16">
          <h2 class="text-2xl font-medium mb-4">A kosár üres.</h2>
          <p class="text-gray-600">Adjon hozzá termékeket a vásárláshoz!</p>
        </div>

        <div v-else>
          <v-table class="elevation-1 rounded-lg">
            <thead>
              <tr>
                <th class="text-left text-sm font-semibold">Termék</th>
                <th class="text-right text-sm font-semibold">Darabszám</th>
                <th class="text-right text-sm font-semibold">Egységár (Ft)</th>
                <th class="text-right text-sm font-semibold">Összesen (Ft)</th>
                <th class="text-center text-sm font-semibold">Művelet</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in cartItems"
                :key="item.productId"
                class="hover:bg-gray-50 cursor-pointer"
                @click="goToProduct(item.productId)">
                <td>{{ getProduct(item.productId).name }}</td>
                <td class="text-right">{{ item.quantity }}</td>
                <td class="text-right">{{ item.unitPrice }}</td>
                <td class="text-right">{{ item.quantity * item.unitPrice }}</td>
                <td class="text-center">
                  <v-btn icon color="error" size="small" variant="text" @click.stop="removeFromCart(item.productId)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>

          <v-divider class="my-8"></v-divider>

          <div class="text-right">
            <p class="text-xl font-bold mb-4">Végösszeg: {{ cartTotal }} Ft</p>
            <v-btn color="primary" size="large" @click="placeOrder" prepend-icon="mdi-cart-check">
              Megrendelés leadása
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
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
      this.$store.dispatch("cart/placeOrder");
    },
    goToProduct(productId) {
      this.$router.push(`/products/${productId}`);
    },
  },
};
</script>
