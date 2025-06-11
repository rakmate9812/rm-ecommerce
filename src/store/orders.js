export default {
    namespaced: true,

    actions: {
        async placeOrder({ rootGetters, rootState, dispatch }) {
            const user = rootState.user.user;
            const cartItems = rootGetters["cart/cartItemsDetailed"];
            const total = rootGetters["cart/cartTotal"];

            if (cartItems.length === 0) {
                console.warn("Empty cart - no order placed.");
                return;
            }

            const orderData = {
                userId: user ? user.uid : null,
                createdAt: new Date().toISOString(),
                status: "pending",
                items: cartItems,
                totalPrice: total,
            };

            await dispatch(
                "data/addDataToDb",
                { path: "orders", data: orderData },
                { root: true } // root: true needed when accessing an action from a different store module
            );

            await dispatch("cart/clearCart", null, { root: true });
        },
    },
};
