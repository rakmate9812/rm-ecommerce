<!-- for the admin to be able to see any order -->
<template>
  <v-container class="py-8">
    <loading-state
      v-if="isAuthenticated"
      :loading="loading"
      :not-found="orderNotFound"
      error-text="Nem található a rendelés."
      :icon="true"
      :home-button="true">
      <h1 class="text-3xl font-bold mb-8 text-center">Rendelés részletei (Admin)</h1>

      <v-row dense>
        <!-- Order Status Update -->
        <v-col cols="12" class="mt-4">
          <v-card class="rounded-lg elevation-2">
            <v-card-text class="d-flex flex-column gap-4">
              <h2 class="text-xl font-semibold">Rendelés állapota</h2>
              <v-select v-model="selectedStatus" :items="statusOptions" label="Állapot" outlined></v-select>
              <v-btn color="primary" @click="updateOrderStatus">Mentés</v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Delivery Details -->
        <v-col cols="12" md="6">
          <v-card class="rounded-lg elevation-2 h-100">
            <v-card-title class="text-xl font-semibold">Szállítási adatok</v-card-title>
            <v-divider></v-divider>
            <v-card-text class="text-base py-4">
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title><strong>Név:</strong> {{ order.deliveryData.name }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title><strong>Telefonszám:</strong> {{ order.deliveryData.phone }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title><strong>Cím:</strong> {{ order.deliveryData.address }}</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <strong>Szállítás módja:</strong>
                    {{ order.deliveryData.method === "home" ? "Házhoz szállítás utánvéttel" : "??Valami más??" }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Ordered Items -->
        <v-col cols="12" md="6">
          <v-card class="rounded-lg elevation-2 h-100">
            <v-card-title class="text-xl font-semibold">Rendelt termékek</v-card-title>
            <v-divider></v-divider>
            <v-card-text class="py-4">
              <v-row class="font-semibold mb-2">
                <v-col cols="6">Termék</v-col>
                <v-col cols="3" class="text-center">Mennyiség</v-col>
                <v-col cols="3" class="text-right">Egységár</v-col>
              </v-row>
              <v-divider class="mb-3"></v-divider>

              <v-row v-for="(item, index) in order.items" :key="index" class="py-2 align-center">
                <v-col cols="6">{{ item.name }}</v-col>
                <v-col cols="3" class="text-center">{{ item.quantity }} db</v-col>
                <v-col cols="3" class="text-right">{{ item.unitPrice }} Ft</v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Total Price & Discount Summary -->
        <v-col cols="12" class="mt-4">
          <v-card class="rounded-lg elevation-2">
            <v-card-text class="py-4">
              <div class="mb-2 d-flex justify-space-between">
                <span>Részösszeg</span>
                <span>{{ $store.getters["data/formatPrice"](order.subtotal) }} Ft</span>
              </div>
              <div v-if="order.discountPercentage > 0" class="mb-2 d-flex justify-space-between text-success">
                <span>
                  {{ order.discountText ? order.discountText : "Kedvezmény" }} ({{ order.discountPercentage }}%)
                </span>
                <span>-{{ $store.getters["data/formatPrice"](order.discountAmount) }} Ft</span>
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex justify-space-between align-center text-lg">
                <span class="font-semibold">Végösszeg</span>
                <span class="font-bold">{{ $store.getters["data/formatPrice"](order.total) }} Ft</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </loading-state>

    <div v-else>
      <v-alert type="warning" class="my-10 text-center">Valami baj van more!!</v-alert>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { fetchDataFromDatabase } from "@/services/firebaseDbService";
import LoadingState from "@/components/LoadingState.vue";

export default {
  components: { LoadingState },

  data() {
    return {
      order: null,
      loading: true,
      orderNotFound: false,
      selectedStatus: "pending",
      statusOptions: ["pending", "in progress", "completed"],
    };
  },

  computed: {
    ...mapState("user", ["user"]),
    ...mapGetters("user", ["isAuthenticated"]),
  },

  async created() {
    if (!this.isAuthenticated) {
      this.loading = false;
      return;
    }

    const userId = this.$route.params.userId;
    const orderId = this.$route.params.orderId;

    try {
      const data = await fetchDataFromDatabase(`orders/${userId}/${orderId}`);

      if (data) {
        this.order = data;
        this.selectedStatus = data.status || "pending";
      } else {
        this.orderNotFound = true;
      }
    } catch (error) {
      console.error("Hiba a rendelés lekérése közben:", error);
      this.orderNotFound = true;
    } finally {
      this.loading = false;
    }
  },

  methods: {
    ...mapActions("data", ["updateDataInDb"]),

    async updateOrderStatus() {
      const userId = this.$route.params.userId;
      const orderId = this.$route.params.orderId;

      if (!this.order) return;

      const updatedOrder = {
        ...this.order,
        status: this.selectedStatus,
      };

      try {
        await this.updateDataInDb({
          path: `orders/${userId}/${orderId}`,
          data: updatedOrder,
        });

        this.order.status = this.selectedStatus;
        alert("Rendelés állapota frissítve!");
      } catch (error) {
        console.error("Hiba a státusz frissítésekor:", error);
        alert("Hiba történt a mentéskor.");
      }
    },
  },
};
</script>

<style scoped>
.text-success {
  color: #4caf50;
}
</style>
