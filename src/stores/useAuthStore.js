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
	addDoc,
} from 'firebase/firestore';
import { app, auth, db } from '../server/firebase'; // Adjust to your Firebase config file
import Cookies from 'js-cookie';

export const useAuthStore = create((set, get) => ({
	user: null,
	isLoggedIn: false,
	role: null,
	advisers: [],

	getAdvisers: async () => {
		try {
			// Query the 'adviser' collection from Firestore
			const advisersQuery = query(collection(db, 'adviser'));
			const querySnapshot = await getDocs(advisersQuery);

			// Extract data from Firestore documents and store them in an array
			const advisersList = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			const _formattedAdvisers = advisersList.map((adviser) => ({
				label: adviser.name,
				value: adviser.id,
			}));

			// Update the state with the list of advisers
			set({ advisers: _formattedAdvisers });
		} catch (error) {
			console.error('Error fetching advisers:', error.message);
		}
	},

	getCurrentUser: async () => {
		const auth = getAuth();
		const currentUser = auth.currentUser;

		if (!currentUser) {
			console.log('No user signed in');
			return null;
		}

		return currentUser;
	},

	// Register user using ID number
	registerUser: async (idNumber, password, role, userDetails) => {
		try {
			const generatedEmail = `${idNumber}@smcc.edu.ph`; // Fake email format
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				generatedEmail,
				password
			);
			const user = userCredential.user;

			const userRef = doc(db, 'users', idNumber);

			await Promise.all([
				setDoc(userRef, { email: generatedEmail, role }),
				addDoc(collection(db, role), userDetails),
			]);

			set({ user, isLoggedIn: true, role });
			return user;
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
				where('email', '==', `${idNumber}@smcc.edu.ph`)
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
				const userTypeQUery = query(
					collection(db, userData.role),
					where('userId', '==', idNumber)
				);
				const snapshot = await getDocs(userTypeQUery);
				const doc = snapshot.docs[0];
				const user = {
					id: doc.id,
					...doc.data(),
					accessToken: userCredential.user.accessToken,
				};

				set({ user, isLoggedIn: true, role: userData.role });
				return user;
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
			const role = Cookies.get('role');

			switch (role) {
				case 'admin':
					Cookies.remove('adminId');
				case 'student':
					Cookies.remove('studentId');
				case 'panel':
					Cookies.remove('panelId');
				case 'adviser':
					Cookies.remove('adviserId');
				default:
					Cookies.remove('userId');
			}
			Cookies.remove('accessToken');
			Cookies.remove('role');

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
		return await useAuthStore.getState().loginUser(idNumber, password);
	},
	loginPanel: async (idNumber, password) => {
		return await useAuthStore.getState().loginUser(idNumber, password);
	},
	loginAdviser: async (idNumber, password) => {
		return await useAuthStore.getState().loginUser(idNumber, password);
	},
}));
