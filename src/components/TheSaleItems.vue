<template>
  <div class="box">
    <h1>{{ SaleItemsHeaderText }}</h1>
    <h3>{{ SaleItemsSmallerText }}</h3>
  </div>
</template>

<script>
export default {
  computed: {
    SaleItemsHeaderText() {
      return this.$store.getters["config/getConfigValue"]("SaleItemsHeaderText") ?? "Akciós termékek";
    },

    SaleItemsSmallerText() {
      return this.$store.getters["config/getConfigValue"]("SaleItemsSmallerText") ?? "Vásárljon most!";
    },
  },
};
</script>

<style scoped>
* {
  background-color: rgb(249, 232, 224);
}

.box {
  padding: 1em;
}
</style>
