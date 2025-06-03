export default {
    namespaced: true,
    state: {
        cartItems: [],
    },
    mutations: {
        ADD_TO_CART(state, item) {
            const existingItem = state.cartItems.find(ci => ci.productId === item.productId);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                state.cartItems.push(item);
            }
        },
        REMOVE_FROM_CART(state, productId) {
            state.cartItems = state.cartItems.filter(item => item.productId !== productId);
        },
        CLEAR_CART(state) {
            state.cartItems = [];
        },
    },
    actions: {
        addToCart({ commit }, item) {
            commit("ADD_TO_CART", item);
        },
        removeFromCart({ commit }, productId) {
            commit("REMOVE_FROM_CART", productId);
        },
        clearCart({ commit }) {
            commit("CLEAR_CART");
        },
    },
    getters: {
        cartItemCount: (state) => state.cartItems.reduce((sum, item) => sum + item.quantity, 0),
        cartTotal: (state) => state.cartItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
        cartItems: (state) => state.cartItems,
    },
};
