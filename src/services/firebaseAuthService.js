// src/authService.js
import db, { auth } from "@/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set } from "firebase/database";

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
