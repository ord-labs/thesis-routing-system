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

	getThesisByStudentAndRoute: async (studentId) => {
		try {
			set({ loading: true });
			
			const route = useThesisStore.getState().getCurrentRoute(); 

			const thesisRef = collection(db, 'thesisPaper');
			const snapshot = await getDocs(query(thesisRef, 
				where('currRoute', '==', route),
				where('studentId', '==', studentId)
			));

			const theses = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))
			.sort((a, b) => b.createdAt - a.createdAt);

			set({ theses, loading: false });

			return theses;
		} catch (error) {
			console.error(error);
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

	createThesisComment: async (comment) => {
		try {
			await addDoc(collection(db, 'comments'), comment)
		} catch (error) {
			console.error(error);
		}	
	},

	getThesisComment: async (paperId) => {
		try {
			let panels = [];
			const panelSnapshot = await getDocs(collection(db, "panel"));
	
			await Promise.all(panelSnapshot.docs.map(async (panelDoc) => { 
				const panelId = panelDoc.id;
				const panelLabel = panelDoc.data().position.label;
				const q = query(collection(db, "comments"), 
					where("paperId", "==", paperId), 
					where("panelId", "==", panelId)
				);
				const snapshot = await getDocs(q);
				
	
				if (!snapshot.empty) {
					snapshot.docs.forEach((doc) => {
						panels.push({ id: doc.id, panelName: panelDoc.data().name, panelLabel: panelLabel,  ...doc.data() });
					});
				}
			}));

			panels.sort((a, b) => {
				const numA = parseInt(a.panelLabel.replace(/\D/g, ""), 10); 
				const numB = parseInt(b.panelLabel.replace(/\D/g, ""), 10);
				return numA - numB; 
			});
	
			return panels;
		} catch (error) {
			console.error(error);
			return []; 
		}
	},
}));
