<template>
  <div id="app">
    <div class="custom-app-bar">
      <TheAppMenu @logoClick="refreshMainView" />
    </div>
    <router-view :key="mainViewKey" />
  </div>
</template>

<script>
import TheAppMenu from "@/components/TheAppMenu.vue";

export default {
  components: {
    TheAppMenu,
  },
  data() {
    return {
      mainViewKey: 0,
    };
  },
  async created() {
    await this.$store.dispatch("fetchData", "categories");
    await this.$store.dispatch("fetchData", "subcategories");
    await this.$store.dispatch("fetchData", "products");
  },
  methods: {
    // When this happens, the BrowseView.vue will be mounted again on screen, without relaoding any data from firebase
    refreshMainView() {
      if (this.$route.path === "/") {
        this.mainViewKey += 1;
      } else {
        this.$router.push("/");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
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

.custom-app-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: white;
  border-bottom: 1px solid #ccc;
}
</style>
