<template>
  <div>
    {{ products }}
  </div>
</template>

<script>
export default {
  name: "ProductsPage",
  computed: {
    products() {
      return this.$store.getters.getData; 
    },
  },
  async created() {
    try {
      // Fetch store data when the component is created
      await this.$store.dispatch("fetchData", "products"); // First param is the function name, second is the fn first param
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },
};
</script>
