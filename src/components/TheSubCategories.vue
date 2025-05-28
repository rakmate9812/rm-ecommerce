<template>
  <div>
    <v-container fluid>
      <v-slide-group show-arrows center-active v-if="subcategories.length">
        <v-slide-group-item v-for="subcategory in subcategories" :key="subcategory.id">
          <v-card
            :class="{ active: selectedSubcategory === subcategory.id }"
            @click="selectSubcategory(subcategory.id)">
            <v-img cover :src="subcategory.image" alt="subcategory image" height="80%"></v-img>
            <v-card-text>{{ subcategory.name }}</v-card-text>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>

      <!-- No subcategories available -->
      <div v-else class="text-center my-5">
        <p>No subcategories available for this category.</p>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    subcategories: {
      type: Array,
      required: true,
    },
    selectedCategoryId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      selectedSubcategory: null,
    };
  },

  computed: {
    filteredSubcategories() {
      // Show all subcategories if categoryId is "1"
      if (String(this.selectedCategoryId) === "1") {
        return this.subcategories;
      }
      return this.subcategories.filter(
        (subcategory) => String(subcategory.categoryId) === String(this.selectedCategoryId)
      );
    },
  },

  methods: {
    selectSubcategory(id) {
      this.selectedSubcategory = id;
      this.$emit("subcategorySelected", id);
    },
  },
};
</script>

<style scoped>
.v-container {
  margin-top: 0.5em;
}

.v-slide-group {
  max-width: 100%;
  padding: 0 0 0 3em;
}

.v-card {
  width: 12em;
  height: 12em;
  cursor: pointer;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
  margin: 10px;
}

.v-card:hover {
  transform: scale(1.07);
  z-index: 1;
}

.v-card.active {
  border: 2px solid rgba(67, 127, 127);
}

.v-card .v-img {
  border-radius: 12px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
}

.v-card .v-card-text {
  padding: 10px 0 0 5px;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
