/*
 * THESIS Document Definition
 *{
 *  student,
 *  panels, // Different Panel 1, 2, 3, 4
 *  adviser,
 *  fileUrl,
 *  groupNumber,
 *  comments,
 *  current_route, // Routes 1, 2, 3
 * }
 */

import { create } from 'zustand';
import {
	getFirestore,
	collection,
	doc,
	setDoc,
	getDoc,
	getDocs,
	updateDoc,
	query,
	where,
	addDoc,
} from 'firebase/firestore';
import { app, db } from '../server/firebase' 
import { studentModel } from '../models/studentModel';
import { panelModel } from '../models/panelModel';
import { adviserModel } from '../models/adviserModel';

export const useThesisStore = create((set) => ({
	theses: [],
	loading: false,

	getCurrentRoute: () => {
		if (typeof window !== "undefined") {  // ✅ Prevents errors during SSR
            const pathnameParts = window.location.pathname.split("/").filter(Boolean);
            return pathnameParts[pathnameParts.length - 1];
        }
		return null
    },

	getAllThesis: async () => {
		try {
			set({ loading: true });

			const route = useThesisStore.getState().getCurrentRoute(); 
			
			const thesisRef = collection(db, 'thesisPaper');
			const snapshot = await getDocs(query(thesisRef, where('currRoute', '==', route)));
			const theses = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))
			.sort((a, b) => b.createdAt - a.createdAt); 

			set({ theses, loading: false });
			
			return theses;
		} catch (error) {
			console.error('Error fetching theses:', error);
			set({ loading: false });
		}
	},

	createThesis: async (thesis) => {
		try {
			set({ loading: true });
			const thesisRef = await addDoc(collection(db, 'thesisPaper'), thesis);
			set((state) => ({
				theses: [
					{ id: thesisRef.id, ...thesis }, 
					...state.theses
				],
				loading: false,
			}));
			return { success: true };
		} catch (error) {
			console.error('Error creating thesis:', error);
			return { success: false, error: error.message };
		}
	},

	createThesisComment: async (id, newComment) => {
		try {
			const thesisRef = doc(db, 'thesis', id);
			const thesisSnap = await getDoc(thesisRef);

			if (!thesisSnap.exists()) {
				return { success: false, error: 'Thesis not found' };
			}

			const thesisData = thesisSnap.data();
			const { comments = [], panels, adviser, current_route } = thesisData;

			// Ensure the new comment includes the user role
			const updatedComments = [...comments, newComment];

			// Get unique users who have commented (panels & adviser)
			const commenters = new Set(updatedComments.map((c) => c.userId));

			// Check if all panels and adviser have commented
			const allPanelsCommented = panels.every((panelId) =>
				commenters.has(panelId)
			);
			const adviserCommented = commenters.has(adviser);

			let nextRoute = current_route;
			if (allPanelsCommented && adviserCommented && current_route < 3) {
				nextRoute += 1; // Move to next route
			}

			await updateDoc(thesisRef, {
				comments: updatedComments,
				current_route: nextRoute,
			});

			return { success: true, nextRoute };
		} catch (error) {
			console.error('Error adding thesis comment:', error);
			return { success: false, error: error.message };
		}
	},
}));
