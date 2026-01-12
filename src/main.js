import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

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
        sets: { mdi },
    },
})

const handleAuthStateChange = async (user) => {
    if (user) {
        console.log(user.isAnonymous ? "Guest user" : `Logged-in user: ${user.email}`);

        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.exists() ? snapshot.val() : {};

        store.commit("user/setUser", { uid: user.uid, email: user.email, isAnonymous: user.isAnonymous, ...userData });

        const roleSnapshot = await get(ref(db, `users/${user.uid}/role`));
        const role = roleSnapshot.exists() ? roleSnapshot.val() : null;
        store.commit("user/setRole", role);

        /* // THIS SCRIPT IS FOR DEBUGGING THE STORAGE CLAIMS
        // Ensure ID token is refreshed so custom claims appear, then log them for debugging
        try {
            if (auth.currentUser) {
                await auth.currentUser.getIdToken(true); // force refresh
                const idRes = await auth.currentUser.getIdTokenResult();
                console.log("ID token claims:", idRes.claims);
            }
        } catch (e) {
            console.error("Error refreshing token / reading claims:", e);
        }

        // helper usable from browser console: call window.logClaims()
        window.logClaims = async () => {
            if (!auth.currentUser) return console.log("no current user");
            const r = await auth.currentUser.getIdTokenResult();
            console.log(r.claims);
            return r.claims;
        };
        */
        store.dispatch("favorites/fetchFavorites");
        store.dispatch("cart/fetchCart");
    } else {
        console.log("No user - signing in anonymously...");
        await signInAnonymously(auth);
    }
}

// Wait for onAuthStateChanged before mounting app -> this way on init the router will already have the currentUser.
// This caused so much trouble, just leave it as it is
let appMounted = false;

onAuthStateChanged(auth, async (user) => {
    try {
        await handleAuthStateChange(user);
    } catch (err) {
        console.error("Error handling auth state change:", err);
    }

    // Mount the app only once
    if (!appMounted) {
        createApp(App)
            .use(store)
            .use(router)
            .use(vuetify)
            .mount('#app');

        appMounted = true;
    }
})
