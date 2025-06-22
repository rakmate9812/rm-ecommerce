<template>
  <div>
    <!-- Buttons to switch views -->
    <v-btn @click="activeView = 'items'" color="primary" class="ma-2">Adatbázis nézegető</v-btn>
    <v-btn @click="activeView = 'productForm'" color="primary" class="ma-2">Termékek kezelése</v-btn>
    <v-btn @click="activeView = 'orders'" color="primary" class="ma-2">Megrendelések kezelése</v-btn>

    <v-btn @click="testing" color="primary" class="ma-2">Tesztgomb</v-btn>
    <v-container class="separator-line" fluid></v-container>

    <!-- Conditional component display -->
    <DisplayItems v-if="activeView === 'items'" />
    <ProductForm v-if="activeView === 'productForm'" />
    <ManageOrders v-if="activeView === 'orders'" />
  </div>
</template>

<script>
import DisplayItems from "@/components/DisplayItems.vue";
import ProductForm from "@/components/ProductForm.vue";
import ManageOrders from "@/components/ManageOrders.vue";

export default {
  components: {
    DisplayItems,
    ProductForm,
    ManageOrders,
  },
  data() {
    return {
      activeView: "items", // default view
    };
  },

  methods: {
    testing() {
      console.log(this.$store.state.data.data.users);
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
