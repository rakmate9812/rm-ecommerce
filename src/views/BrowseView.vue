<!-- this is browse screen but also the Home page -->
<template>
  <div>Products: {{ products }}</div>
</template>

<script>
export default {
  data() {
    return {
      products: ["kutyakaja", "macskaalom"],
    };
  },
};
</script>

<style></style>
