<template>
  <v-container class="user-view" fluid>
    <h1 class="text-center">Szia!</h1>

    <div v-if="user">
      <p class="text-center">
        Be vagy jelentkezve mint <strong>{{ user.email }}</strong>
      </p>
      <TheLogout />
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
</style>
