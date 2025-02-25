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
import { app } from '..//server/firebase' 
import { studentModel } from '../models/studentModel';
import { panelModel } from '../models/panelModel';
import { adviserModel } from '../models/adviserModel';

const db = getFirestore(app);

export const useThesisStore = create((set) => ({
	theses: [],
	loading: false,

	getAllThesis: async () => {
		set({ loading: true });
		try {
			const thesisRef = collection(db, 'thesis');
			const snapshot = await getDocs(thesisRef);
			const theses = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			set({ theses, loading: false });
			return theses;
		} catch (error) {
			console.error('Error fetching theses:', error);
			set({ loading: false });
		}
	},

	createThesis: async (thesis) => {
		try {
			const thesisRef = await addDoc(collection(db, 'thesisPaper'), thesis);
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

	getThesisByStudent: async (studentId) => {
		try {
			const q = query(
				collection(db, 'thesis'),
				where('student', '==', studentId)
			);
			const snapshot = await getDocs(q);
			return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		} catch (error) {
			console.error('Error fetching student thesis:', error);
		}
	},

	getThesisByAdviser: async (adviserId) => {
		try {
			const q = query(
				collection(db, 'thesis'),
				where('adviser', '==', adviserId)
			);
			const snapshot = await getDocs(q);
			return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		} catch (error) {
			console.error('Error fetching adviser thesis:', error);
		}
	},

	getThesisByPanel: async (panelId) => {
		try {
			const q = query(
				collection(db, 'thesis'),
				where('panels', 'array-contains', panelId)
			);
			const snapshot = await getDocs(q);
			return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
		} catch (error) {
			console.error('Error fetching panel thesis:', error);
		}
	},
}));
