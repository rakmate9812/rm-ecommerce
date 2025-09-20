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
          <v-btn v-if="testing" class="nav-button my-2" variant="text" @click="test">
            <v-icon left class="me-2">mdi-wrench</v-icon>
            Teszt
          </v-btn>
        </v-col>
      </v-row>

      <!-- mobile bar -->
      <div class="mobile-bar">
        <v-btn icon dense @click="drawer = true">
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <img src="@/assets/logo.png" @click="logo" alt="Logo" class="logo-icon mobile-logo" />

        <div class="mobile-actions">
          <v-btn icon dense @click="showMobileSearch = true">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn icon dense to="/favourites">
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-btn icon dense to="/cart">
            <v-icon>mdi-cart</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- mobile search -->
      <v-row v-if="showMobileSearch" class="mobile-search-row" align="center">
        <v-col cols="11" class="px-0">
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
            @click:clear="clearSearch"
            autofocus />
        </v-col>
        <v-col cols="1" class="px-0">
          <v-btn icon dense @click="showMobileSearch = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- mobile drawer replacement -->
    <v-overlay v-model="drawer" absolute class="mobile-drawer">
      <div class="drawer-content">
        <img src="@/assets/logo.png" alt="Logo" class="drawer-logo" />

        <v-list>
          <v-list-item link to="/user" @click="drawer = false">
            <v-icon class="me-2">mdi-account</v-icon> Fiók
          </v-list-item>

          <v-list-item link to="/favourites" @click="drawer = false">
            <v-icon class="me-2">mdi-heart</v-icon> Későbbre mentve
          </v-list-item>

          <v-list-item link to="/cart" @click="drawer = false">
            <v-icon class="me-2">mdi-cart</v-icon> Bevásárlókocsi
          </v-list-item>

          <v-list-item v-if="isAdmin" link to="/admin" @click="drawer = false">
            <v-icon class="me-2">mdi-cog</v-icon> Admin
          </v-list-item>

          <v-list-item v-if="testing" @click="test"> <v-icon class="me-2">mdi-wrench</v-icon> Teszt </v-list-item>
        </v-list>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import { ref, get } from "firebase/database";
import db from "@/firebaseConfig";

export default {
  data() {
    return {
      searchText: null,
      testing: false,
      drawer: false,
      showMobileSearch: false,
    };
  },
  methods: {
    async test() {
      console.log("testing:");
      console.log(this.$store.state.user.user);

      const userId = "";
      const orderId = "";

      try {
        const orderRef = ref(db, `orders/${userId}/${orderId}`);
        const snapshot = await get(orderRef);

        if (snapshot.exists()) {
          console.log(`Order (${orderId}):`, snapshot.val());
        } else {
          console.log(`Order with ID '${orderId}' not found.`);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    },
    logo() {
      this.$emit("logoClick");
      this.clearSearch();
    },
    loadSearchData() {
      this.$store.state.data.searchText = this.searchText;
      this.showMobileSearch = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onMobileSearchEnter() {
      this.loadSearchData();
    },
    clearSearch() {
      this.searchText = this.$store.state.data.searchText = null;
      this.showMobileSearch = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
  computed: {
    isAdmin() {
      return this.$store.getters["user/isAdmin"];
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
    border-bottom: 1px solid #eee;
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
  }
  .drawer-content {
    background: white;
    width: 250px;
    height: 100%;
    padding: 16px;
    box-shadow: 2px 0 6px rgba(0, 0, 0, 0.2);
  }
  .drawer-logo {
    width: 8rem;
    margin-bottom: 1rem;
  }
}
</style>
