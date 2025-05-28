<template>
  <div>
    <h2 class="text-center">Regisztráció</h2>
    <form @submit.prevent="handleRegister" class="auth-form">
      <input v-model="name" type="text" placeholder="Név" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Jelszó" required />
      <button type="submit">Gyerünk 🐱</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </form>
  </div>
</template>

<script>
import { register } from "@/services/firebaseAuthService";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async handleRegister() {
      this.errorMessage = "";
      this.successMessage = "";

      try {
        await register(this.email, this.password, this.name);
        this.successMessage = "Registration successful!";
        this.$router.push("/");
      } catch (err) {
        this.errorMessage = err.message;
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

.success {
  color: green;
}
</style>
