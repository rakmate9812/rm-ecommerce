/* eslint-disable */
import { createStore } from 'vuex'
import db from "../firebaseConfig";
import { ref, set, push } from "firebase/database";

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    /**
     * POST method for adding data for the firebase real time database
     */
    async addProductToDb({ commit }, product) {
      try {
        // Validate the product object
        if (
          !product ||
          typeof product.name !== "string" ||
          typeof product.price !== "number"
        ) {
          throw new Error("Invalid product: Must include 'name' (string) and 'price' (number)");
        }

        // Prepare the product object with additional metadata
        const productData = {
          name: product.name,
          price: product.price,
          creationDate: new Date().toISOString(), // Current timestamp in ISO format
        };

        // Get a reference to the 'products' node
        const reference = ref(db, "products/");
        const newRef = push(reference); // Generate a unique key for the product using firebase auto id gen

        // Save the product data
        await set(newRef, productData);

        console.log("Product added with ID:", newRef.key);
      } catch (error) {
        console.error("Error adding product to DB:", error);
      }
    },
  },
  modules: {
  }
})
