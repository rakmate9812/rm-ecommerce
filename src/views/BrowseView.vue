<!-- This is the browse screen but also the Home page -->
<template>
  <div>
    <TheCategories />
    <TheSaleItems />
    <TheSubCategories />
    <v-container class="separator-line" fluid></v-container>
    <!-- <ShowProducts></ShowProducts> -->

    <!-- Testing -->
    <TheRegister />
    <TheLogin v-if="!user" />
    <TheLogout v-else />
  </div>
</template>

<script>
// import ShowProducts from "@/components/ShowProducts.vue";
import TheCategories from "@/components/TheCategories.vue";
import TheSaleItems from "@/components/TheSaleItems.vue";
import TheSubCategories from "@/components/TheSubCategories.vue";

// Testing
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import TheRegister from "@/components/TheRegister.vue";
import TheLogin from "@/components/TheLogin.vue";
import TheLogout from "@/components/TheLogout.vue";

export default {
  components: {
    TheCategories,
    TheSaleItems,
    TheSubCategories,
    // ShowProducts,
    TheRegister,
    TheLogin,
    TheLogout,
  },

  data() {
    return {
      user: null,
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
.separator-line {
  background-color: #f5f5f5;
}
</style>
