<template>
  <div class="user">
    <h1>User Page</h1>
    <p v-if="user">Welcome, {{ user.email }}</p>
  </div>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default {
  data() {
    return {
      user: null,
    };
  },
  created() {
    onAuthStateChanged(auth, (currentUser) => {
      this.user = currentUser;
      console.log(this.user)
    });
  },
};
</script>
