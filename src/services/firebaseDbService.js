/* eslint-disable */
import { onValue, ref, get, child } from "firebase/database";
import db, { auth } from "../firebaseConfig";

/**
 * Fetches all data from the Firebase Realtime Database.
 * @param {string} path - The path to the data in the database.
 * @returns {Promise<any>} - The fetched data.
 */
export async function fetchDataFromDatabase(path) {
    try {
        const dbRef = ref(db, path); // Create a reference to the specified path
        const snapshot = await get(dbRef); // Fetch the data
        if (snapshot.exists()) {
            return snapshot.val(); // Return the data if it exists
        } else {
            console.warn(`No data found at path: ${path}`);
            return null; // Return null if no data exists
        }
    } catch (error) {
        console.error("Error fetching data from database:", error);
        throw error;
    }
}

// Utility: wait until auth is ready
function waitForAuthReady() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe(); // stop listening
            resolve(user);
        });
    });
}

// Get first-level paths from the database
export const getFirstLevelPaths = async () => {
    const user = await waitForAuthReady();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const snapshot = await get(ref(db));
    if (snapshot.exists()) {
        return Object.keys(snapshot.val());
    } else {
        return [];
    }
};
