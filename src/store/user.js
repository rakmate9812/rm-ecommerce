/* eslint-disable */
export default {
    namespaced: true,

    state: {
        user: null,
        roel: null
    },

    getters: {
        currentUser: (state) => state.user,
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
