<template>
  <div>
    <v-container fluid>
      <v-slide-group show-arrows center-active>
        <v-slide-group-item v-for="subcategory in filteredSubcategories" :key="subcategory.id">
          <v-card
            :class="{ active: selectedSubcategory === subcategory.id }"
            @click="selectSubcategory(subcategory.id)">
            <v-img cover :src="subcategory.image" alt="subcategory image" height="80%"></v-img>
            <v-card-text>{{ subcategory.name }}</v-card-text>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
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
      selectedSubcategory: null, // No subcategory selected by default
    };
  },
  computed: {
    // Filter subcategories based on selectedCategoryId
    filteredSubcategories() {
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
  border-radius: 12px;
  z-index: 1;
}

.v-card.active {
  border: 2px solid rgba(67, 127, 127); /* Highlight active tile */
}

.v-card .v-img {
  border-radius: 12px;
  object-fit: cover;
  border-bottom: 1px solid #ddd; /* Separate image from text */
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
