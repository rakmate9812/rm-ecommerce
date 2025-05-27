<template>
  <v-container class="user-view" fluid>
    <h1 class="text-center">Welcome to Your Account</h1>

    <div v-if="user">
      <p class="text-center">
        You are logged in as <strong>{{ user.email }}</strong>
      </p>
      <TheLogout />
    </div>

    <div v-else class="auth-container">
      <div class="toggle-buttons">
        <v-btn @click="authMode = 'login'" :color="authMode === 'login' ? 'primary' : 'grey'"> Login </v-btn>
        <v-btn @click="authMode = 'register'" :color="authMode === 'register' ? 'primary' : 'grey'"> Register </v-btn>
      </div>

      <div class="form-wrapper">
        <TheLogin v-if="authMode === 'login'" />
        <TheRegister v-else />
      </div>
    </div>
  </v-container>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import TheLogin from "@/components/TheLogin.vue";
import TheRegister from "@/components/TheRegister.vue";
import TheLogout from "@/components/TheLogout.vue";

export default {
  components: {
    TheLogin,
    TheRegister,
    TheLogout,
  },
  data() {
    return {
      user: null,
      authMode: "login", // or 'register'
    };
  },
  created() {
    onAuthStateChanged(auth, (currentUser) => {
      this.user = currentUser;
    });
  },
};
</script>

<style scoped>
.user-view {
  max-width: 500px;
  margin: auto;
  padding-top: 30px;
}

.toggle-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
}

.form-wrapper {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
}
</style>
