<template>
  <div>
    <v-container fluid>
      <v-row align="center" justify="space-between">
        <v-col cols="2">
          <!-- Logo that emits event to parent (App.vue) -->
          <img src="@/assets/logo.png" @click="$emit('logoClick')" alt="Logo" class="logo-icon" />
        </v-col>

        <v-col>
          <v-row class="search-row ml-8">
            <v-text-field
              v-model="searchText"
              @click:append-inner="loadData"
              @keyup.enter="loadData"
              append-inner-icon="mdi-magnify"
              variant="solo"
              density="compact"
              single-line
              hide-details
              placeholder="Keresés"
              clearable />
          </v-row>
        </v-col>

        <v-col cols="5" class="nav-button-col">
          <v-btn class="nav-button" variant="text" to="/user">
            <v-icon left class="me-2">mdi-account</v-icon>
            Fiók
          </v-btn>
          <v-btn class="nav-button" variant="text" @click="toFavorites">
            <v-icon left class="me-2">mdi-heart</v-icon>
            Későbbre mentve
          </v-btn>
          <v-btn class="nav-button" variant="text" to="/cart">
            <v-icon left class="me-2">mdi-cart</v-icon>
            Bevásárlókocsi
          </v-btn>
          <v-btn v-if="isAdmin" class="nav-button my-2" variant="text" to="/admin">
            <v-icon left class="me-2">mdi-cog</v-icon>
            Admin
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: null,
    };
  },
  methods: {
    loadData() {
      alert(this.searchText);
    },

    toFavorites() {
      if (!this.$store.state.user) {
        this.$store.commit("showModal", "A kedvencek eléréséhez be kell jelentkezz!");
        return;
      }

      this.$router.push("/favourites");
    },
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
  },
};
</script>

<style scoped>
.nav-button-col {
  margin: auto;
  padding: 0 0 0 4em;
}

.logo-icon {
  width: 10rem;
  cursor: pointer;
}

.logo-btn {
  padding: 0;
  min-width: 0;
}

.search-row {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-button {
  font-size: 0.75em;
  margin-right: 0.5em;
}

.nav-button:hover {
  color: rgb(65, 20, 0);
}
</style>
