<template>
  <div class="store-settings">
    <h2 class="text-2xl font-bold mb-6">Beállítások</h2>

    <v-card class="elevation-2">
      <v-card-text>
        <v-form @submit.prevent="saveSettings">
          <!-- Sale Items Header Text -->
          <div class="mb-6">
            <label class="block text-sm font-semibold mb-2">Akciós termékek fejléc</label>
            <v-text-field
              v-model="formData.SaleItemsHeaderText"
              label="Fejléc szövege"
              outlined
              dense
              class="mb-2"></v-text-field>
            <p class="text-xs text-gray-500">Ez a szöveg jelenik meg a narancssárga sávban.</p>
          </div>
          <v-divider class="my-4"></v-divider>

          <!-- Sale Items Smaller Text -->
          <div class="mb-6">
            <label class="block text-sm font-semibold mb-2">Akciós termékek alszöveg</label>
            <v-text-field
              v-model="formData.SaleItemsSmallerText"
              label="Alszöveg"
              outlined
              dense
              class="mb-2"></v-text-field>
            <p class="text-xs text-gray-500">Ez a kisebb szöveg a narancs sáv alatt.</p>
          </div>
          <v-divider class="my-4"></v-divider>

          <!-- Show Short Description -->
          <div class="mb-6">
            <v-switch
              v-model="formData.ShowShortDescriptionOnProduct"
              label="Rövid leírás megjelenítése a termékoldalakon"
              class="mb-2"></v-switch>
            <p class="text-xs text-gray-500">Ha engedélyezve van, a termékek rövid leírása megjelenik az oldalakon.</p>
          </div>
          <v-divider class="my-4"></v-divider>

          <!-- Subcategory Visible -->
          <div class="mb-6">
            <v-switch v-model="formData.SubcategoryVisible" label="Alkategóriák megjelenítése" class="mb-2"></v-switch>
            <p class="text-xs text-gray-500">Ha engedélyezve van, az alkategóriák láthatók lesznek a navigációban.</p>
          </div>
          <v-divider class="my-4"></v-divider>

          <!-- Buttons -->
          <div class="d-flex gap-3 mt-8">
            <v-btn color="primary" size="large" type="submit" prepend-icon="mdi-content-save" :loading="saving">
              Mentés
            </v-btn>
            <v-btn color="secondary" size="large" variant="outlined" prepend-icon="mdi-refresh" @click="resetForm">
              Visszaállítás
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      saving: false,
      formData: {
        SaleItemsHeaderText: "",
        SaleItemsSmallerText: "",
        ShowShortDescriptionOnProduct: false,
        SubcategoryVisible: false,
      },
      originalData: {},
    };
  },

  created() {
    this.fetchSettings();
  },

  methods: {
    async fetchSettings() {
      this.loading = true;
      try {
        await this.$store.dispatch("storeConfig/fetchStoreConfig");
        const config = this.$store.getters["storeConfig/storeConfig"];
        this.formData = { ...config };
        this.originalData = { ...config };
      } catch (error) {
        console.error("Error fetching store settings:", error);
        this.$store.commit("modal/showModal", "Hiba a beállítások betöltésekor!");
      } finally {
        this.loading = false;
      }
    },

    async saveSettings() {
      const res = confirm("Biztosan mented?");
      if (res) {
        try {
          await this.$store.dispatch("storeConfig/updateStoreConfig", this.formData);
          this.originalData = { ...this.formData };
          this.$store.commit("modal/showModal", "Beállítások sikeresen mentve!");
        } catch (error) {
          console.error("Error saving store settings:", error);
          this.$store.commit("modal/showModal", "Hiba a beállítások mentésekor!");
        } finally {
          this.saving = false;
        }
      }
    },

    resetForm() {
      this.formData = { ...this.originalData };
    },
  },
};
</script>

<style scoped>
.store-settings {
  padding: 16px;
}

.gap-3 {
  gap: 12px;
}
</style>
