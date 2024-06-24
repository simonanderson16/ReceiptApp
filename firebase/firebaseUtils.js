import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const addUser = async (user) => {
    try {
        const id = user.uid;
        const userData = user.data;
        await setDoc(doc(db, "users", id), userData);
        return true;
    } catch (error) {
        console.error("Error adding user: ", error);
        return false;
    }
}

export const getUserInfo = async (uid) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.error("No such user");
            return false;
        }
    } catch (error) {
        console.error("Error getting user info: ", error);
        return false;
    }
}