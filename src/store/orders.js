export default {
    namespaced: true,

    actions: {
        // returns the orderId
        async placeOrder({ rootState, dispatch }, { cartItems, details }) {
            const user = rootState.user.user;

            if (!cartItems || cartItems.length === 0) {
                console.warn("Empty cart - no order placed.");
                return null;
            }

            const cleanedDetails = cleanNonUsedData(details);

            const orderData = {
                userId: user.uid,
                status: "pending",
                items: cartItems,
                ...cleanedDetails,
            };

            const { id: orderId } = await dispatch(
                "data/addDataToDb",
                {
                    path: "orders",
                    data: orderData,
                    userId: user.uid,
                },
                { root: true }
            );

            await dispatch("cart/clearCart", null, { root: true });

            return orderId;
        },
    },
};

function cleanNonUsedData(details) {
    const cleaned = { ...details };
    if (cleaned.discountPercentage === 0) {
        delete cleaned.discountPercentage;
        delete cleaned.discountAmount;
        delete cleaned.discountText;
    }
    // Will add more cleaning rules here if needed for firebase space saving purposes
    return cleaned;
}
