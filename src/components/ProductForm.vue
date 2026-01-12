<!-- Allows to modify/create products in the db  -->
<template>
  <div>
    <h1>Termékek kezelése</h1>

    <!-- Product selector -->
    <label for="product-select">Válassz egy terméket/vegyél fel újat:</label>
    <select v-model="selectedProductId" @change="loadProduct">
      <option value="">Új termék</option>
      <option v-for="(product, id) in products" :key="id" :value="id">
        {{ product.name }}
      </option>
    </select>

    <form @submit.prevent="submitProduct">
      <label>{{ selectedProductId ? "UID: " + selectedProductId : "" }}</label>

      <input v-model="product.name" placeholder="Product Name" required />
      <input v-model.number="product.price" type="number" placeholder="Price" required />

      <label>
        <input type="checkbox" v-model="product.active" />
        Aktív
      </label>

      <!-- Category selector -->
      <select v-model="product.categoryId" required>
        <option disabled value="">Select Category</option>
        <option v-for="category in categoryList" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>

      <!-- Subcategory selector -->
      <select v-model="product.subcategoryId" required>
        <option disabled value="">Select Subcategory</option>
        <option v-for="subcategory in filteredSubcategories" :key="subcategory.id" :value="subcategory.id">
          {{ subcategory.name }}
        </option>
      </select>

      <input v-model="product.shortDescription" placeholder="Short description" />
      <textarea v-model="product.description" placeholder="Description"></textarea>

      <div>
        <label>Product image</label>
        <input type="file" accept="image/*" @change="onFileSelected" />
        <div v-if="imagePreview" style="margin-top: 8px">
          <img
            :src="imagePreview"
            alt="preview"
            style="max-width: 200px; max-height: 200px; object-fit: contain; border: 1px solid #ddd" />
        </div>
      </div>

      <button type="submit">
        {{ selectedProductId ? "Update Product" : "Add Product" }}
      </button>
      <button v-if="selectedProductId" type="button" @click="resetForm">Cancel</button>
    </form>
  </div>
</template>

<script>
import { uploadFile /*, deleteFile*/ } from "@/services/firebaseStorageService";
export default {
  data() {
    return {
      selectedProductId: "",
      product: this.getEmptyProduct(),
      selectedImageFile: null,
      imagePreview: null,
    };
  },
  computed: {
    products() {
      return this.$store.getters["data/getData"]("products") || {};
    },

    categoryList() {
      return this.$store.getters["data/categoryList"];
    },

    filteredSubcategories() {
      return this.$store.getters["data/filteredSubcategories"](this.product.categoryId);
    },
  },

  async mounted() {
    await this.$store.dispatch("data/fetchData", "products");
    await this.$store.dispatch("data/fetchData", "categories");
    await this.$store.dispatch("data/fetchData", "subcategories");
  },

  methods: {
    getEmptyProduct() {
      return {
        name: "",
        price: null,
        categoryId: "",
        subcategoryId: "",
        description: "",
        imageUrl: "",
        active: true,
      };
    },

    loadProduct() {
      if (this.selectedProductId) {
        this.product = { ...this.products[this.selectedProductId] };
      } else {
        this.resetForm();
      }
    },

    onFileSelected(event) {
      const file = event.target.files?.[0];
      console.log("file")
      if (!file) {
        this.selectedImageFile = null;
        this.imagePreview = null;
        console.log("file null")
        return;
      }
      this.selectedImageFile = file;
      this.imagePreview = URL.createObjectURL(file);
    },

    async submitProduct() {
      try {
        // If a file is selected, upload it first and set product.imageUrl
        if (this.selectedImageFile) {
          // Build a path. Use product id or timestamp to avoid collisions.
          const filename = `${Date.now()}_${this.selectedImageFile.name.replace(/\s+/g, "_")}`;
          const path = `product_images/${this.selectedProductId || "new"}/${filename}`;
          const { url, path: storagePath } = await uploadFile(this.selectedImageFile, path);
          // Save the download URL and also keep storagePath if want to delete later
          this.product.imageUrl = url;
          this.product.imageStoragePath = storagePath;
        }

        if (this.selectedProductId) {
          await this.$store.dispatch("data/updateDataInDb", {
            path: `products/${this.selectedProductId}`,
            data: this.product,
          });
        } else {
          await this.$store.dispatch("data/addDataToDb", {
            path: "products",
            data: this.product,
          });
        }
        alert(`Product ${this.selectedProductId ? "updated" : "added"} successfully!`);

        await this.$store.dispatch("data/fetchData", "products");
        this.resetForm();
      } catch (error) {
        console.error("Error saving product:", error);
        alert(`Hiba történt, művelet sikertelen!`);
      }
    },

    resetForm() {
      this.selectedProductId = "";
      this.product = this.getEmptyProduct();
      this.selectedImageFile = null;
      this.imagePreview = null;
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 450px;
  margin: 30px auto;
  padding: 20px;
  background-color: #fdfdfd;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.6rem;
  color: #333;
}

label {
  font-weight: 600;
  margin: 5px 0;
  color: #444;
}

input,
textarea,
select {
  margin-bottom: 14px;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #007bff;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

button {
  padding: 10px 16px;
  margin-top: 8px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.25s;
}

button:hover {
  background-color: #0056b3;
}

button[type="button"] {
  background-color: #ccc;
  color: #333;
}

button[type="button"]:hover {
  background-color: #999;
}

select:disabled {
  background-color: #f0f0f0;
}
</style>
