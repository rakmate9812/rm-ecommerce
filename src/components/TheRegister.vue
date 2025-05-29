<template>
  <div>
    <h2 class="text-center">Regisztráció</h2>
    <form @submit.prevent="handleRegister" class="auth-form">
      <input v-model="name" type="text" placeholder="Név" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Jelszó" required />
      <button type="submit">Gyerünk 🐱</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { register, getAuthErrorMessage } from "@/services/firebaseAuthService";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async handleRegister() {
      this.error = "";

      try {
        await register(this.email, this.password, this.name);
        this.$router.push("/user");
      } catch (err) {
        console.log(err);
        this.error = getAuthErrorMessage(err.code);
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
