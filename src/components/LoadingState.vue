<!-- Wrap this component around another where we have to wait for asnyc operations (eq data request) to happen -->
<template>
  <div>
    <div v-if="loading" class="text-center my-10">
      <v-progress-circular indeterminate color="secondary" size="50"></v-progress-circular>
    </div>

    <div v-else-if="notFound" class="text-center my-16">
      <v-icon v-if="icon" size="64" color="error">mdi-alert-circle-outline</v-icon>
      <h2 class="text-h5 mt-4 mb-2">{{ errorText }}</h2>
      <v-btn v-if="homeButton" class="mt-6" color="secondary" @click="navigateHome">
        <v-icon start>mdi-home</v-icon> Vissza a főoldalra
      </v-btn>
    </div>

    <!-- here will be the content when loading finished succesfully -->
    <slot v-else></slot>
  </div>
</template>

<script>
export default {
  name: "LoadingState",
  props: {
    loading: {
      type: Boolean,
      required: true,
    },

    // This should be a boolean variable which decides that the item was loaded succesfully or not
    notFound: {
      type: Boolean,
      required: true,
    },

    errorText: {
      type: String,
      default: "Hiba történt",
    },

    icon: {
      type: Boolean,
      default: false,
    },

    homeButton: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    navigateHome() {
      this.$router.push("/");
    },
  },
};
</script>
