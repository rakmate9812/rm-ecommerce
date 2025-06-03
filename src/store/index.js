/* eslint-disable */
import { createStore } from "vuex";
import cart from "./cart";
import data from "./data";
import user from "./user";
import favorites from "./favorites";
import modal from "./modal";

export default createStore({
  modules: {
    cart,
    data,
    user,
    favorites,
    modal,
  },
});
