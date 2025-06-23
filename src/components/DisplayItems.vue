<template>
  <div>
    <h1>Adatbázis nézegető</h1>

    <label for="path-select">Válassz egy táblázatot:</label>
    <select class="outlined-select" v-model="selectedPath" @change="fetchNode">
      <option v-for="(path, index) in availablePaths" :key="index" :value="path">
        {{ path }}
      </option>
    </select>

    <!-- Carts table -->
    <table v-if="selectedPath === 'carts' && Object.keys(carts).length">
      <thead>
        <tr>
          <th>User (email - name)</th>
          <th>Items</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cart, uid) in carts" :key="uid">
          <td>{{ getUserInfo(uid) }}</td>
          <td>{{ getCartItems(cart) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Favorites table -->
    <table v-else-if="selectedPath === 'favorites' && Object.keys(favorites).length">
      <thead>
        <tr>
          <th>User (email - name)</th>
          <th>Favorites</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(favList, uid) in favorites" :key="uid">
          <td>{{ getUserInfo(uid) }}</td>
          <td>{{ getFavoriteItems(favList) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Products table -->
    <table v-else-if="selectedPath === 'products' && Object.keys(data).length">
      <thead>
        <tr>
          <th>uid</th>
          <th>name</th>
          <th>price</th>
          <th>active</th>
          <th>categoryId</th>
          <th>subcategoryId</th>
          <th>creationDate</th>
          <th>description</th>
          <th>shortDescription</th>
          <th>imageUrl</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, uid) in data" :key="uid">
          <td>{{ uid }}</td>
          <td>{{ item.name || "" }}</td>
          <td>{{ item.price || "" }}</td>
          <td>{{ item.active !== undefined ? item.active : "" }}</td>
          <td>{{ item.categoryId || "" }}</td>
          <td>{{ item.subcategoryId || "" }}</td>
          <td>{{ item.creationDate || "" }}</td>
          <td>{{ item.description || "" }}</td>
          <td>{{ item.shortDescription || "" }}</td>
          <td>
            <button v-if="item.imageUrl" @click="openPicture(item.imageUrl)" style="cursor: pointer">Link</button>
            <span v-else></span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Subcategories table -->
    <table v-else-if="selectedPath === 'subcategories' && Object.keys(data).length">
      <thead>
        <tr>
          <th>uid</th>
          <th>categoryId</th>
          <th>name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, uid) in data" :key="uid">
          <td>{{ uid }}</td>
          <td>{{ item?.categoryId || " " }}</td>
          <td>{{ item?.name || " " }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Default generic table -->
    <table v-else-if="Object.keys(data).length">
      <thead>
        <tr>
          <th>uid</th>
          <th v-for="(key, index) in Object.keys(data[Object.keys(data)[0]])" :key="index">
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, uid) in data" :key="uid">
          <td>{{ uid }}</td>
          <td v-for="(value, key) in item" :key="key">{{ value }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>No data available.</p>
  </div>
</template>

<script>
import { getFirstLevelPaths } from "@/services/firebaseDbService";

export default {
  data() {
    return {
      availablePaths: [],
      selectedPath: "",
    };
  },

  computed: {
    data() {
      return this.$store.getters["data/getData"](this.selectedPath);
    },

    carts() {
      return this.$store.getters["data/getData"]("carts") || {};
    },

    favorites() {
      return this.$store.getters["data/getData"]("favorites") || {};
    },

    users() {
      return this.$store.getters["data/getData"]("users") || {};
    },

    activeProductList() {
      return this.$store.getters["data/activeProductList"];
    },
  },

  async mounted() {
    await this.fetchAvailablePaths();
    await this.$store.dispatch("data/fetchData", "users");
    await this.$store.dispatch("data/fetchData", "carts");
    await this.$store.dispatch("data/fetchData", "favorites");
  },

  methods: {
    async fetchAvailablePaths() {
      try {
        this.availablePaths = (await getFirstLevelPaths()).filter((path) => path !== "orders"); // order handling in another component
      } catch (error) {
        console.error("Error fetching available paths:", error);
      }
    },

    async fetchNode() {
      if (!this.selectedPath || this.selectedPath === "carts" || this.selectedPath === "favorites") return;
      await this.$store.dispatch("data/fetchData", this.selectedPath);
      // console.log(this.data);
    },

    getUserInfo(uid) {
      const user = this.users[uid];
      return user ? `${user.email} - ${user.name}` : "anonim"; // Bc only anonim/logged in users can put anything in cart this is a shortcut
    },

    getCartItems(cart) {
      if (!cart) return "";
      const items = [];

      Object.values(cart).forEach((entry) => {
        if (entry.productId && entry.quantity) {
          const product = this.activeProductList.find((prod) => entry.productId == prod.id);
          items.push(`${product?.name || entry.productId} x ${entry.quantity}`);
        }
      });
      return items.join(", ");
    },

    getFavoriteItems(favList) {
      if (!favList) return "";
      return Object.values(favList).join(", ");
    },

    openPicture(url) {
      if (url) {
        window.open(url, "_blank");
      }
    },
  },
};
</script>

<style scoped>
table {
  width: 98%;
  border-collapse: collapse;
  margin: 1em;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f4f4f4;
}

.outlined-select {
  outline: 1px solid black;
}
</style>
