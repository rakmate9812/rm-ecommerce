/* eslint-disable */
import { createStore } from "vuex";
import cart from "./cart";
import data from "./data";
import user from "./user";
import favorites from "./favorites";
import modal from "./modal";
import orders from "./orders";
import config from './config';

export default createStore({
  modules: {
    cart,
    data,
    user,
    favorites,
    modal,
    orders,
    config
  },
});
