import { create } from 'zustand';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import {
	getFirestore,
	doc,
	setDoc,
	getDoc,
	query,
	where,
	collection,
	getDocs,
} from 'firebase/firestore';
import { app, auth, db } from '../server/firebase'; // Adjust to your Firebase config file

// const auth = getAuth(app);
// const db = getFirestore(app);

export const useAuthStore = create((set, get) => ({
	user: null,
	isLoggedIn: false,
	role: null,

	// Register user using ID number
	registerUser: async (idNumber, password, role, additionalData = {}) => {
		try {
			const generatedEmail = `${idNumber}@school.edu`; // Fake email format
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				generatedEmail,
				password
			);
			const user = userCredential.user;

			// Store user details in Firestore
			await setDoc(doc(db, 'users', idNumber), {
				idNumber,
				email: generatedEmail,
				role,
				...additionalData,
			});

			set({ user, isLoggedIn: true, role });
		} catch (error) {
			console.error('Registration Error:', error.message);
		}
	},

	loginAdmin: async (email, password) => {
		try {
			// Authenticate admin using Firebase Auth
			const loginResponse = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);

			return loginResponse.user;
		} catch (error) {
			return {
				message: 'Login failed',
			};
		}
	},

	// Login using ID Number instead of email
	loginUser: async (idNumber, password) => {
		try {
			// Fetch user details from Firestore using ID number
			const userQuery = query(
				collection(db, 'users'),
				where('idNumber', '==', idNumber)
			);
			const userSnapshot = await getDocs(userQuery);

			if (!userSnapshot.empty) {
				const userData = userSnapshot.docs[0].data();
				const generatedEmail = userData.email; // Get stored email

				// Authenticate using Firebase Auth
				const userCredential = await signInWithEmailAndPassword(
					auth,
					generatedEmail,
					password
				);
				const user = userCredential.user;

				set({ user, isLoggedIn: true, role: userData.role });
			} else {
				console.error('Login Error: ID Number not found');
			}
		} catch (error) {
			console.error('Login Error:', error.message);
		}
	},

	// Logout function
	logoutUser: async () => {
		try {
			await signOut(auth);
			set({ user: null, isLoggedIn: false, role: null });
		} catch (error) {
			console.error('Logout Error:', error.message);
		}
	},

	// Helper functions for role-based registration
	registerStudent: async (idNumber, password, studentData) => {
		await useAuthStore
			.getState()
			.registerUser(idNumber, password, 'student', studentData);
	},
	registerPanel: async (idNumber, password, panelData) => {
		await useAuthStore
			.getState()
			.registerUser(idNumber, password, 'panel', panelData);
	},
	registerAdviser: async (idNumber, password, adviserData) => {
		await useAuthStore
			.getState()
			.registerUser(idNumber, password, 'adviser', adviserData);
	},

	// Role-based login functions
	// loginAdmin: async (email, password) => {
	// 	await useAuthStore.getState().loginAdmin(email, password);
	// },
	loginStudent: async (idNumber, password) => {
		await useAuthStore.getState().loginUser(idNumber, password);
	},
	loginPanel: async (idNumber, password) => {
		await useAuthStore.getState().loginUser(idNumber, password);
	},
	loginAdviser: async (idNumber, password) => {
		await useAuthStore.getState().loginUser(idNumber, password);
	},
}));
