import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/firebaseConfig";

/**
 * Upload a file and return the public download URL.
 * path should be like `product_images/<some-id>/<filename>`
 */
export async function uploadFile(file, path) {
    if (!file) return null;
    const ref = storageRef(storage, path);
    await uploadBytes(ref, file);
    const url = await getDownloadURL(ref);
    return { url, path };
}


/**
 * Delete file by storage path (e.g. 'product_images/<id>/<filename>')
 */
/*export async function deleteFile(path) {
    if (!path) return;
    const ref = storageRef(storage, path);
    await deleteObject(ref);
}
    */