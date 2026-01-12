/*
Node script that reads JSON and pushes each product so Firebase generates random keys

1 - Create a Firebase service account JSON (from Firebase Console) and save as scripts/serviceAccountKey.json. --> SEE INSTRUCTIONS AT setAdminClaim.js
2 - Put your exported JSON at scripts/products.json.
3 - Run: npm install firebase-admin && node scripts/importProducts.js

*/


const admin = require("firebase-admin");
const path = require("path");

// ...place your service account JSON from Firebase console next to this script
const serviceAccount = require(path.resolve(__dirname, "serviceAccountKey.json"));
// ...place the exported products JSON as products.json next to this script
const productsJson = require(path.resolve(__dirname, "products.json"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // replace with your DB URL from [src/firebaseConfig.js](src/firebaseConfig.js) or set via env
    databaseURL: "https://rm-ecommerce-default-rtdb.europe-west1.firebasedatabase.app",
});

const db = admin.database();

function normalizeItems(data) {
    if (!data) return [];
    // direct array export
    if (Array.isArray(data)) return data;

    // common case: { "products": [ ... ] } or { "products": { "0": {...}, ... } }
    if (data.products) {
        if (Array.isArray(data.products)) return data.products;
        if (typeof data.products === 'object') return Object.values(data.products);
    }

    // if top-level is an object with numeric keys or a keyed object -> return values
    const vals = Object.values(data);
    // if it's [ [...items...] ] -> return the inner array
    if (vals.length === 1 && Array.isArray(vals[0])) return vals[0];

    return vals;
}

async function run() {
    const ref = db.ref("products");
    const items = normalizeItems(productsJson);

    for (const item of items) {
        // push each item so Firebase generates its random key
        await ref.push(item);
        console.log("pushed:", item.name || item.id || "<no-name>");
    }

    console.log("Import finished");
    process.exit(0);
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});