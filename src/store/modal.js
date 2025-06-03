/* eslint-disable */
export default {
    namespaced: true,

    state: {
        modal: {
            visible: false,
            message: "",
        },
    },

    mutations: {
        showModal(state, message) {
            state.modal.visible = true;
            state.modal.message = message;
        },
        hideModal(state) {
            state.modal.visible = false;
            state.modal.message = "";
        },
    },

    actions: {
        // MODAL
        async confirm({ commit }, message) {
            return new Promise((resolve) => {
                commit("showModal", message);
                // Listen for modal response in some way
                // Could use events or additional state
                // Here, just a stub; implementation depends on UI setup
            });
        },
    },
};
