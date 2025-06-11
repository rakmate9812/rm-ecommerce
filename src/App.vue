<template>
  <div id="app">
    <BaseModal :visible="modal.visible" :message="modal.message" @ok="onOk" @cancel="onCancel" />
    <div class="custom-app-bar">
      <TheAppMenu @logoClick="refreshMainView" />
    </div>
    <router-view :key="mainViewKey" />
  </div>
</template>

<script>
import TheAppMenu from "@/components/TheAppMenu.vue";
import { mapState, mapMutations } from "vuex";
import BaseModal from "@/components/BaseModal.vue";

export default {
  components: {
    TheAppMenu,
    BaseModal,
  },

  data() {
    return {
      mainViewKey: 0,
    };
  },

  async created() {
    await this.$store.dispatch("data/fetchData", "categories");
    await this.$store.dispatch("data/fetchData", "subcategories");
    await this.$store.dispatch("data/fetchData", "products");
    await this.$store.dispatch("cart/fetchCart");
  },

  methods: {
    ...mapMutations("modal", ["hideModal"]),

    // When this happens, the BrowseView.vue will be mounted again on screen, without relaoding any data from firebase
    refreshMainView() {
      if (this.$route.path === "/") {
        this.mainViewKey += 1;
      } else {
        this.$router.push("/");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    // MODAL OPERATIONS
    onOk() {
      this.hideModal();
      this.$emit("modalOk");
      // Optionally trigger a global event or use a Promise resolver
    },

    onCancel() {
      this.hideModal();
      this.$emit("modalCancel");
      // Optionally trigger a global event or Promise reject
    },
  },

  computed: {
    ...mapState("modal", ["modal"]),
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
