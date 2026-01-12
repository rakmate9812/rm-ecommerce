
/*

Set admin claim for some UIDs once or occasionally.

USAGE
1 - npm install firebase-admin
2 - place serviceAccountKey.json
        Open Firebase Console -> Project settings (gear) -> Service accounts.
        Under "Firebase Admin SDK" click "Generate new private key" and confirm. That downloads a JSON file.
        Make sure the Firebase project matches your web app project.
        Rename the file to serviceAccountKey.json
        Place the file in your project near this file
        AND ADD TO .gitignore because it is sensitive!!!
3 - run: node src\services\storageAdminClaimService\setAdminClaim.js <ADMIN_UID> 
        Replace <ADMIN_UID> with the Firebase uid of the user you want to mark admin.
*/


const admin = require("firebase-admin");

// replace with path to your service account json downloaded from console
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function setAdmin(uid, makeAdmin = true) {
    const claims = makeAdmin ? { admin: true } : { admin: false };
    await admin.auth().setCustomUserClaims(uid, makeAdmin ? claims : null);
    console.log(`Updated claims for ${uid}:`, claims);
}

const uid = process.argv[2];
const makeAdmin = process.argv[3] !== "false";
if (!uid) {
    console.error("Usage: node setAdminClaim.js <UID> [true|false]");
    process.exit(1);
}
setAdmin(uid, makeAdmin).catch(console.error);