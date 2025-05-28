<template>
  <div class="logout-wrapper">
    <v-btn color="error" @click="handleLogout">Kijeletkezés</v-btn>
  </div>
</template>

<script>
import { logout } from "@/services/firebaseAuthService";

export default {
  methods: {
    async handleLogout() {
      try {
        await logout();
        this.$router.push("/");
      } catch (err) {
        console.error("Logout failed:", err.message);
      }
    },
  },
};
</script>

<style scoped>
.logout-wrapper {
  text-align: center;
  margin-top: 20px;
}
</style>
