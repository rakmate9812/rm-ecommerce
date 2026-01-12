// ...existing code...
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
            <p class="text-xs text-gray-500">Ez a szöveg jelenik meg a narancssárga sávban nagyban.</p>
          </div>
          <div class="custom-divider my-4"></div>

          <!-- Sale Items Smaller Text -->
          <div class="mb-6">
            <label class="block text-sm font-semibold mb-2">Akciós termékek alszöveg</label>
            <v-text-field
              v-model="formData.SaleItemsSmallerText"
              label="Alszöveg"
              outlined
              dense
              class="mb-2"></v-text-field>
            <p class="text-xs text-gray-500">Ez a kisebb szöveg a narancs sávban.</p>
          </div>
          <div class="custom-divider my-4"></div>

          <!-- Show Short Description -->
          <div class="mb-6">
            <v-switch
              v-model="formData.ShowShortDescriptionOnProduct"
              label="Rövid leírás megjelenítése a termékoldalakon"
              class="mb-2"
              color="primary"></v-switch>
            <p class="text-xs text-gray-500">Ha engedélyezve van, a termékek rövid leírása megjelenik az oldalakon.</p>
          </div>
          <div class="custom-divider my-4"></div>

          <!-- Subcategory Visible -->
          <div class="mb-6">
            <v-switch
              v-model="formData.SubcategoryVisible"
              label="Alkategóriák megjelenítése"
              class="mb-2"
              color="primary"></v-switch>
            <p class="text-xs text-gray-500">Ha engedélyezve van, az alkategóriák láthatók lesznek a navigációban.</p>
          </div>
          <div class="custom-divider my-4"></div>

          <!-- Product Sorting Option -->
          <div class="mb-6">
            <label class="block text-sm font-semibold mb-2">Termékek rendezési módja</label>
            <v-select
              v-model="formData.sortingOption"
              :items="sortingOptions"
              label="Rendezés"
              outlined
              dense
              class="mb-2"
              item-title="label"
              item-value="value"></v-select>
            <p class="text-xs text-gray-500">Ez határozza meg, hogyan jelennek meg a termékek a böngészésnél.</p>
          </div>
          <div class="custom-divider my-4"></div>

          <!-- Discount For All -->
          <div class="mb-6">
            <label class="block text-sm font-semibold mb-2">Általános kedvezmény (%)</label>
            <v-text-field
              v-model.number="formData.discountForAll"
              label="Kedvezmény százalék"
              type="number"
              outlined
              dense
              min="0"
              max="100"
              class="mb-2"></v-text-field>
            <p class="text-xs text-gray-500">
              Ez a kedvezmény minden jövőbeli rendelésre automatikusan érvényesül (0-100%). Ha 0-t írsz, nem jelenik meg
              semmi. Nem befolyásolja a már meglévő megrendeléseket!
            </p>
          </div>

          <!-- Discount For All Text-->
          <div class="mb-6">
            <label class="block text-sm font-semibold mb-2">Általános kedvezmény szöveg</label>
            <v-text-field
              v-model="formData.discountForAllText"
              label="Kedvezmény százalék szövege (pl Nyitási akció, Karácsonyi akció)"
              outlined
              dense
              class="mb-2"></v-text-field>
            <p class="text-xs text-gray-500">
              Ez a szöveg jelenik majd meg a felületen és a számlán is teljes végösszegű kedvezmény esetén (HA a
              kedvezmény nagyobb mint 0).
            </p>
          </div>
          <div class="custom-divider my-4"></div>

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
        sortingOption: "name",
        discountForAll: 0,
      },
      originalData: {},
      sortingOptions: [
        { label: "Név szerint (A-Z)", value: "name" },
        { label: "Ár szerint növekvő", value: "priceAsc" },
        { label: "Ár szerint csökkenő", value: "priceDesc" },
        { label: "Dátum szerint növekvő", value: "dateAsc" },
        { label: "Dátum szerint csökkenő", value: "dateDesc" },
        { label: "Egyedi", value: "custom" },
      ],
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
        // fallback if not set
        if (!this.formData.sortingOption) this.formData.sortingOption = "name";
        if (!this.formData.discountForAll) this.formData.discountForAll = 0;
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
        this.saving = true;
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

/* Custom bold dividers */
.custom-divider {
  display: block;
  width: 100%;
  height: 4px; /* bolder thickness */
  background-color: rgba(0, 0, 0); /* slightly darker */
  border-radius: 2px;
}
</style>
