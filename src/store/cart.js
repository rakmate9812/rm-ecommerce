export default {
    namespaced: true,
    state: {
        cartItems: [],
    },

    mutations: {
        ADD_TO_CART(state, productId) {
            const existingItem = state.cartItems.find(ci => ci.productId === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cartItems.push({ productId, quantity: 1 });
            }
        },

        REMOVE_FROM_CART(state, productId) {
            state.cartItems = state.cartItems.filter(item => item.productId !== productId);
        },

        CLEAR_CART(state) {
            state.cartItems = [];
        },

        // - for decreasing, + for increasing quantity
        MODIFY_QUANTITY(state, { productId, quantity }) {
            const existingItem = state.cartItems.find(ci => ci.productId === productId);
            if (existingItem) {
                if (existingItem.quantity + quantity <= 0) {
                    state.cartItems = state.cartItems.filter(item => item.productId !== productId); // remove from cart
                } else {
                    existingItem.quantity += quantity;
                }
            }
        }

    },

    actions: {
        addToCart({ commit }, productId) {
            commit("ADD_TO_CART", productId);
        },

        removeFromCart({ commit }, productId) {
            commit("REMOVE_FROM_CART", productId);
        },

        clearCart({ commit }) {
            commit("CLEAR_CART");
        },

        modifyQuantity({ commit }, { productId, quantity }) {
            commit("MODIFY_QUANTITY", { productId, quantity })
        }
    },

    getters: {
        cartItemCount: (state) => state.cartItems.reduce((sum, item) => sum + item.quantity, 0),

        cartTotal: (state, getters) => getters.cartItemsDetailed.reduce(
            (sum, item) => sum + item.quantity * item.unitPrice, 0
        ),

        cartItems: (state) => state.cartItems,

        cartItemsDetailed: (state, getters, rootState, rootGetters) => {
            const products = rootGetters["data/productList"];
            return state.cartItems.map(cartItem => {
                const product = products.find(p => p.id === cartItem.productId);
                return {
                    ...cartItem,
                    name: product?.name || "Ismeretlen termék",
                    unitPrice: product?.price || 0,
                    imageUrl: product?.imageUrl || "",
                };
            });
        },
    },
};
