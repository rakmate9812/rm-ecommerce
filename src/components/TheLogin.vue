<template>
  <div>
    <h2 class="text-center">Bejelentkezés</h2>
    <form @submit.prevent="handleLogin" class="auth-form">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Jelszó" required />
      <button type="submit">Gyerünk 🐶</button>
      <p v-if="error" class="error">{{ error }}</p>
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
        this.$router.push("/user");
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.auth-form input {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.auth-form button {
  padding: 10px;
  background-color: rgba(67, 127, 127);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.error {
  color: red;
}
</style>
