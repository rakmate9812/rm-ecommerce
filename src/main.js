import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

//Firebase
import db, { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // This is needed for the vuetify icons to load 


onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User is logged in:", user.email);

        const { ref, get } = await import("firebase/database");

        // Fetch user data
        const snapshot = await get(ref(db, `users/${user.uid}`));
        const userData = snapshot.exists() ? snapshot.val() : {};

        // Commit user basic info
        store.commit("user/setUser", { uid: user.uid, email: user.email, ...userData });

        // Fetch and commit user role if exists
        const roleSnapshot = await get(ref(db, `users/${user.uid}/role`));
        const role = roleSnapshot.exists() ? roleSnapshot.val() : null;
        store.commit("user/setRole", role);

        // Fetch favorites
        store.dispatch("favorites/fetchFavorites");

    } else {
        console.log("User is not logged in");

        store.commit("user/setUser", null);
        store.commit("user/setRole", null);
        store.commit("favorites/setFavorites", []);
    }
});

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
})

createApp(App).use(store).use(router).use(vuetify).mount('#app')

