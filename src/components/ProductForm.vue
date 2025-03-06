<template>
  <div>
    <h2>Manage Products</h2>

    <!-- Select an existing product to edit -->
    <label for="product-select">Select Product:</label>
    <select v-model="selectedProductId" @change="loadProduct">
      <option value="">Add New Product</option>
      <option v-for="(product, id) in products" :key="id" :value="id">
        {{ product.name || `Product ID: ${id}` }}
      </option>
    </select>

    <form @submit.prevent="submitProduct">
      <input v-model="product.name" placeholder="Product Name" required />
      <input v-model.number="product.price" type="number" placeholder="Price" required />
      <input v-model="product.categoryId" placeholder="Category ID" required />
      <input v-model="product.subcategoryId" placeholder="Subcategory ID" required />
      <textarea v-model="product.description" placeholder="Description"></textarea>
      <input v-model="product.imageUrl" placeholder="Image URL" />

      <button type="submit">
        {{ selectedProductId ? "Update Product" : "Add Product" }}
      </button>
      <button v-if="selectedProductId" type="button" @click="resetForm">Cancel</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedProductId: "", // ID of the product being edited
      product: this.getEmptyProduct(),
    };
  },
  computed: {
    products() {
      return this.$store.getters.getData("products") || {};
    },
  },
  async mounted() {
    await this.$store.dispatch("fetchData", "products"); // Load existing products on mount
  },
  methods: {
    getEmptyProduct() {
      return {
        name: "",
        price: 0,
        categoryId: "",
        subcategoryId: "",
        description: "",
        imageUrl: "",
      };
    },
    loadProduct() {
      if (this.selectedProductId) {
        this.product = { ...this.products[this.selectedProductId] };
      } else {
        this.resetForm();
      }
    },
    async submitProduct() {
      try {
        if (this.selectedProductId) {
          // Updating existing product
          await this.$store.dispatch("updateDataInDb", {
            path: `products/${this.selectedProductId}`,
            data: this.product,
          });
        } else {
          // Adding a new product
          await this.$store.dispatch("addDataToDb", {
            path: "products",
            data: this.product,
          });
        }

        alert(`Product ${this.selectedProductId ? "updated" : "added"} successfully!`);
        await this.$store.dispatch("fetchData", "products"); // Refresh product list
        this.resetForm();
      } catch (error) {
        console.error("Error saving product:", error);
      }
    },

    resetForm() {
      this.selectedProductId = "";
      this.product = this.getEmptyProduct();
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
}
input,
textarea,
select {
  margin-bottom: 10px;
  padding: 5px;
}
button {
  margin-top: 10px;
}
</style>
