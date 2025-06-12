<template>
  <v-container>
    <div v-if="!isAuthenticated">
      <v-alert type="warning">Jelentkezz be a rendelés megtekintéséhez!</v-alert>
    </div>

    <div v-else-if="loading">
      <v-progress-circular indeterminate color="secondary"></v-progress-circular>
      <div class="mt-2">Rendelés betöltése...</div>
    </div>

    <div v-else-if="!order">
      <v-alert type="error">Nem található a rendelés.</v-alert>
    </div>

    <div v-else>
      <h1 class="text-2xl font-bold mb-4">Rendelés adatai</h1>

      <v-card class="mb-4">
        <v-card-title>Szállítási adatok</v-card-title>
        <v-card-text>
          <p><strong>Név:</strong> {{ order.deliveryData.name }}</p>
          <p><strong>Telefonszám:</strong> {{ order.deliveryData.phone }}</p>
          <p><strong>Cím:</strong> {{ order.deliveryData.address }}</p>
          <p>
            <strong>Szállítás módja:</strong>
            {{ order.deliveryData.method === "home" ? "Házhoz szállítás" : "Személyes átvétel" }}
          </p>
        </v-card-text>
      </v-card>

      <v-card class="mb-4">
        <v-card-title>Rendelt termékek</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(item, index) in order.items" :key="index">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                Mennyiség: {{ item.quantity }} | Darab ár: {{ item.unitPrice }} Ft
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-title>Végösszeg</v-card-title>
        <v-card-text>
          <h2 class="text-xl font-bold">{{ order.totalPrice || order.total }} Ft</h2>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchDataFromDatabase } from "@/services/firebaseDbService";

export default {
  data() {
    return {
      order: null,
      loading: true,
    };
  },

  computed: {
    ...mapGetters("user", ["isAuthenticated"]),
  },

  async created() {
    if (!this.isAuthenticated) {
      this.loading = false;
      return;
    }

    const orderId = this.$route.params.orderId;

    try {
      const data = await fetchDataFromDatabase(`orders/${orderId}`);

      if (data) {
        this.order = data;
      } else {
        this.$router.push("/");
      }
    } catch (error) {
      console.error("Hiba a rendelés lekérése közben:", error);
      this.$router.push("/");
    } finally {
      this.loading = false;
    }
  },
};
</script>
