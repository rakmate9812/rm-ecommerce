<template>
  <div class="item-form">
    <h2>Add Item</h2>
    <form @submit.prevent="submitItem">
      <div>
        <label for="itemType">Select Item Type:</label>
        <select v-model="selectedType" id="itemType" @change="handleTypeChange">
          <option value="category">Category</option>
          <option value="subcategory">Subcategory</option>
          <option value="product">Product</option>
        </select>
      </div>

      <div v-if="selectedType === 'category'">
        <label for="categoryName">Category Name:</label>
        <input v-model="categoryName" id="categoryName" type="text" required />
        <label for="subcategories">Subcategories:</label>
        <div>
          <div v-for="(subcategory, id) in subcategories" :key="id">
            <input type="checkbox" :value="id" v-model="selectedSubcategories" />
            {{ subcategory.name }}
          </div>
        </div>
      </div>

      <div v-if="selectedType === 'subcategory'">
        <label for="subcategoryName">Subcategory Name:</label>
        <input v-model="subcategoryName" id="subcategoryName" type="text" required />
        <label for="products">Products:</label>
        <div>
          <div v-for="(product, id) in products" :key="id">
            <input type="checkbox" :value="id" v-model="selectedProducts" />
            {{ product.name }}
          </div>
        </div>
      </div>

      <div v-if="selectedType === 'product'">
        <label for="productName">Product Name:</label>
        <input v-model="productName" id="productName" type="text" required />
        <label for="productPrice">Price:</label>
        <input v-model.number="productPrice" id="productPrice" type="number" step="0.01" required />
      </div>

      <button type="submit">Add {{ selectedType }}</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedType: "category",
      categoryName: "",
      subcategoryName: "",
      productName: "",
      productPrice: null,
      selectedSubcategories: [],
      selectedProducts: [],
    };
  },

  computed: {
    storeData() {
      return this.$store.getters.getData("products");
    },
  },

  methods: {
    handleTypeChange() {
      // Clear the form and fetch relevant data
      this.categoryName = "";
      this.subcategoryName = "";
      this.productName = "";
      this.productPrice = null;
      this.selectedSubcategories = [];
      this.selectedProducts = [];
    },

    async submitItem() {
      // TODO - this does not work yet
      const path = this.selectedType + "s"; // Dynamically set path
      let data = {};

      if (this.selectedType === "category") {
        data = {
          name: this.categoryName,
          subcategories: this.selectedSubcategories,
        };
      } else if (this.selectedType === "subcategory") {
        data = {
          name: this.subcategoryName,
          products: this.selectedProducts,
        };
      } else if (this.selectedType === "product") {
        data = {
          name: this.productName,
          price: this.productPrice,
        };
      }

      try {
        await this.$store.dispatch("addDataToDb", { path, data });
        alert(`${this.selectedType} added successfully!`);
        this.handleTypeChange(); // Reset form
      } catch (error) {
        console.error(`Error adding ${this.selectedType}:`, error);
        alert(`Failed to add ${this.selectedType}.`);
      }
    },
  },
};
</script>

<style>
.item-form {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}
.item-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.item-form input,
.item-form select {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.item-form button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.item-form button:hover {
  background-color: #0056b3;
}
</style>
