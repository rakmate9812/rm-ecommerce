<template>
  <div class="product-form">
    <h2>Add Product</h2>
    <form @submit.prevent="submitProduct">
      <div>
        <label for="name">Product Name:</label>
        <input v-model="productName" id="name" type="text" placeholder="Enter product name" required />
      </div>
      <div>
        <label for="price">Price:</label>
        <input
          v-model.number="productPrice"
          id="price"
          type="number"
          step="0.01"
          placeholder="Enter product price"
          required />
      </div>
      <button type="submit">Add Product</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      productName: "",
      productPrice: null,
    };
  },
  methods: {
    ...mapActions(["addProductToDb"]), // Map Vuex action
    async submitProduct() {
      if (this.productName && this.productPrice != null) {
        try {
          // Prepare the product object
          const product = {
            name: this.productName,
            price: this.productPrice,
          };

          // Call the Vuex action to add the product
          await this.addProductToDb(product);

          // Clear the form
          this.productName = "";
          this.productPrice = null;

          alert("Product added successfully!");
        } catch (error) {
          console.error("Error adding product:", error);
        }
      } else {
        alert("Please fill in all fields!");
      }
    },
  },
};
</script>

<style>
/* Add styles as needed */
.product-form {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}
.product-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.product-form input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.product-form button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.product-form button:hover {
  background-color: #0056b3;
}
</style>
