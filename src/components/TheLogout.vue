<template>
    <button @click="handleLogout">Logout</button>
  </template>
  
  <script>
  import { logout } from "@/services/firebaseAuthService";
  
  export default {
    methods: {
      async handleLogout() {
        try {
          await logout();
          this.$router.push("/"); // Redirect after logout
        } catch (err) {
          console.error("Logout failed:", err.message);
        }
      },
    },
  };
  </script>
  