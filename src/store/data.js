/* eslint-disable */
import { fetchDataFromDatabase, getFirstLevelPaths } from "@/services/firebaseDbService";
import { ref, set, push } from "firebase/database";
import db from "@/firebaseConfig";

export default {
    namespaced: true,

    state: {
        // The data object gets filled with the firebase real-time database JSON structured data (within the fetchData fn)
        data: {},
        searchText: "",

        selectedCategoryId: "1",
        selectedSubcategoryId: null,
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
            })).filter((sub) => String(sub.id) !== "1");
        },

        activeProductList: (state, getters) => {
            const products = getters.getData("products");
            return Object.entries(products || {})
                .map(([id, value]) => ({
                    id,
                    ...value,
                }))
                .filter((prod) => prod.active !== false); // show only if active is true or undefined
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
                    ? getters.activeProductList.filter(
                        (prod) => String(prod.subcategoryId) === String(selectedSubcategoryId)
                    )
                    : getters.activeProductList;
            }

            // Else - filter by categoryId (and subcategory if selected)
            let filtered = getters.activeProductList.filter(
                (prod) => String(prod.categoryId) === String(selectedCategoryId)
            );

            if (selectedSubcategoryId) {
                filtered = filtered.filter(
                    (prod) => String(prod.subcategoryId) === String(selectedSubcategoryId)
                );
            }

            return filtered;
        },

        // spaces after every three digits
        formatPrice: () => (price) => {
            if (price === null || price === undefined) return "";
            // Remove existing spaces then coerce to number if possible
            const cleaned = typeof price === "number" ? price : Number(String(price).replace(/\s/g, ""));
            if (Number.isNaN(cleaned)) return String(price);
            return cleaned.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        },


        /**
         * Returns a sorted array of products based on the selected sorting option.
         * Supported options:
         * - "name": Sorts alphabetically by product name (A-Z).
         * - "priceAsc": Sorts by price, ascending.
         * - "priceDesc": Sorts by price, descending.
         * - "dateAsc": Sorts by creation date, oldest first.
         * - "dateDesc": Sorts by creation date, newest first.
         * - "custom": Sorts by the admin-defined customOrder array from storeConfig.
         * If sortingOption is not provided, uses the global storeConfig setting.
         * @param {Array} products - Array of product objects to sort.
         * @param {string} [sortingOption] - Sorting mode.
         * @param {Array} [customOrder] - Optional array of product IDs for custom sorting.
         * @returns {Array} Sorted array of products.
         */
        sortedProducts: (state, getters, rootState, rootGetters) => (products, sortingOption = null) => {
            if (!Array.isArray(products)) return [];
            // Use storeConfig sortingOption if not provided
            const option = sortingOption || rootGetters["storeConfig/sortingOption"] || "name";
            switch (option) {
                case "name":
                    return [...products].sort((a, b) =>
                        a.name.localeCompare(b.name, "hu", { sensitivity: "base" })
                    );
                case "priceAsc":
                    return [...products].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
                case "priceDesc":
                    return [...products].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
                case "dateAsc":
                    return [...products].sort((a, b) => {
                        const dateA = new Date(a.creationDate || a.date || 0);
                        const dateB = new Date(b.creationDate || b.date || 0);
                        return dateA - dateB;
                    });
                case "dateDesc":
                    return [...products].sort((a, b) => {
                        const dateA = new Date(a.creationDate || a.date || 0);
                        const dateB = new Date(b.creationDate || b.date || 0);
                        return dateB - dateA;
                    });
                case "custom":
                    // Custom sorting logic later TODO
                    return products;
                default:
                    return products;
            }
        },
    },

    mutations: {
        setData(state, { path, data }) {
            state.data[path] = data;
        },

        setSelectedCategoryId(state, categoryId) {
            state.selectedCategoryId = categoryId;
        },
        setSelectedSubcategoryId(state, subcategoryId) {
            state.selectedSubcategoryId = subcategoryId;
        },
    },

    actions: {
        /**
         * General POST method for adding data to any firebase real-time database path
         */
        async addDataToDb({ commit }, { path, data, userId = null }) {
            try {
                const enrichedData = {
                    ...data,
                    creationDate: new Date().toISOString(),
                };

                let reference;
                if (path === "orders" && userId) {
                    reference = ref(db, `${path}/${userId}`);
                } else {
                    reference = ref(db, path);
                }

                const newRef = push(reference);
                await set(newRef, enrichedData);

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
                throw error;
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
