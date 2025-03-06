<template>
  <div>
    <label for="path-select">Select a data node:</label>
    <select v-model="selectedPath" @change="fetchNode">
      <option v-for="(path, index) in availablePaths" :key="index" :value="path">
        {{ path }}
      </option>
    </select>

    <h2>{{ selectedPath || "No Data Selected" }}</h2>

    <table v-if="Object.keys(data).length">
      <thead>
        <tr>
          <th v-for="(key, index) in Object.keys(data[Object.keys(data)[0]])" :key="index">
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, id) in data" :key="id">
          <td v-for="(value, key) in item" :key="key">{{ value }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No data available.</p>
  </div>
</template>

<script>
import { getFirstLevelPaths } from "@/services/firebaseService";

export default {
  data() {
    return {
      availablePaths: [], // Stores top-level paths from Firebase
      selectedPath: "", // Holds the selected database path
    };
  },
  computed: {
    data() {
      return this.$store.getters.getData(this.selectedPath);
    },
  },
  async mounted() {
    await this.fetchAvailablePaths();
  },
  methods: {
    async fetchAvailablePaths() {
      try {
        this.availablePaths = await getFirstLevelPaths();
      } catch (error) {
        console.error("Error fetching available paths:", error);
      }
    },
    async fetchNode() {
      if (!this.selectedPath) return;

      try {
        await this.$store.dispatch("fetchData", this.selectedPath);
        console.log(this.$store.getters.getData(this.selectedPath));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    
    logDataFromStore() {
      console.log(this.$store.getters.getData());
      console.log(this.$store.state.data);
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f4f4f4;
}
</style>
