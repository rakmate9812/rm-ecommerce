<template>
  <div>
    <v-container fluid>
      <v-slide-group show-arrows center-active>
        <v-slide-group-item v-for="subcategory in subcategories" :key="subcategory.name">
          <v-card
            :class="{ active: selectedSubcategory === subcategory.name }"
            @click="selectSubcategory(subcategory.name)">
            <v-img cover :src="subcategory.image" alt="subcategory image" height="80%"></v-img>
            <v-card-text>{{ subcategory.name }}</v-card-text>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </v-container>
    <!-- <p class="selected-text">Selected subcategory: {{ selectedSubcategory }}</p> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      subcategories: [
        {
          name: "Száraz kutyatáp",
          image:
            "https://images.unsplash.com/photo-1655210913315-e8147faf7600?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          name: "Nedves kutyatáp",
          image:
            "https://images.unsplash.com/photo-1696507398173-863ae397a059?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          name: "Jutalomfalatok kutyáknak",
          image:
            "https://images.unsplash.com/photo-1582798358481-d199fb7347bb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          name: "Kiegészítők kutyáknak",
          image:
            "https://plus.unsplash.com/premium_photo-1692392181661-96c4b34759db?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          name: "Vitaminok kutyáknak",
          image:
            "https://plus.unsplash.com/premium_photo-1668087352456-8d15bbefdacf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          name: "Kutya ápolás",
          image:
            "https://images.unsplash.com/photo-1528846104175-4fd300ee59da?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          name: "Vissza az elejére",
          image:
            "https://plus.unsplash.com/premium_photo-1699544856963-49c417549268?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      selectedSubcategory: null, // No subcategory selected by default
    };
  },
  methods: {
    selectSubcategory(name) {
      this.selectedSubcategory = name;
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

.selected-text {
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
  color: #555;
}
</style>
