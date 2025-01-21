<template>
  <div id="app">
    <TheAppMenu />
    <router-view />
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
  font-family: "Trebuchet MS", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
}
</style>
