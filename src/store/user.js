// GENERALLY this store module should be used across all vue components. 
// In other important places (main.js, router) the auth from "@/firebaseConfig" should be used directly
/* eslint-disable */
export default {
    namespaced: true,

    state: {
        user: null, // if false, no logged in user
        role: null,
        userOrders: {},
    },

    getters: {
        isAuthenticated: (state) => state.user ? !state.user.isAnonymous : false, // need to differentiate between logged in, and "auto-logged in anonymous" users
        isAdmin: (state) => state.user?.role === "ADMIN",
        userOrdersList: (state) =>
            Object.entries(state.userOrders).map(([id, order]) => ({
                id,
                ...order,
            })),
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
        async fetchUserOrders({ state, commit, dispatch }) {
            if (!state.user) return;
            const uid = state.user.uid;

            // Fetch all orders from database via data module
            await dispatch("data/fetchData", "orders", { root: true });

            const allOrders = (this.state.data.data.orders || {});

            // Filter orders belonging to this user
            const userOrders = Object.entries(allOrders)
                .filter(([orderId, order]) => order.userId === uid)
                .reduce((acc, [orderId, order]) => {
                    acc[orderId] = order;
                    return acc;
                }, {});

            // Save in local state
            commit("setUserOrders", userOrders);
        },
    },
};
