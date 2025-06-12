export default {
    namespaced: true,

    actions: {
        // returns the orderId
        async placeOrder({ rootState, dispatch }, { deliveryData, cartItems, total }) {
            const user = rootState.user.user;

            if (!cartItems || cartItems.length === 0) {
                console.warn("Empty cart - no order placed.");
                return null;
            }

            const orderData = {
                userId: user ? user.uid : null,
                status: "pending",
                items: cartItems,
                totalPrice: total,
                deliveryData,
            };

            // NOTE: addDataToDb must return { id: newRef.key }
            const { id: orderId } = await dispatch(
                "data/addDataToDb",
                { path: "orders", data: orderData },
                { root: true }
            );

            // console.log("Order placed with ID:", orderId);

            await dispatch("cart/clearCart", null, { root: true });

            return orderId;
        },
    },
};
