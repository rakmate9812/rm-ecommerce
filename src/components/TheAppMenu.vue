<template>
  <div>
    <v-container fluid>
      <!-- desktop row -->
      <v-row align="center" justify="space-between" class="desktop-row">
        <v-col cols="2">
          <img src="@/assets/logo.png" @click="logo" alt="Logo" class="logo-icon" />
        </v-col>

        <v-col>
          <v-row class="search-row ml-8">
            <v-text-field
              v-model="searchText"
              @click:append-inner="loadSearchData"
              @keyup.enter="loadSearchData"
              append-inner-icon="mdi-magnify"
              variant="solo"
              density="compact"
              single-line
              hide-details
              placeholder="Keresés"
              clearable
              @click:clear="clearSearch" />
          </v-row>
        </v-col>

        <v-col cols="5" class="nav-button-col">
          <v-btn class="nav-button" variant="text" to="/user">
            <v-icon left class="me-2">mdi-account</v-icon>
            Fiók
          </v-btn>
          <v-btn class="nav-button" variant="text" to="/favourites">
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

      <!-- mobile bar -->
      <div class="mobile-bar">
        <img src="@/assets/logo.png" @click="logoMobile" alt="Logo" class="logo-icon mobile-logo" />

        <div class="mobile-actions">
          <v-btn icon dense @click="toggleMobileSearch">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn icon dense to="/favourites">
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-btn icon dense to="/cart">
            <v-icon>mdi-cart</v-icon>
          </v-btn>
          <v-btn icon dense @click="drawer = true">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- mobile search -->
      <v-row v-if="showMobileSearch" class="mobile-search-row" align="center">
        <v-col cols="12" class="px-0">
          <v-text-field
            v-model="searchText"
            @keyup.enter="onMobileSearchEnter"
            append-inner-icon="mdi-magnify"
            variant="solo"
            density="compact"
            single-line
            hide-details
            placeholder="Keresés"
            clearable
            @click:clear="clearSearchMobile"
            autofocus />
        </v-col>
      </v-row>
    </v-container>

    <!-- mobile drawer replacement -->
    <v-overlay v-model="drawer" absolute class="mobile-drawer">
      <div class="drawer-content right-drawer">
        <img src="@/assets/logo.png" alt="Logo" @click="logoMobile" class="drawer-logo" />

        <v-list>
          <v-list-group
            v-for="category in categoryList"
            :key="category.id"
            :value="expandedCategoryId === category.id"
            @click="selectCategoryMobile(category.id)"
            no-action>
            <template #activator>
              <v-list-item-title :class="{ 'active-category': selectedCategoryId === category.id }">
                {{ category.name }}
              </v-list-item-title>
            </template>
          </v-list-group>
        </v-list>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      searchText: null,
      drawer: false,
      showMobileSearch: false,
      expandedCategoryId: null,
    };
  },

  computed: {
    ...mapState("data", ["selectedCategoryId", "selectedSubcategoryId"]),
    ...mapGetters("data", ["categoryList", "filteredSubcategories"]),

    isAdmin() {
      return this.$store.getters["user/isAdmin"];
    },
  },

  methods: {
    toggleMobileSearch() {
      if (!this.showMobileSearch) {
        this.searchText = null;
        this.showMobileSearch = true;
      } else {
        this.clearSearchMobile();
        this.showMobileSearch = false;
      }
    },

    selectCategoryMobile(categoryId) {
      this.clearSearchMobile();
      this.showMobileSearch = false;
      this.expandedCategoryId = this.expandedCategoryId === categoryId ? null : categoryId;
      this.$store.commit("data/setSelectedCategoryId", categoryId);
      this.$store.commit("data/setSelectedSubcategoryId", null);
      this.drawer = false;
    },

    logo() {
      this.$emit("logoClick");
      this.clearSearch();
    },

    logoMobile() {
      this.logo();
      this.showMobileSearch = false;
      this.clearSearch();
      if (this.drawer) {
        this.drawer = false;
      }
    },

    loadSearchData() {
      this.$store.state.data.searchText = this.searchText;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    onMobileSearchEnter() {
      this.loadSearchData();
    },

    clearSearch() {
      this.searchText = this.$store.state.data.searchText = null;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    resetCategAndSubcateg() {
      this.$store.commit("data/setSelectedCategoryId", 1);
      this.$store.commit("data/setSelectedSubcategoryId", 1);
      this.expandedCategoryId = null;
    },

    clearSearchMobile() {
      this.clearSearch();
      this.showMobileSearch = true;
    },
  },
};
</script>

<style scoped>
/* desktop */
.desktop-row {
  display: flex;
}
.nav-button-col {
  margin: auto;
  padding: 0 0 0 4em;
}
.logo-icon {
  width: 10rem;
  cursor: pointer;
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

/* active category style */
.active-category {
  font-weight: bold;
  color: rgba(67, 127, 127);
}

/* mobile */
.mobile-bar {
  display: none;
}
@media (max-width: 768px) {
  .desktop-row {
    display: none !important;
  }
  .mobile-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
  }
  .logo-icon.mobile-logo {
    width: 6rem;
  }
  .nav-button-col,
  .search-row {
    display: none !important;
  }
  .mobile-actions {
    display: flex;
    gap: 6px;
  }
  .mobile-search-row {
    padding: 8px 12px;
  }
  /* drawer overlay */
  .mobile-drawer {
    background-color: rgba(0, 0, 0, 0.4);
    justify-content: flex-end;
  }
  .drawer-content.right-drawer {
    background: white;
    width: 250px;
    height: 100%;
    padding: 16px;
    box-shadow: -2px 0 6px rgba(0, 0, 0, 0.2);
  }
  .drawer-logo {
    width: 8rem;
    margin-bottom: 1rem;
  }
}
</style>
