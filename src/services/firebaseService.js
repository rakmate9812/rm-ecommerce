/* eslint-disable */
import { ref, get } from "firebase/database";
import db from "../firebaseConfig";

/**
 * Fetches data from the Firebase Realtime Database.
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
