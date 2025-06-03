/* eslint-disable */
export default {
    namespaced: true,

    state: {
        user: null,
    },

    getters: {
        currentUser: (state) => state.user,
        isAdmin: (state) => state.user?.role === "ADMIN",
    },

    mutations: {
        setUser(state, userData) {
            state.user = userData;
        },
    },
};
