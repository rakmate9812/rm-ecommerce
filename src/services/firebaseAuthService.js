// src/services/firebaseAuthService.js
import db, { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ref, set } from "firebase/database";

// --- AUTH METHODS ---

export const register = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Save additional user data
    await set(ref(db, `users/${uid}`), {
        email,
        name,
        role: "USER",
        defaultShippingAddress: "",
        defaultPhoneNumber: "",
        defaultUserInvoiceDataId: "",
    });

    return userCredential.user;
};

export const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

// --- ERROR MESSAGE MAPPER ---

const errorMessages = {
    "auth/invalid-credential": "Hibás email cím vagy jelszó.",
    "auth/invalid-email": "Hibás email cím formátum.",
    "auth/user-disabled": "Ez a fiók le van tiltva.",
    "auth/user-not-found": "Nem található felhasználó ezzel az email címmel.",
    "auth/wrong-password": "Helytelen jelszó.",
    "auth/email-already-in-use": "Ez az email cím már használatban van.",
    "auth/weak-password": "A jelszónak legalább 6 karakter hosszúnak kell lennie.",
};

export const getAuthErrorMessage = (errorCode) =>
    errorMessages[errorCode] || "Ismeretlen hiba történt.";
