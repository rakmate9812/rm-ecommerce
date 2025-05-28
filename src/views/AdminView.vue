<template>
  <div>
    <DisplayItem />

    <v-container class="separator-line" fluid></v-container>

    <ProductForm />
  </div>
</template>

<script>
import DisplayItem from "@/components/DisplayItem.vue";
import ProductForm from "@/components/ProductForm.vue";

export default {
  components: {
    DisplayItem,
    ProductForm,
  },
};
</script>

<style scoped>
.separator-line {
  background-color: #f5f5f5;
}
</style>
