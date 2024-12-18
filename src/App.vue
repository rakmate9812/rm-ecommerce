<template>
  <div id="app">
    <TheAppMenu />
    <v-container id="app">
      <router-view />
    </v-container>
  </div>
</template>

<script>
import TheAppMenu from "./components/TheAppMenu.vue";
export default {
  components: { TheAppMenu },
};
</script>

<style>
.test {
  outline: 1px solid red;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
