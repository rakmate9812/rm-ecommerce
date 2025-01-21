<!-- this is the browse screen but also the Home page -->
<template>
  <div class="test">
    <TheCategories />
    <TheSaleItems />
    <TheSubCategories />
    <div>Products: {{ products }}</div>
  </div>
</template>

<script>
import TheCategories from "@/components/TheCategories.vue";
import TheSaleItems from "@/components/TheSaleItems.vue";
import TheSubCategories from "@/components/TheSubCategories.vue";

export default {
  components: { TheCategories, TheSaleItems, TheSubCategories },

  data() {
    return {
      products: ["kutyakaja", "macskaalom"],
    };
  },
};
</script>

<style scoped></style>
