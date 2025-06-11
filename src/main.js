import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

// Firebase
import db, { auth } from "@/firebaseConfig";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { ref, get } from "firebase/database"

// Set up Vuetify
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

// Auth state handler
const handleAuthStateChange = async (user) => {
    if (user) {
        console.log(user.isAnonymous ? "Guest user" : `Logged-in user: ${user.email}`);

        // Fetch user data
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.exists() ? snapshot.val() : {};

        store.commit("user/setUser", { uid: user.uid, email: user.email, isAnonymous: user.isAnonymous, ...userData });

        // Fetch user role
        const roleSnapshot = await get(ref(db, `users/${user.uid}/role`));
        const role = roleSnapshot.exists() ? roleSnapshot.val() : null;
        store.commit("user/setRole", role);

        // Load user-dependent data
        store.dispatch("favorites/fetchFavorites");
        store.dispatch("cart/fetchCart");

    } else {
        console.log("No user - signing in anonymously...");
        await signInAnonymously(auth);
    }
}

// Set up onAuthStateChanged listener
onAuthStateChanged(auth, handleAuthStateChange);

// Create and mount app
createApp(App)
    .use(store)
    .use(router)
    .use(vuetify)
    .mount('#app')
