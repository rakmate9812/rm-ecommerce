import { ref, set, get } from "firebase/database";
import db from "@/firebaseConfig";

export default {
    namespaced: true,

    state: () => ({
        cartItems: [], // [{ productId, quantity }]
    }),

    mutations: {
        SET_CART(state, items) {
            state.cartItems = items;
        },

        ADD_TO_CART(state, productId) {
            const existing = state.cartItems.find(ci => ci.productId === productId);
            if (existing) {
                existing.quantity++;
            } else {
                state.cartItems.push({ productId, quantity: 1 });
            }
        },

        REMOVE_FROM_CART(state, productId) {
            state.cartItems = state.cartItems.filter(ci => ci.productId !== productId);
        },

        MODIFY_QUANTITY(state, { productId, quantity }) {
            const existing = state.cartItems.find(ci => ci.productId === productId);
            if (existing) {
                const newQuantity = existing.quantity + quantity;
                if (newQuantity <= 0) {
                    state.cartItems = state.cartItems.filter(ci => ci.productId !== productId);
                } else {
                    existing.quantity = newQuantity;
                }
            }
        },

        CLEAR_CART(state) {
            state.cartItems = [];
        },
    },

    actions: {
        async fetchCart({ commit, rootState }) {
            const user = rootState.user.user;
            if (!user) return;

            const cartRef = ref(db, `carts/${user.uid}`);
            const snapshot = await get(cartRef);
            let items = [];
            if (snapshot.exists()) {
                const val = snapshot.val();
                // Firebase might return object, convert to array if needed
                if (Array.isArray(val)) {
                    items = val;
                } else if (val && typeof val === 'object') {
                    // Convert object with keys to array
                    items = Object.values(val);
                }
            }
            commit("SET_CART", items);
        },

        async addToCart({ commit, dispatch }, productId) {
            commit("ADD_TO_CART", productId);
            await dispatch("syncCart");
        },

        async removeFromCart({ commit, dispatch }, productId) {
            commit("REMOVE_FROM_CART", productId);
            await dispatch("syncCart");
        },

        async modifyQuantity({ commit, dispatch }, payload) {
            commit("MODIFY_QUANTITY", payload);
            await dispatch("syncCart");
        },

        async clearCart({ commit, dispatch }) {
            commit("CLEAR_CART");
            await dispatch("syncCart");
        },

        async syncCart({ state, rootState }) {
            const user = rootState.user.user;
            if (!user) return;

            const cartRef = ref(db, `carts/${user.uid}`);
            // Save the cart as an array
            await set(cartRef, state.cartItems);
        },
    },

    getters: {
        cartItemCount(state) {
            return state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        },

        cartItems(state) {
            return state.cartItems;
        },

        cartItemsDetailed(state, getters, rootState, rootGetters) {
            const products = rootGetters["data/productList"] || [];
            return state.cartItems.map(cartItem => {
                const product = products.find(p => p.id === cartItem.productId);
                return {
                    ...cartItem,
                    name: product?.name || "Ismeretlen termék",
                    unitPrice: product?.price || 0,
                };
            });
        },

        cartTotal(state, getters) {
            return getters.cartItemsDetailed.reduce(
                (sum, item) => sum + item.quantity * item.unitPrice,
                0
            );
        },
    },
};
