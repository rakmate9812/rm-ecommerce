<template>
  <div>
    <v-container class="category-navbar" fluid>
      <v-row class="category-row ml-10" no-gutters>
        <v-btn
          v-for="category in categories"
          :key="category.id"
          :class="['category-btn', { active: selectedCategoryId === category.id }]"
          outlined
          @click="selectCategory(category.id)">
          {{ category.name }}
        </v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      required: true,
    },
    selectedCategoryId: {
      type: [String, Number],
      required: true,
    },
  },
  methods: {
    selectCategory(category) {
      this.$emit("categorySelected", category);
    },
  },
};
</script>

<style scoped>
.category-navbar {
  background-color: #f5f5f5;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.category-row {
  display: flex;
  gap: 8px;
}

.category-btn {
  text-transform: none;
  font-weight: 500;
  font-size: 16px;
  border-radius: 20px;
  color: #555;
  border-color: #ccc;
  transition: all 0.1s ease;
}

.category-btn.active {
  color: #fff;
  background-color: rgba(67, 127, 127);
  border-color: #000000;
}

.category-btn:hover {
  color: #000000;
  background-color: rgba(249, 232, 224);
  border-color: #000000;
}

/* Disable hover effect for active category */
.category-btn.active:hover {
  color: #fff;
  background-color: rgba(67, 127, 127);
  border-color: #000000;
}

.selected-text {
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
  color: #555;
}
</style>
