// GENERALLY this store module should be used across all vue components. 
// In other important places (main.js, router) the auth from "@/firebaseConfig" should be used directly
/* eslint-disable */
import { fetchDataFromDatabase, getFirstLevelPaths } from "@/services/firebaseDbService";
import { ref, set, push } from "firebase/database";
import db from "@/firebaseConfig";

export default {
    namespaced: true,

    state: {
        user: null, // if false, no logged in user
        role: null,
        userOrders: {}, // this should be on data.js but i was having some bugs with it so remains here
    },

    getters: {
        isAuthenticated: (state) => state.user ? !state.user.isAnonymous : false,
        isAdmin: (state) => state.role === "ADMIN",

        // Orders getter reading from state.userOrders object - this is not recommended but i was having trouble with syncing the data module with this one
        userOrdersList: (state) => {
            return Object.entries(state.userOrders || {}).map(([orderId, orderData]) => ({
                id: orderId,
                ...orderData,
            }));
        },
    },

    mutations: {
        setUser(state, userData) {
            state.user = userData;
        },
        setRole(state, role) {
            state.role = role;
        },
        setUserOrders(state, orders) {
            state.userOrders = orders;
        },
    },

    actions: {
        async fetchUserOrders({ state, commit }) {
            if (!state.user) return;

            const uid = state.user.uid;
            try {
                // Fetch orders at "orders/uid" path from firebase
                const orders = await fetchDataFromDatabase(`orders/${uid}`);
                commit("setUserOrders", orders || {});
            } catch (error) {
                console.error("Error fetching user orders:", error);
                commit("setUserOrders", {});
            }
        },
    },
};
