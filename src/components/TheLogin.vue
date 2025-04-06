<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <p v-if="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import { login } from "@/services/firebaseAuthService";
  
  export default {
    data() {
      return {
        email: "",
        password: "",
        error: "",
      };
    },
    methods: {
      async handleLogin() {
        this.error = "";
        try {
          await login(this.email, this.password);
          this.$router.push("/"); // Redirect after login
        } catch (err) {
          this.error = err.message;
        }
      },
    },
  };
  </script>
  