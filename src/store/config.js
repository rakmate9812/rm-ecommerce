import { fetchDataFromDatabase } from "@/services/firebaseDbService";

export default {
    namespaced: true,

    state: {
        storeConfig: null,
        isConfigLoaded: false
    },

    getters: {
        getConfig: (state) => state.storeConfig || {},
        
        // Helper getter for specific config values
        getConfigValue: (state) => (key) => {
            return state.storeConfig?.[key];
        },

        isConfigLoaded: (state) => state.isConfigLoaded
    },

    mutations: {
        setStoreConfig(state, config) {
            state.storeConfig = config;
            state.isConfigLoaded = true;
        }
    },

    actions: {
        async loadStoreConfig({ commit }) {
            try {
                const config = await fetchDataFromDatabase('storeConfig');
                commit('setStoreConfig', config || {});
            } catch (error) {
                console.error('Error loading store config:', error);
                commit('setStoreConfig', {});
            }
        }
    }
};