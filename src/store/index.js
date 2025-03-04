/* eslint-disable */
import { createStore } from "vuex";
import db from "../firebaseConfig";
import { ref, set, push } from "firebase/database";
import { fetchDataFromDatabase, getFirstLevelPaths } from "@/services/firebaseService";

export default createStore({
  state: {
    // The data object gets filled with the firebase real-time database JSON structured data (withinin the fetchData fn)
    data: {},
  },

  getters: {
    getData: (state) => (path = null) =>
      path === null ? state.data : state.data[path] || {},
  },

  mutations: {
    setData(state, { path, data }) {
      state.data[path] = data;
    },
  },

  actions: {
    /**
     * General POST method for adding data to any firebase real-time database path
     */
    async addDataToDb({ commit }, { path, data }) {
      try {
        const enrichedData = {
          ...data,
          creationDate: new Date().toISOString(),
        };
        const reference = ref(db, path);
        const newRef = push(reference);

        await set(newRef, enrichedData);
        console.log(`Data added to '${path}' with ID:`, newRef.key);
      } catch (error) {
        console.error(`Error adding data to '${path}':`, error);
      }
    },

    /**
     * GET method to fetch data from firebase real-time database path
     */
    async fetchData({ commit }, path) {
      try {
        const data = await fetchDataFromDatabase(path);

        commit("setData", { path, data: data || {} });
      } catch (error) {
        console.error(`Failed to fetch data from '${path}':`, error);
      }
    },

    /**
     * (Re)Load all data from frt database 
     */
    async loadAllData({ commit }) {
      // IMPORTANT: this approach should not be used but only for testing purposes
      try {
        // Step 1: Get all first-level paths
        const paths = await getFirstLevelPaths();

        // Step 2: Fetch data for each path and commit to Vuex store
        for (const path of paths) {
          const allData = await fetchDataFromDatabase(path);

          commit("setData", { path, data: allData || {} });
        }
      } catch (error) {
        console.error("Error loading all data from database:", error);
      }
    },
  },
  modules: {},
});
