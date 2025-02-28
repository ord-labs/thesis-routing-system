import { create } from "zustand";
import { db } from "../server/firebase";
import { doc, getDoc } from "firebase/firestore";

export const useSidebarStore = create((set, get) => ({
   getUserDetails: async (role, userId) => {
        try {
            const userRef = doc(db, role, userId);
            const userSnapshot = await getDoc(userRef);
            const userData = userSnapshot.data()
            return userData
        } catch (error) {
            console.error(error);
            return 'error'
        }
   },    
}));