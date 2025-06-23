<template>
  <div>
    <h1>Megrendelések kezelése</h1>

    <div v-if="paginatedOrders.length">
      <!-- Pagination Tabs -->
      <div class="pagination">
        <button
          v-for="(page, index) in totalPages"
          :key="index"
          @click="currentPage = index"
          :class="{ active: currentPage === index }">
          {{ index + 1 }}
        </button>
      </div>

      <!-- Orders Table -->
      <table>
        <thead>
          <tr>
            <th>UID</th>
            <th>Felhasználó (email - id)</th>
            <th>Létrehozás dátuma</th>
            <th>Státusz</th>
            <th>Végösszeg</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in paginatedOrders[currentPage] || []"
            :key="order.orderId"
            @click="goToOrder(order.userId, order.orderId)"
            style="cursor: pointer">
            <td>{{ order.orderId }}</td>
            <td>{{ getUserInfo(order.userId) }}</td>
            <td>{{ formatDate(order.creationDate) || "-" }}</td>
            <td :class="colorStatusBackground(order.status)">{{ order.status || "-" }}</td>
            <td>{{ order.totalPrice }} Ft</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else>Nincsenek rendelések.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sortedOrders: [],
      currentPage: 0,
      itemsPerPage: 10,
    };
  },

  computed: {
    users() {
      return this.$store.getters["data/getData"]("users") || {};
    },

    orders() {
      return this.$store.getters["data/getData"]("orders") || {};
    },

    totalPages() {
      return Math.ceil(this.sortedOrders.length / this.itemsPerPage);
    },

    paginatedOrders() {
      const pages = [];
      for (let i = 0; i < this.sortedOrders.length; i += this.itemsPerPage) {
        pages.push(this.sortedOrders.slice(i, i + this.itemsPerPage));
      }
      return pages;
    },
  },

  async mounted() {
    await this.$store.dispatch("data/fetchData", "users");
    await this.$store.dispatch("data/fetchData", "orders");
    await this.getOrders();
  },

  methods: {
    async getOrders() {
      const ordersList = [];
      Object.entries(this.orders).forEach(([userId, userOrders]) => {
        Object.entries(userOrders).forEach(([orderId, orderData]) => {
          ordersList.push({
            userId,
            orderId,
            ...orderData,
          });
        });
      });

      // Sort descending by creationDate
      this.sortedOrders = ordersList.sort((a, b) => {
        const bDate = new Date(b.creationDate);
        const aDate = new Date(a.creationDate);
        return (bDate.getTime() || 0) - (aDate.getTime() || 0); // Converting to milliseconds - this way not just by date, but by time gets sorted
      });
    },

    getUserInfo(uid) {
      const user = this.users[uid];
      return user ? `${user.email} - ${uid}` : `anonim - ${uid}`;
    },

    goToOrder(userId, orderId) {
      this.$router.push(`/admin/${userId}/${orderId}`);
    },

    formatDate(datetime) {
      const d = new Date(datetime);
      const minutes = d.getMinutes() < 10 ? "0" + d.getMinutes(2) : d.getMinutes();

      return (
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + minutes
        // +
        // ":" +
        // d.getSeconds()
      );
    },

    colorStatusBackground(orderStatus) {
      if (orderStatus === "pending") return "yellow-bg";
      if (orderStatus === "in progress") return "blue-bg";
      if (orderStatus === "completed") return "green-bg";
      return "";
    },
  },
};
</script>

<style scoped>
table {
  width: 98%;
  border-collapse: collapse;
  margin: 1em 0;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f4f4f4;
}

.pagination {
  margin: 1em 0;
}

.pagination button {
  margin-right: 6px;
  padding: 6px 12px;
  border: 1px solid #333;
  background: #f8f8f8;
  cursor: pointer;
}

.pagination button.active {
  background: #333;
  color: #fff;
}

.yellow-bg {
  background-color: yellow;
}

.blue-bg {
  background-color: aqua;
}

.green-bg {
  background-color: green;
}
</style>
