import { ref, set, get } from "firebase/database";
import db from "@/firebaseConfig";

export default {
    namespaced: true,

    state: () => ({
        storeConfig: {
            SaleItemsHeaderText: "",
            SaleItemsSmallerText: "",
            ShowShortDescriptionOnProduct: false,
            SubcategoryVisible: false,
            sortingOption: "name", 
            customOrder: [],
        },
    }),

    mutations: {
        SET_STORE_CONFIG(state, config) {
            state.storeConfig = { ...state.storeConfig, ...config };
        },
    },

    actions: {
        async fetchStoreConfig({ commit }) {
            try {
                const configRef = ref(db, "storeConfig");
                const snapshot = await get(configRef);
                if (snapshot.exists()) {
                    commit("SET_STORE_CONFIG", snapshot.val());
                }
            } catch (error) {
                console.error("Error fetching store config:", error);
                throw error;
            }
        },

        async updateStoreConfig({ commit }, config) {
            try {
                const configRef = ref(db, "storeConfig");
                await set(configRef, config);
                commit("SET_STORE_CONFIG", config);
            } catch (error) {
                console.error("Error updating store config:", error);
                throw error;
            }
        },
    },

    getters: {
        storeConfig: (state) => state.storeConfig,
        sortingOption: (state) => state.storeConfig.sortingOption ?? "name",
        customOrder: (state) => state.storeConfig.customOrder ?? [],
        saleItemsHeaderText: (state) => state.storeConfig.SaleItemsHeaderText,
        saleItemsSmallerText: (state) => state.storeConfig.SaleItemsSmallerText,
        showShortDescription: (state) => state.storeConfig.ShowShortDescriptionOnProduct,
        subcategoryVisible: (state) => state.storeConfig.SubcategoryVisible,
    },
};