<template>
  <div v-if="visible" class="modal-overlay" @click.self="handleCancel">
    <div class="modal-window">
      <p class="modal-message">{{ message }}</p>
      <div class="modal-buttons">
        <v-btn @click="handleOk" color="secondary"> Rendben </v-btn>
        <v-btn v-if="cancelVisible" @click="handleCancel" color="grey"> Mégsem </v-btn>
        <!-- <button class="btn btn-ok" @click="handleOk">Ok</button>
        <button class="btn btn-cancel" @click="handleCancel">Mégsem</button> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseModal",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    cancelVisible: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["ok", "cancel"],
  methods: {
    handleOk() {
      this.$emit("ok");
    },
    handleCancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-window {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  text-align: center;
}

.modal-message {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
}

.btn-ok {
  background-color: #4caf50;
  color: white;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
}
</style>
