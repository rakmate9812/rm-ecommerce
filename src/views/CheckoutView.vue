<template>
  <v-container>
    <!-- Spinner during order placement -->
    <div v-if="isPlacingOrder" class="text-center my-10">
      <v-progress-circular indeterminate color="secondary" size="50"></v-progress-circular>
      <div class="mt-4">Megrendelés feldolgozása...</div>
    </div>

    <div v-else>
      <div v-if="cartItems.length === 0">Tegyen termékeket először a kosárba!</div>

      <div v-else>
        <h1 class="text-2xl font-bold mb-4">Szállítási beállítások</h1>

        <v-form ref="form">
          <v-text-field v-model="deliveryData.name" label="Név" required />
          <v-text-field v-model="deliveryData.phone" label="Telefonszám" required />
          <v-text-field v-model="deliveryData.address" label="Cím" required />

          <v-radio-group v-model="deliveryData.method" label="Szállítás módja" required>
            <v-radio label="Házhoz szállítás" value="home" />
            <v-radio label="Személyes átvétel" disabled value="pickup" />
          </v-radio-group>

          <v-btn color="primary" @click="openConfirmModal" prepend-icon="mdi-cart-check"> Megrendelés </v-btn>
        </v-form>
      </div>
    </div>

    <!-- Modals -->
    <BaseModal
      :visible="showValidationModal"
      message="Kérlek, töltsd ki az összes mezőt!"
      @ok="showValidationModal = false" />

    <BaseModal
      :visible="showConfirmModal"
      message="Megerősíted a megrendelést?"
      :cancel-visible="true"
      @ok="placeOrder"
      @cancel="showConfirmModal = false" />
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import BaseModal from "@/components/BaseModal.vue";

export default {
  components: {
    BaseModal,
  },
  data() {
    return {
      deliveryData: {
        name: "",
        phone: "",
        address: "",
        method: "",
      },

      showValidationModal: false,
      showConfirmModal: false,
      isPlacingOrder: false,
    };
  },
  computed: {
    ...mapGetters("cart", ["cartItemsDetailed", "cartTotal"]),
    cartItems() {
      return this.cartItemsDetailed;
    },
  },
  methods: {
    openConfirmModal() {
      const { name, phone, address, method } = this.deliveryData;
      if (!name || !phone || !address || !method) {
        this.showValidationModal = true;
        return;
      }
      this.showConfirmModal = true;
    },

    async placeOrder() {
      this.showConfirmModal = false;
      this.isPlacingOrder = true;

      try {
        const orderId = await this.$store.dispatch("orders/placeOrder", {
          deliveryData: this.deliveryData,
          cartItems: this.cartItemsDetailed,
          total: this.cartTotal,
        });

        this.$router.push(`/order/${orderId}`);
      } catch (error) {
        console.error("Order placement failed:", error);
        this.isPlacingOrder = false;
        alert("Hiba történt a megrendelés feldolgozásakor!");
        // TODO show error modal or feedback here
      }
    },
  },
};
</script>
