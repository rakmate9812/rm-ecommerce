<template>
  <v-btn :disabled="disabled" :color="color" :variant="variant" @click="handleClick">
    <template v-if="disabled">
      <v-progress-circular indeterminate :color="color" size="20" />
    </template>
    <template v-else>
      <slot />
    </template>
  </v-btn>
</template>

<script>
export default {
  props: {
    debounceTime: {
      type: Number,
      default: 1000,
    },
    color: {
      type: String,
      default: "primary",
    },
    variant: {
      type: String,
      default: "elevated",
    },
  },
  data() {
    return {
      disabled: false,
    };
  },
  methods: {
    async handleClick() {
      if (this.disabled) return;
      this.disabled = true;

      this.$emit("click");

      setTimeout(() => {
        this.disabled = false;
      }, this.debounceTime);
    },
  },
};
</script>
