/* eslint-disable */
import { fetchDataFromDatabase, getFirstLevelPaths } from "@/services/firebaseDbService";
import { ref, set, push } from "firebase/database";
import db from "@/firebaseConfig";

export default {
    namespaced: true,

    state: {
        // The data object gets filled with the firebase real-time database JSON structured data (within the fetchData fn)
        data: {},
    },

    getters: {
        getData: (state) => (path = null) =>
            path === null ? state.data : state.data[path] || {},

        // Get categories as array
        categoryList: (state, getters) => {
            const categories = getters.getData("categories");
            return Object.entries(categories || {}).map(([id, value]) => ({
                id,
                ...value,
            }));
        },

        subcategoryList: (state, getters) => {
            const subcategories = getters.getData("subcategories");
            return Object.entries(subcategories || {}).map(([id, value]) => ({
                id,
                ...value,
            })).filter(
                (sub) => String(sub.id) !== "1"
            );
        },

        productList: (state, getters) => {
            const products = getters.getData("products");
            return Object.entries(products || {}).map(([id, value]) => ({
                id,
                ...value,
            }));
        },

        // Filter subcategories by selectedCategoryId
        filteredSubcategories: (state, getters) => (selectedCategoryId) => {
            if (String(selectedCategoryId) === "1") {
                return getters.subcategoryList;
            }
            return getters.subcategoryList.filter(
                (sub) => String(sub.categoryId) === String(selectedCategoryId)
            );
        },

        // Filter products by selectedCategoryId + selectedSubcategoryId
        filteredProducts: (state, getters) => (selectedCategoryId, selectedSubcategoryId) => {
            if (String(selectedCategoryId) === "1") {
                // Category 1 selected - show all if no subcategory, else filter by subcategory
                return selectedSubcategoryId
                    ? getters.productList.filter(
                        (prod) => String(prod.subcategoryId) === String(selectedSubcategoryId)
                    )
                    : getters.productList;
            }

            // Else - filter by categoryId (and subcategory if selected)
            let filtered = getters.productList.filter(
                (prod) => String(prod.categoryId) === String(selectedCategoryId)
            );

            if (selectedSubcategoryId) {
                filtered = filtered.filter(
                    (prod) => String(prod.subcategoryId) === String(selectedSubcategoryId)
                );
            }

            return filtered;
        },
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
                // console.log(`Data added to '${path}' with ID:`, newRef.key);

                // Return the new ID so callers can use it
                return { id: newRef.key };

            } catch (error) {
                console.error(`Error adding data to '${path}':`, error);
                // Optionally propagate error if desired
                throw error;
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
        * PUT method
        */
        async updateDataInDb({ commit }, { path, data }) {
            try {
                const reference = ref(db, path);
                await set(reference, data); // This will overwrite the existing data at the given path
                console.log(`Data updated at '${path}'`);
            } catch (error) {
                console.error(`Error updating data at '${path}':`, error);
            }
        },

        /**
         * (Re)Load all data from firebase real-time database 
         * IMPORTANT: this approach should not be used but only for testing purposes
         */
        async loadAllData({ commit }) {
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
};
