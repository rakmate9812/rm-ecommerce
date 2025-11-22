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

          <v-radio-group v-model="deliveryData.method" label="Szállítás és fizetés módja" required>
            <v-radio label="Házhoz szállítás utánvéttel" value="home" />
            <v-radio label="Online fizetés (hamarosan)" disabled value="online" />
          </v-radio-group>

          <!-- Price Summary -->
          <v-card class="mb-4 pa-4" outlined>
            <div class="price-summary">
              <div class="d-flex justify-space-between mb-2">
                <span>Részösszeg</span>
                <span class="">{{ $store.getters["data/formatPrice"](cartSubtotal) }} Ft</span>
              </div>

              <div v-if="discountPercentage > 0" class="d-flex justify-space-between mb-2 text-success">
                <span>{{ discountForAllText }} ({{ discountPercentage }}%)</span>
                <span class="">-{{ $store.getters["data/formatPrice"](discountAmount) }} Ft</span>
              </div>

              <v-divider class="my-2"></v-divider>

              <div class="d-flex justify-space-between">
                <span class="text-h6">Végösszeg</span>
                <span class="text-h6 text-secondary">{{ $store.getters["data/formatPrice"](cartTotal) }} Ft</span>
              </div>
            </div>
          </v-card>

          <!-- Desktop order button: hidden on mobile via CSS -->
          <v-btn color="primary" @click="openConfirmModal" prepend-icon="mdi-cart-check" class="desktop-order-btn">
            Megrendelés
          </v-btn>
        </v-form>
      </div>
    </div>

    <!-- Mobile sticky checkout (visible only on small screens) -->
    <div class="mobile-checkout">
      <p class="text-lg font-bold mb-2">Végösszeg {{ $store.getters["data/formatPrice"](cartTotal) }} Ft</p>
      <v-btn color="primary" size="large" @click="openConfirmModal" prepend-icon="mdi-cart-check" block>
        Megrendelés
      </v-btn>
    </div>

    <!-- Modals -->
    <BaseModal
      :visible="showValidationModal"
      message="Kérlek, töltsd ki az összes mezőt!"
      @ok="showValidationModal = false" />

    <BaseModal
      :visible="showConfirmModal"
      :message="confirmMessage"
      :cancel-visible="true"
      @ok="placeOrder"
      @cancel="showConfirmModal = false" />
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import BaseModal from "@/components/BaseModal.vue";

export default {
  components: { BaseModal },
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
    ...mapGetters("cart", ["cartItemsDetailed", "cartSubtotal", "cartTotal", "discountPercentage", "discountAmount"]),
    discountForAllText() {
      return this.$store.getters["storeConfig/discountForAllText"];
    },
    cartItems() {
      return this.cartItemsDetailed;
    },

    confirmMessage() {
      return `Megerősíted a megrendelést?`;
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
        const details = {
          deliveryData: { ...this.deliveryData },
          subtotal: this.cartSubtotal,
          discountPercentage: this.discountPercentage,
          discountAmount: this.discountAmount,
          discountText: this.discountForAllText,
          total: this.cartTotal,
        };

        const orderId = await this.$store.dispatch("orders/placeOrder", {
          cartItems: this.cartItemsDetailed,
          details,
        });

        this.$router.push(`/order/${orderId}`);
      } catch (error) {
        console.error("Order placement failed:", error);
        this.isPlacingOrder = false;
        alert("Hiba történt a megrendelés feldolgozásakor!");
      }
    },
  },
};
</script>

<style scoped>
/* Keep desktop view unchanged */

/* Mobile styles aligned with CartView behavior */
.mobile-checkout {
  display: none;
}

/* hide the inline desktop button on mobile so we only show the sticky footer there */
.desktop-order-btn {
  display: inline-flex;
}

.price-summary {
  font-size: 1rem;
}

.text-success {
  color: #4caf50;
}

/* Mobile-specific rules */
@media (max-width: 768px) {
  /* Show sticky mobile checkout footer */
  .mobile-checkout {
    display: block;
    position: sticky;
    bottom: 0;
    background: white;
    padding: 12px 16px;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    margin: 0 -16px;
    z-index: 20;
  }

  /* Make the desktop button hidden on small screens to avoid duplicate action controls */
  .desktop-order-btn {
    display: none;
  }

  /* Slight font-size adjustments for better fit on small screens */
  h1 {
    font-size: 1.4rem;
  }
  .text-2xl {
    font-size: 1.125rem;
  }
}

/* Keep desktop-only behavior: hide mobile footer on larger screens */
@media (min-width: 769px) {
  .mobile-checkout {
    display: none;
  }
}
</style>
