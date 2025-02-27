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
			
			return { success: false, error: error.message };
		}
	},

	createThesisComment: async (comment, role, docId, paperId) => {
		try {

			let updateData = {};

			const commentRef = collection(db, role, docId, 'comments');
			const paperRef = doc(db, 'thesisPaper', paperId)
			
			if (role === "adviser") {
				updateData["adviserId"] = docId;
			} else {
				const panelRef = doc(db, 'panel', docId)
				const docSnap = await getDoc(panelRef);
				const label = docSnap.data().position.label
				const panelNum = label.split(' ')[1]

				updateData[`panelIds.${panelNum-1}`] = docId; 
			}
			
			const q = query(commentRef, where("paperId", "==", paperId)); 
			const querySnapshot = await getDocs(q);
	
			if (!querySnapshot.empty) {
				querySnapshot.forEach(async (docSnap) => {
					const existingCommentRef = doc(db, role, docId, 'comments', docSnap.id);
					await updateDoc(existingCommentRef, comment);
				});
			} else {
				await addDoc(commentRef, comment);
			}
	
			await updateDoc(paperRef, updateData);
		} catch (error) {
			console.error(error);
		}	
	},

	getThesisComment: async (paperId) => {
		try {
			const adviserCollection = collection(db, "adviser");
			const panelCollection = collection(db, "panel");
	
			const adviserSnapshot = await getDocs(adviserCollection);
			const panelSnapshot = await getDocs(panelCollection);
	
			let matchingPanels = [];
			let matchingAdvisers = [];
	
			await Promise.all(panelSnapshot.docs.map(async (panelDoc) => {
				const panelId = panelDoc.id;
				const commentsRef = collection(db, "panel", panelId, "comments");
				const q = query(commentsRef, where("paperId", "==", paperId));
				const commentsSnapshot = await getDocs(q);
	
				if (!commentsSnapshot.empty) {
					const firstCommentDoc = commentsSnapshot.docs[0];
					matchingPanels.push({ 
						id: panelId, 
						...panelDoc.data(), 
						comment: firstCommentDoc.data().comment 
					});
				}
			}));
	
			// Loop through each adviser to check its 'comments' subcollection
			await Promise.all(adviserSnapshot.docs.map(async (adviserDoc) => {
				const adviserId = adviserDoc.id;
				const commentsRef = collection(db, "adviser", adviserId, "comments");
				const q = query(commentsRef, where("paperId", "==", paperId));
				const commentsSnapshot = await getDocs(q);
	


				if (!commentsSnapshot.empty) {
					const firstCommentDoc = commentsSnapshot.docs[0]; 
					matchingAdvisers.push({ 
						id: adviserId, 
						...adviserDoc.data(), 
						comment: firstCommentDoc.data().comment 
					});
				}
				
			}));
			
			const sortedPanel = matchingPanels.sort((a, b) => {
				const numA = parseInt(a.position.label.replace(/\D/g, ""), 10);
				const numB = parseInt(b.position.label.replace(/\D/g, ""), 10);
				return numA - numB;
			});

			const allComments = [...sortedPanel, ...matchingAdvisers];
			console.log(allComments);
			return allComments;
	
		} catch (error) {
			console.error("Error fetching comments:", error);
			return [];
		}
	}
}));
