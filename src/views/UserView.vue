<template>
  <v-container class="user-view" fluid>
    <h1 class="text-center">Szia {{ user.name }}!</h1>

    <div v-if="isAuthenticated">
      <p class="text-center">
        Be vagy jelentkezve mint <strong>{{ user.email }}</strong>
      </p>
      <TheLogout />

      <v-divider class="my-5"></v-divider>

      <h3 class="mb-5">Korábbi rendeléseid</h3>
      <loading-state :loading="loading" :notFound="notFound" error-text="Még nincs rendelésed 🐩">
        <div v-if="orders.length">
          <v-card v-for="order in orders" :key="order.id" class="mb-3 order-card" @click="goToOrder(order.id)">
            <v-card-title class="justify-space-between">
              <span>{{ formatCurrency(order.totalPrice) }}</span>
              <div></div>
              <small>{{ formatDate(order.creationDate) }}</small>
            </v-card-title>
          </v-card>
        </div>

        <p v-else class="mt-4">Jelenleg nincs rendelésed.</p>
      </loading-state>
    </div>

    <div v-else class="auth-container">
      <h3>Jelentkezz be, vagy regisztrálj</h3>
      <div class="toggle-buttons">
        <v-btn @click="authMode = 'login'" :color="authMode === 'login' ? 'secondary' : 'grey'"> Bejelentkezés </v-btn>
        <v-btn @click="authMode = 'register'" :color="authMode === 'register' ? 'secondary' : 'grey'">
          Regisztráció
        </v-btn>
      </div>

      <div class="form-wrapper">
        <TheLogin v-if="authMode === 'login'" />
        <TheRegister v-else />
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import TheLogin from "@/components/TheLogin.vue";
import TheRegister from "@/components/TheRegister.vue";
import TheLogout from "@/components/TheLogout.vue";
import LoadingState from "@/components/LoadingState.vue";

export default {
  components: {
    TheLogin,
    TheRegister,
    TheLogout,
    LoadingState,
  },
  data() {
    return {
      authMode: "login",
      loading: false,
      notFound: false,
    };
  },
  computed: {
    ...mapState("user", ["user"]),
    ...mapGetters("user", ["isAuthenticated", "userOrdersList"]),
    orders() {
      return this.userOrdersList;
    },
  },
  methods: {
    ...mapActions("user", ["fetchUserOrders"]),

    async loadOrders() {
      this.loading = true;
      this.notFound = false;
      try {
        await this.fetchUserOrders();
        this.notFound = !this.orders.length;
      } catch (error) {
        console.error("Error loading orders:", error);
        this.notFound = true;
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return "nincs adat";
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleString("hu-HU", options);
    },

    formatCurrency(amount) {
      if (amount === undefined) return "Ismeretlen";
      return new Intl.NumberFormat("hu-HU", {
        style: "currency",
        currency: "HUF",
        maximumFractionDigits: 0,
      }).format(amount);
    },

    goToOrder(orderId) {
      this.$router.push(`/order/${orderId}`);
    },
  },

  mounted() {
    if (this.isAuthenticated) {
      this.loadOrders();
    }
  },
};
</script>

<style scoped>
.user-view {
  max-width: 600px;
  margin: auto;
}

.toggle-buttons {
  display: flex;
  justify-content: center;
  margin: 10px 0 30px;
  gap: 10px;
}

.form-wrapper {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
}

.auth-container {
  margin-top: 10px;
}

.order-card {
  cursor: pointer;
  transition: 0.2s ease;
}

.order-card:hover {
  background-color: #f5f5f5;
}
</style>
