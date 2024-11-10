<template>
  <div class="hello">
    <div>
      <button @click="addToDb">Add to db</button>
    </div>
  </div>
</template>

<script>
import db from "../firebaseConfig";
import { ref, set } from "firebase/database";

export default {
  methods: {
    addToDb() {
      const rng = (Math.random() + 1).toString(36).substring(7); // creating random database item ID

      const reference = ref(db, "test/" + rng); // if there is no reference to this node, firebase creates one, if the reference exists, firebase overwrites it

      set(reference, "katsu");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
