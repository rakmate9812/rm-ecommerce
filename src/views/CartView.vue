<template>
  <v-container class="py-8">
    <h1 class="text-3xl font-bold mb-6">🛒 Kosár</h1>
    <loading-state
      :loading="loading"
      :not-found="noItemsFoundinCart"
      error-text="Üres. Adjon hozzá termékeket a vásárláshoz!"
      :home-button="true">
      <v-row justify="center">
        <v-col cols="12" md="10">
          <!-- Desktop Table -->
          <v-table class="elevation-1 rounded-lg desktop-table">
            <thead>
              <tr>
                <th class="text-left text-sm font-semibold">Termék</th>
                <th class="text-center text-sm font-semibold">Darabszám</th>
                <th class="text-right text-sm font-semibold">Egységár (Ft)</th>
                <th class="text-right text-sm font-semibold">Összesen (Ft)</th>
                <th class="text-center text-sm font-semibold">Törlés</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in cartItems"
                :key="item.productId"
                class="hover:bg-gray-50 cursor-pointer"
                @click="goToProduct(item.productId)">
                <td>{{ item.name }}</td>
                <td class="text-center">
                  <v-btn icon size="small" variant="text" @click.stop="decrementQuantity(item.productId)">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <span class="mx-2 font-medium">{{ item.quantity }}</span>
                  <v-btn icon size="small" variant="text" @click.stop="incrementQuantity(item.productId)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </td>
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

          <!-- Mobile Cards -->
          <div class="mobile-cart">
            <v-card
              v-for="item in cartItems"
              :key="item.productId"
              class="mb-4 cart-item-card"
              @click="goToProduct(item.productId)">
              <v-card-text>
                <div class="product-name mb-2">{{ item.name }}</div>

                <div class="d-flex justify-space-between align-center mb-2">
                  <div class="quantity-controls">
                    <v-btn icon size="small" variant="text" @click.stop="decrementQuantity(item.productId)">
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                    <span class="mx-2 font-medium">{{ item.quantity }}</span>
                    <v-btn icon size="small" variant="text" @click.stop="incrementQuantity(item.productId)">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </div>
                  <v-btn icon color="error" size="small" variant="text" @click.stop="removeFromCart(item.productId)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>

                <div class="d-flex justify-space-between price-row">
                  <span class="text-grey">{{ item.unitPrice }} Ft/db</span>
                  <span class="font-weight-bold">{{ item.quantity * item.unitPrice }} Ft</span>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <v-divider class="my-8"></v-divider>

          <div class="text-right mobile-checkout">
            <p class="text-xl font-bold mb-4">Végösszeg: {{ cartTotal }} Ft</p>
            <v-btn color="primary" size="large" @click="checkout" prepend-icon="mdi-calendar" block>
              Tovább a szállításhoz
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </loading-state>
  </v-container>
</template>

<script>
import LoadingState from "@/components/LoadingState.vue";
export default {
  components: { LoadingState },

  data() {
    return {
      loading: true,
      noItemsFoundinCart: true,
    };
  },

  computed: {
    cartItems() {
      return this.$store.getters["cart/cartItemsDetailed"];
    },

    cartTotal() {
      return this.$store.getters["cart/cartTotal"];
    },
  },

  created() {
    this.fetchCartData();
  },

  mounted() {
    window.scrollTo(0, 0);
  },

  methods: {
    async fetchCartData() {
      this.loading = true;
      await this.$store.dispatch("cart/fetchCart");
      this.evaluateCartState();
    },

    evaluateCartState() {
      this.noItemsFoundinCart = this.cartItems.length === 0;
      this.loading = false;
    },

    incrementQuantity(productId) {
      this.$store.dispatch("cart/modifyQuantity", { productId, quantity: 1 });
    },

    decrementQuantity(productId) {
      const item = this.cartItems.find((item) => item.productId === productId);
      if (item && item.quantity > 1) {
        this.$store.dispatch("cart/modifyQuantity", { productId, quantity: -1 });
      }
    },

    removeFromCart(productId) {
      this.$store.dispatch("cart/removeFromCart", productId);
    },

    checkout() {
      if (!this.$store.getters["user/isAuthenticated"]) {
        this.$store.commit("modal/showModal", "A továbbiakhoz be kell jelentkezz!");
        return;
      }

      this.$router.push("/checkout");
    },

    goToProduct(productId) {
      this.$router.push(`/product/${productId}`);
    },
  },

  watch: {
    cartItems: {
      handler(/*newValue, oldValue*/) {
        // Avoid evaluating on initial empty state while loading
        if (!this.loading) {
          this.evaluateCartState();
        }
      },
    },
  },
};
</script>

<style scoped>
.desktop-table {
  /* display: none; */
}

/* Mobile Styles */
.mobile-cart {
  display: none;
}

@media (max-width: 768px) {
  .desktop-table {
    display: none;
  }

  .mobile-cart {
    display: block;
  }

  .cart-item-card {
    cursor: pointer;
  }

  .product-name {
    font-size: 1.1rem;
    font-weight: 500;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
  }

  .price-row {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #eee;
  }

  .mobile-checkout {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 16px;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    margin: 0 -16px;
  }
}

.cart-item-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.cart-item-card:hover {
  transform: translateY(-2px);
}

.price-row {
  font-size: 0.875rem;
}

.mobile-checkout {
  display: block;
}

@media (min-width: 768px) {
  .mobile-checkout {
    display: none;
  }
}
</style>
