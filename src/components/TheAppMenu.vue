<template>
  <div>
    <v-container class="test">
      <v-row align="center" justify="space-between">
        <v-col>
          <router-link to="/">
            <img src="@/assets/logo.png" alt="Logo" class="logo-icon" />
          </router-link>
        </v-col>
        <v-col>
          <v-btn class="nav-button" text to="/">Kezdőlap</v-btn>
          <v-btn class="nav-button" text to="/about">Rólunk</v-btn>
          <v-btn class="nav-button" text to="/admin">Admin</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style scoped>
.logo-icon {
  width: 250px;
  margin-right: 8px;
}
</style>
