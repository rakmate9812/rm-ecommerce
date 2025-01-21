<!-- This is the browse screen but also the Home page -->
<template>
  <div>
    <TheCategories />
    <TheSaleItems />
    <TheSubCategories />
    <v-container class="separator-line" fluid></v-container>
    <ShowProducts></ShowProducts>
  </div>
</template>

<script>
import ShowProducts from "@/components/ShowProducts.vue";
import TheCategories from "@/components/TheCategories.vue";
import TheSaleItems from "@/components/TheSaleItems.vue";
import TheSubCategories from "@/components/TheSubCategories.vue";

export default {
  components: { TheCategories, TheSaleItems, TheSubCategories, ShowProducts },

  data() {
    return {
      products: ["kutyakaja", "macskaalom"],
    };
  },
};
</script>

<style scoped>
.separator-line {
  background-color: #f5f5f5;
}
</style>
