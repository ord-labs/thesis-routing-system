import { create } from "zustand";
import { db } from "../server/firebase";
import { doc, getDoc } from "firebase/firestore";

export const useSidebarStore = create((set, get) => ({
  getUserDetails: async (role, userId) => {
    try {
      // Construct a reference to the Firestore document
      const userRef = doc(db, role, userId);
      const userSnapshot = await getDoc(userRef);

      // Check if the document exists
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        return userData;
      } else {
        console.error(
          `No document found in the "${role}" collection with ID "${userId}"`
        );
        return undefined;
      }
    } catch (error) {
      console.error("Error in getUserDetails:", error);
      return undefined;
    }
  },
}));
