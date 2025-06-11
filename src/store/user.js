// GENERALLY this store module should be used across all vue components. 
// In other important places (main.js, router) the auth from "@/firebaseConfig" should be used directly
/* eslint-disable */
export default {
    namespaced: true,

    state: {
        user: null, // if false, no logged in user
        roel: null
    },

    getters: {
        isAuthenticated: (state) => state.user ? !state.user.isAnonymous : false, // need to differentiate between logged in, and "auto-logged in anonymous" users 
        isAdmin: (state) => state.user?.role === "ADMIN",
    },

    mutations: {
        setUser(state, userData) {
            state.user = userData;
        },
        setRole(state, role) {
            state.role = role;
        },
    },
};
