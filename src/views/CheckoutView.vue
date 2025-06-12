<template>
  <v-container>
    <div v-if="cartItems.length === 0">Tegyen termékeket először a kosárba!</div>
    <div v-else>
      <h1 class="text-2xl font-bold mb-4">Szállítási beállítások</h1>

      <v-form ref="form">
        <v-text-field v-model="deliveryData.name" label="Név" required />
        <v-text-field v-model="deliveryData.phone" label="Telefonszám" required />
        <v-text-field v-model="deliveryData.address" label="Cím" required />

        <v-radio-group v-model="deliveryData.method" label="Szállítás módja" required>
          <v-radio label="Házhoz szállítás" value="home" />
          <v-radio label="Személyes átvétel" value="pickup" />
        </v-radio-group>

        <v-btn color="primary" @click="confirmOrder" prepend-icon="mdi-cart-check">Megrendelés</v-btn>
      </v-form>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      deliveryData: {
        name: "",
        phone: "",
        address: "",
        method: "",
      },
    };
  },
  computed: {
    // ...mapGetters("user", ["isAuthenticated"]),
    ...mapGetters("cart", ["cartItemsDetailed", "cartTotal"]),

    cartItems() {
      return this.cartItemsDetailed;
    },
  },
  methods: {
    async confirmOrder() {
      // Simple validation
      const { name, phone, address, method } = this.deliveryData;
      if (!name || !phone || !address || !method) {
        alert("Kérlek, töltsd ki az összes mezőt.");
        return;
      }

      if (!confirm("Megerősíted a megrendelést?")) return;

      try {
        const orderId = await this.$store.dispatch("orders/placeOrder", {
          deliveryData: this.deliveryData,
          cartItems: this.cartItemsDetailed,
          total: this.cartTotal,
        });

        console.log("Order ID:", orderId);

        // Optionally redirect after order
        this.$router.push(`/order/${orderId}`);
      } catch (error) {
        console.error("Order placement failed:", error);
        alert("Hiba történt a rendelés leadásakor.");
      }
    },
  },
};
</script>
