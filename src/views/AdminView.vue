<template>
  <div>
    <!-- Buttons to switch views -->
    <v-btn class="ma-2" @click="$router.push({ path: '/admin', query: { view: 'items' } })" color="primary"
      >Adatbázis nézegető</v-btn
    >
    <v-btn class="ma-2" @click="$router.push({ path: '/admin', query: { view: 'productForm' } })" color="primary"
      >Termékek kezelése</v-btn
    >
    <v-btn class="ma-2" @click="$router.push({ path: '/admin', query: { view: 'orders' } })" color="primary"
      >Megrendelések kezelése</v-btn
    >
    <v-btn class="ma-2" @click="$router.push({ path: '/admin', query: { view: 'settings' } })" color="primary"
      >Webshop beállítások</v-btn
    >

    <v-btn v-if="test" @click="testing" color="primary" class="ma-2">Tesztgomb</v-btn>
    <v-container class="separator-line" fluid></v-container>

    <!-- Conditional component display -->
    <DisplayItems v-if="activeView === 'items'" />
    <ProductForm v-if="activeView === 'productForm'" />
    <ManageOrders v-if="activeView === 'orders'" />
    <StoreSettings v-if="activeView === 'settings'" />
  </div>
</template>

<script>
import DisplayItems from "@/components/DisplayItems.vue";
import ProductForm from "@/components/ProductForm.vue";
import ManageOrders from "@/components/ManageOrders.vue";
import StoreSettings from "@/components/StoreSettings.vue";

export default {
  components: {
    DisplayItems,
    ProductForm,
    ManageOrders,
    StoreSettings,
  },
  data() {
    return {
      activeView: this.$route.query.view || "items", // When clicking back on browser, the state is preserved on the previous component

      test: false,
    };
  },

  methods: {
    testing() {
      // console.log(this.$store.state.data.data.users);
    },
  },

  watch: {
    "$route.query.view"(newVal) {
      this.activeView = newVal || "items"; // updating the route on changing the components
    },
  },
};
</script>

<style scoped>
.separator-line {
  background-color: #f5f5f5;
  height: 2px;
  margin: 16px 0;
}
</style>
