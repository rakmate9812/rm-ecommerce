<template>
  <div>
    <p>mind:</p>
    {{ products }}
    <p>ujabbak:</p>
    <v-btn @click="test">Test</v-btn>
  </div>
</template>

<script>
export default {
  name: "ProductsPage",

  methods: {
    test() {
      // Iterating through an object
      Object.entries(this.products).forEach(([key, value]) => {
        console.log("Key:", key);
        console.log("Name:", value.name);
        console.log("Price:", value.price);
        console.log("Creation Date:", value.creationDate);
      });

      console.log("-");

      // Logging only values
      Object.values(this.products).forEach((item) => {
        console.log("Name:", item.name);
        console.log("Price:", item.price);
      });

      console.log("-");

      // Logging only keys
      Object.keys(this.products).forEach((key) => {
        console.log("Key:", key);
      });
    },
  },

  computed: {
    products() {
      return this.$store.state.data.products || {};
    },

    testingProducts() {
      // console.log(this.products);
      const twoDaysAgo = new Date().toISOString();

      return twoDaysAgo;
    },
  },
};
</script>
