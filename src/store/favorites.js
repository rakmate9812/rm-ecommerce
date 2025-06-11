/* eslint-disable */
import { ref, get, set, remove } from "firebase/database";
import db from "@/firebaseConfig";

export default {
    namespaced: true,

    state: {
        // holds product IDs user favorited
        favorites: [],
    },

    mutations: {
        setFavorites(state, favorites) {
            state.favorites = favorites;
        },
        addFavorite(state, productId) {
            if (!state.favorites.includes(productId)) {
                state.favorites.push(productId);
            }
        },
        removeFavorite(state, productId) {
            state.favorites = state.favorites.filter((id) => id !== productId);
        },
    },

    actions: {
        /**
         * Calling this after user login to load favorites from fb - this is needed here not to bloat the data.js. Also way clearer approach
         */
        async fetchFavorites({ commit, rootState }) {
            if (!rootState.user.user) return;
            try {
                const reference = ref(db, `favorites/${rootState.user.user.uid}`);
                const snapshot = await get(reference);
                const data = snapshot.val();
                commit("setFavorites", data ? Object.keys(data) : []);
            } catch (error) {
                console.error("Failed to fetch favorites:", error);
            }
        },

        async addFavoriteToDb({ commit, rootState, rootGetters }, productId) {
            if (!rootState.user.user) return;
            try {
                const product = rootGetters["data/getData"]("products")[productId];
                if (!product) return;

                const reference = ref(db, `favorites/${rootState.user.user.uid}/${productId}`);
                await set(reference, product.name);
                commit("addFavorite", productId);
            } catch (error) {
                console.error("Failed to add favorite:", error);
            }
        },

        async removeFavoriteFromDb({ commit, rootState }, productId) {
            if (!rootState.user.user) return;
            try {
                const reference = ref(db, `favorites/${rootState.user.user.uid}/${productId}`);
                await remove(reference);
                commit("removeFavorite", productId);
            } catch (error) {
                console.error("Failed to remove favorite:", error);
            }
        },

        // Toggle favorite for a product
        async toggleFavorite({ state, dispatch }, productId) {
            if (state.favorites.includes(productId)) {
                await dispatch("removeFavoriteFromDb", productId);
            } else {
                await dispatch("addFavoriteToDb", productId);
            }
        },
    },
};
