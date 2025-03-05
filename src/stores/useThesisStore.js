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
	deleteDoc,
} from 'firebase/firestore';
import { app, db } from '../server/firebase' 
import { studentModel } from '../models/studentModel';
import { panelModel } from '../models/panelModel';
import { adviserModel } from '../models/adviserModel';

export const useThesisStore = create((set) => ({
	theses: [],
	loading: false,

	updateApproveStatus: async (role, docId, paperId, approvedStatus) => {
		try {
			let updateData = {};

			const paperRef = doc(db, 'thesisPaper', paperId)
			
			if (role === "adviser") {
				updateData[`adviserId.approved`] = approvedStatus;
			} else {
				const panelRef = doc(db, 'panel', docId);
				const docSnap = await getDoc(panelRef);
	
				const label = docSnap.data().position.label;
				const panelNum = parseInt(label.split(' ')[1], 10);
				
				updateData[`panelIds.${panelNum - 1}.panelId`] = docId;
				updateData[`panelIds.${panelNum - 1}.approved`] = approvedStatus;
			} 
			await updateDoc(paperRef, updateData);
		} catch (error) {
			console.error(error);
		}	
	},

	getStatus: async (role, docId, paperId) => {
		try {
			if (!docId || !paperId) {
				throw new Error('docId or paperId is undefined');
			}

			// Get the thesis paper document
			const paperRef = doc(db, 'thesisPaper', paperId);
			const paperSnap = await getDoc(paperRef);
		
			if (!paperSnap.exists()) {
				throw new Error('Thesis paper not found');
			}
		
			const paperData = paperSnap.data();
		
			if (role === "adviser") {
				// Return the approved status for the adviser
				return paperData.adviserId?.approved;
			} else {
				// For panel members, fetch the panel document to determine the panel's position
				const panelRef = doc(db, 'panel', docId);
				const panelSnap = await getDoc(panelRef);
		
				if (!panelSnap.exists()) {
					throw new Error('Panel document not found');
				}
		
				const panelData = panelSnap.data();
				const label = panelData.position?.label;
				if (!label) {
					throw new Error('Panel position label not found');
				}
				const panelNum = parseInt(label.split(' ')[1], 10);
		
				// Return the approved status from the corresponding panelIds array
				return paperData.panelIds?.[panelNum - 1]?.approved;
			}
		} catch (error) {
			console.error("Error fetching approved status:", error);
			return null;
		}
	},

	getCurrentRoute: () => {
		if (typeof window !== "undefined") {  // ✅ Prevents errors during SSR
			const pathnameParts = window.location.pathname.split("/").filter(Boolean);
			const length = pathnameParts.length;
	
			if (length >= 2) {
				return `/${pathnameParts[length - 2]}/${pathnameParts[length - 1]}`;
			}
		}
		return null;
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
			return { success: false, error: error.message };
		}
	},

	createThesisComment: async (comment, role, docId, paperId, approvedStatus) => {
		try {

			let updateData = {};

			const commentRef = collection(db, role, docId, 'comments');
			const paperRef = doc(db, 'thesisPaper', paperId)
			if (role === "adviser") {
				updateData["adviserId.adviserId"] = docId;
				updateData["adviserId.approved"] = approvedStatus;
			} else {
				const panelRef = doc(db, 'panel', docId);
				const docSnap = await getDoc(panelRef);
	
				const label = docSnap.data().position.label;
				const panelNum = parseInt(label.split(' ')[1], 10);
	
				updateData[`panelIds.${panelNum - 1}.panelId`] = docId;
				updateData[`panelIds.${panelNum - 1}.approved`] = approvedStatus;
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

			const paperRef = doc(db, "thesisPaper", paperId);
			const paperSnapshot = await getDoc(paperRef);

			let panelIds = [];
			if (paperSnapshot.exists()) {
				const data = paperSnapshot.data();
				const panelIdsArray = Object.values(data.panelIds); 

				panelIds = Array.isArray(panelIdsArray) ? data.panelIds : []; 
				console.log(panelIds);
				
			}
			 else {
				console.log("Document not found");
			}

			// Loop through each panel to get comments or approved status
			await Promise.all(panelSnapshot.docs.map(async (panelDoc) => {
				const panelId = panelDoc.id;
				const commentsRef = collection(db, "panel", panelId, "comments");
				const q = query(commentsRef, where("paperId", "==", paperId));
				const commentsSnapshot = await getDocs(q);

				const panelIdsArray = Object.values(panelIds);

				const panelData = panelDoc.data();
				const panelInfo = panelIdsArray.find(p => p.panelId === panelId); 

				if (!commentsSnapshot.empty) {
					const firstCommentDoc = commentsSnapshot.docs[0];
					matchingPanels.push({
						id: panelId,
						...panelData,
						approved: panelInfo ? panelInfo.approved : false,
						comment: firstCommentDoc.data().comment
					});
				} else if (panelInfo && panelInfo.approved) {
					// If no comment but approved is true, add it
					matchingPanels.push({
						id: panelId,
						...panelData,
						comment: null, // No comment
						approved: true
					});
				}
			}));

			// Loop through each adviser to check comments
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

			// Sort panels based on position.label (ex: "Panel 1", "Panel 2", etc.)
			const sortedPanels = matchingPanels.sort((a, b) => {
				const numA = parseInt(a.position.label.replace(/\D/g, ""), 10);
				const numB = parseInt(b.position.label.replace(/\D/g, ""), 10);
				return numA - numB;
			});

			const allComments = [...sortedPanels, ...matchingAdvisers];
			console.log(allComments);
			return allComments;

		} catch (error) {
			console.error("Error fetching comments:", error);
			return [];
		}
	},

	deletePaper: async (paperId) => {
		try {
			const paperRef = doc(db, "thesisPaper", paperId);
			await deleteDoc(paperRef);
		} catch (error) {
			console.error("Error deleting paper:", error);
		}
	},

	getThesisStatus: async (paperId) => {
		try {
			const paperRef = doc(db, 'thesisPaper', paperId);
			const paperSnap = await getDoc(paperRef);
			if (paperSnap.exists()) {
				const paperData = paperSnap.data();
				console.log('Fetched paper data:', paperData); // Debugging information
				
				const adviserApproved = paperData.adviserId?.approved;
				const panelIds = Array.isArray(paperData.panelIds) ? paperData.panelIds : [];
				const panelApproved = panelIds.every(panel => panel.approved);
				
				console.log('Adviser approved:', adviserApproved); // Debugging information
				console.log('Panel approved:', panelApproved); // Debugging information
				
				const status = adviserApproved && panelApproved ? 'approved' : 'not approved';
				console.log('Computed status:', status); // Debugging information
				return status;
			} else {
				throw new Error('Thesis paper not found');
			}
		} catch (error) {
			console.error('Error fetching thesis status:', error);
			return null;
		}
	},

	getPanels: async () => {
		try {
			const panelsRef = collection(db, 'panel');
			const panelsSnapshot = await getDocs(panelsRef);
			
			const panels = panelsSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			}));

			return panels
		} catch (error) {
			console.error(error);
		}
	},

	assignPanelsToPaper: async (paperId, panelIds, docId) => {
		try {
			let updateData = {};

			const paperRef = doc(db, 'thesisPaper', paperId);
			const paperSnap = await getDoc(paperRef);

			// If docId is provided, get its label for panel numbering
			if (docId) {
				const panelRef = doc(db, 'panel', docId);
				const panelSnap = await getDoc(panelRef);
				
				if (panelSnap.exists()) {
					const label = panelSnap.data().position?.label || 'Panel 1';
					const panelNum = parseInt(label.split(' ')[1], 10) || 1;

					// Update each panel ID
					panelIds.forEach((panelId, index) => {
						updateData[`panelIds.${panelNum - 1 + index}.panelId`] = panelId;
						updateData[`panelIds.${panelNum - 1 + index}.approved`] = false;
					});
				}
			} else {
				// Fallback: use first panel's index
				panelIds.forEach((panelId, index) => {
					updateData[`panelIds.${index}.panelId`] = panelId;
					updateData[`panelIds.${index}.approved`] = false;
				});
			}
			await updateDoc(paperRef, updateData);			
		} catch (error) {
			console.error('Error assigning panels:', error);
		}
	},

	fetchPanelsAssigned: async (paperId) => {
		try {
			const paperRef = doc(db, 'thesisPaper', paperId);
			const paperSnap = await getDoc(paperRef);

			if (paperSnap.exists()) {
				const paperData = paperSnap.data();
				console.log('paperData: ', paperData);
				
				// ang e return ani is ang mga panelIds sa thesisPaper 
				// to access the panelid kay paperData.panelIds.panelId
				// dayon pag implement ani sa frontend kay e match ra ang panelIds diri to the panelids nga na fetch sa fetchPanel() na function 
				return paperData.panelIds;
			} else {
				throw new Error('Thesis paper not found');
			}
		} catch (error) {
			console.error(error);
		}
	},

	fetchAdviser: async (paperId) => {
		try {
			const paperRef = doc(db, 'thesisPaper', paperId);			
			const paperSnap = await getDoc(paperRef);
	
			if (paperSnap.exists()) {
				const paperData = paperSnap.data();
				
				const adviserObj = paperData?.adviserId;
				if (!adviserObj || !adviserObj.adviserId) {
					console.warn('No valid adviserId found in paperData. Returning placeholder.');
					return "Unknown Adviser";
				}
	
				const adviserRef = doc(db, 'adviser', adviserObj.adviserId);
				const adviserSnap = await getDoc(adviserRef);
	
				if (adviserSnap.exists()) {
					const adviserData = adviserSnap.data();
					return adviserData.name || "Unknown Adviser";
				} else {
					console.warn('Adviser document not found. Returning placeholder.');
					return "Unknown Adviser";
				}
			} else {
				console.warn('Thesis paper not found. Returning placeholder.');
				return "Unknown Adviser";
			}
		} catch (error) {
			console.error(error);
			return "Unknown Adviser";
		}
	},

	fetchAllAdvisers: async () => {
		try {
			const advisersRef = collection(db, 'adviser');
			const advisersSnapshot = await getDocs(advisersRef);
			return advisersSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data()
			}))
		} catch (error) {
			console.error(error);
		}
	},

	getThesisDetails: async (paperId) => {
		try {
			const paperRef = doc(db, 'thesisPaper', paperId);
			const paperSnap = await getDoc(paperRef);
			if (paperSnap.exists()) {
				const paperData = paperSnap.data();
				console.log('Fetched paper data:', paperData); // Debugging information
				
				// Fetch adviser name
				const { fetchAdviser } = useThesisStore.getState();
				const adviserName = await fetchAdviser(paperId) || 'Unknown Adviser';
				console.log('Fetched adviser name:', adviserName);

				// Fetch student names
				const studentRef = doc(db, 'student', paperData.studentId);
				const studentSnap = await getDoc(studentRef);
				const studentNames = studentSnap.exists() ? [studentSnap.data().name] : ['Unknown Student'];
				console.log('Fetched student names:', studentNames); // Debugging information

				return { adviserName, studentNames };
			} else {
				throw new Error('Thesis paper not found');
			}
		} catch (error) {
			console.error('Error fetching thesis details:', error);
			return { adviserName: 'Unknown Adviser', studentNames: [] };
		}
	},
}));

const getStatus = async (thesisId) => {
	try {
		const thesisDoc = await getDoc(doc(db, 'theses', thesisId));
		const thesis = thesisDoc.data();

		if (!thesis) {
			throw new Error('Thesis not found');
		}

		const status = thesis.status;
		if (!status) {
			throw new Error('Status not found');
		}

		return status;
	} catch (error) {
		console.error('Error fetching approved status:', error.message);
		throw error;
	}
};
