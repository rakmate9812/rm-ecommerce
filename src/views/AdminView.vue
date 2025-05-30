<template>
  <div>
    <DisplayItems />

    <v-container class="separator-line" fluid></v-container>

    <ProductForm />
  </div>
</template>

<script>
import DisplayItems from "@/components/DisplayItems.vue";
import ProductForm from "@/components/ProductForm.vue";

export default {
  components: {
    DisplayItems,
    ProductForm,
  },
};
</script>

<style scoped>
.separator-line {
  background-color: #f5f5f5;
}
</style>
