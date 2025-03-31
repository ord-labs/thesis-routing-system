/*
 * THESIS Document Definition
 * {
 *   student,
 *   panels, // Different Panel 1, 2, 3, 4
 *   adviser,
 *   fileUrl,
 *   groupNumber,
 *   comments,
 *   current_route, // Routes 1, 2, 3
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
  deleteField,
  arrayUnion,
} from 'firebase/firestore';
import { app, db } from '../server/firebase';
import { studentModel } from '../models/studentModel';
import { panelModel } from '../models/panelModel';
import { adviserModel } from '../models/adviserModel';

export const useThesisStore = create((set) => ({
  theses: [],
  loading: false,

  updateApproveStatus: async (role, docId, paperId, approvedStatus) => {
    try {
      let updateData = {};
      const paperRef = doc(db, 'thesisPaper', paperId);

      if (role === 'adviser') {
        updateData[`adviserId.approved`] = approvedStatus;
      } else {
        const paperSnap = await getDoc(paperRef);
        if (!paperSnap.exists()) {
          throw new Error('Paper not found');
        }

        let panelIds = paperSnap.data().panelIds;
        if (!panelIds || typeof panelIds !== 'object') {
          panelIds = {};
        }
        panelIds[docId] = { panelId: docId, approved: approvedStatus };

        updateData[`panelIds`] = panelIds;
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

      const paperRef = doc(db, 'thesisPaper', paperId);
      const paperSnap = await getDoc(paperRef);

      if (!paperSnap.exists()) {
        throw new Error('Thesis paper not found');
      }

      const paperData = paperSnap.data();

      if (role === 'adviser') {
        return paperData.adviserId?.approved;
      } else {
        const panelRef = doc(db, 'panel', docId);
        const panelSnap = await getDoc(panelRef);

        if (!panelSnap.exists()) {
          throw new Error('Panel document not found');
        }
        return paperData.panelIds?.[docId]?.approved;
      }
    } catch (error) {
      console.error('Error fetching approved status:', error);
      return null;
    }
  },

  getCurrentRoute: () => {
    if (typeof window !== 'undefined') {
      const pathnameParts = window.location.pathname.split('/').filter(Boolean);
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
      const theses = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      set({ theses, loading: false });
      return theses;
    } catch (error) {
      set({ loading: false });
      console.error(error);
    }
  },

  getAdviserPapers: async (adviserId) => {
    try {
      set({ loading: true });
      const route = useThesisStore.getState().getCurrentRoute();

      const thesisRef = collection(db, 'thesisPaper');
      const snapshot = await getDocs(
        query(thesisRef, where('currRoute', '==', route), where('adviser.adviserId', '==', adviserId))
      );
      const theses = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      set({ theses, loading: false });
      return theses;
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  filterPapers: async (college) => {
    set({ loading: true });
    const route = useThesisStore.getState().getCurrentRoute();

    const thesisRef = collection(db, 'thesisPaper');
    const papersSnap = await getDocs(query(thesisRef, where('currRoute', '==', route)));

    const theses = papersSnap.docs
      .filter((doc) => doc.data().college && doc.data().college === college)
      .map((doc) => {
        return { id: doc.id, ...doc.data() };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    set({ theses, loading: false });
    return theses;
  },

  getPanelPapers: async (panelId) => {
    try {
      set({ loading: true });
      const route = useThesisStore.getState().getCurrentRoute();

      if (
        route === '/proposal/route-2' ||
        route === '/final/route-2' ||
        route === '/proposal/route-3' ||
        route === '/final/route-3'
      ) {
        const panelRef = doc(db, 'panel', panelId);
        const panelSnap = await getDoc(panelRef);
        const students = panelSnap.data().students;
        const studentIds = students?.map((student) => student.studentId);

        const thesisRef = collection(db, 'thesisPaper');
        const snapshot = await getDocs(
          query(thesisRef, where('currRoute', '==', route), where('studentId', 'in', studentIds || []))
        );

        const theses = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => b.createdAt - a.createdAt);

        set({ theses, loading: false });
        return theses;
      }

      const thesisRef = collection(db, 'thesisPaper');
      const snapshot = await getDocs(query(thesisRef, where('currRoute', '==', route)));
      const filteredTheses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const matchingTheses = filteredTheses.filter(
        (thesis) =>
          thesis.panelIds && Object.values(thesis.panelIds).some((panel) => panel.panelId === panelId)
      );

      set({ theses: matchingTheses, loading: false });
    } catch (error) {
      console.error('Error fetching panel papers:', error);
      return [];
    } finally {
      set({ loading: false });
    }
  },

  getThesisByStudentAndRoute: async (studentId) => {
    try {
      set({ loading: true });
      const route = useThesisStore.getState().getCurrentRoute();

      if (route === '/proposal/route-2' || route === '/final/route-2') {
        const panelRef = collection(db, 'panel');
        const snapshot = await getDocs(panelRef);
        snapshot.docs.map(async (doc) => {
          const panelData = doc.data();
          if (panelData.studentId === studentId) {
            const thesisRef = collection(db, 'thesisPaper');
            const snapshot = await getDocs(
              query(thesisRef, where('currRoute', '==', route), where('studentId', '==', studentId))
            );

            const theses = snapshot.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              .sort((a, b) => b.createdAt - a.createdAt);

            set({ theses, loading: false });
            return theses;
          }
        });
      }

      const thesisRef = collection(db, 'thesisPaper');
      const snapshot = await getDocs(
        query(thesisRef, where('currRoute', '==', route), where('studentId', '==', studentId))
      );

      const theses = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      set({ theses, loading: false });
      return theses;
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  createThesis: async (thesis) => {
    try {
      set({ loading: true });
      const studentId = thesis.studentId;

      const studentRef = doc(db, 'student', studentId);
      const studentSnap = await getDoc(studentRef);
      const college = studentSnap.data().college.value;

      const thesisWithCollege = { ...thesis, college };
      const thesisRef = await addDoc(collection(db, 'thesisPaper'), thesisWithCollege);

      set((state) => ({
        theses: [{ id: thesisRef.id, ...thesis }, ...state.theses],
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },

  checkExpiryDate: async (paperId, panelId) => {
    try {
      const thesisRef = doc(db, 'thesisPaper', paperId);
      const docSnap = await getDoc(thesisRef);

      if (docSnap.exists()) {
        const panelData = docSnap.data().panelIds?.[panelId];
        if (!panelData?.approved) {
          await updateDoc(thesisRef, {
            [`panelIds.${panelId}.approved`]: true,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  },

  createThesisComment: async (comment, role, docId, paperId, approvedStatus) => {
    try {
      let updateData = {};
      const commentRef = collection(db, role, docId, 'comments');
      const paperRef = doc(db, 'thesisPaper', paperId);

      if (role === 'panel') {
        const panelRef = doc(db, 'panel', docId);
        const docSnap = await getDoc(panelRef);
        updateData[`panelIds.${docId}.panelId`] = docId;
        updateData[`panelIds.${docId}.approved`] = approvedStatus;
      }

      const q = query(commentRef, where('paperId', '==', paperId));
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
      const adviserCollection = collection(db, 'adviser');
      const panelCollection = collection(db, 'panel');

      const adviserSnapshot = await getDocs(adviserCollection);
      const panelSnapshot = await getDocs(panelCollection);

      let matchingPanels = [];
      let matchingAdvisers = [];

      const paperRef = doc(db, 'thesisPaper', paperId);
      const paperSnapshot = await getDoc(paperRef);

      let panelIds = [];
      if (paperSnapshot.exists()) {
        const data = paperSnapshot.data();
        const panelIdsArray = Object.values(data.panelIds || {});
        panelIds = Array.isArray(panelIdsArray) ? data.panelIds : [];
      }

      // Loop through each panel to get comments or approved status
      await Promise.all(
        panelSnapshot.docs.map(async (panelDoc) => {
          const panelId = panelDoc.id;
          const commentsRef = collection(db, 'panel', panelId, 'comments');
          const q = query(commentsRef, where('paperId', '==', paperId));
          const commentsSnapshot = await getDocs(q);

          const panelIdsArray = Object.values(panelIds);

          const panelData = panelDoc.data();
          const panelInfo = panelIdsArray.find((p) => p.panelId === panelId);

          if (!commentsSnapshot.empty) {
            const firstCommentDoc = commentsSnapshot.docs[0];
            matchingPanels.push({
              id: panelId,
              ...panelData,
              approved: panelInfo ? panelInfo.approved : false,
              comment: firstCommentDoc.data().comment,
            });
          } else if (panelInfo && panelInfo.approved) {
            matchingPanels.push({
              id: panelId,
              ...panelData,
              comment: null,
              approved: true,
            });
          }
        })
      );

      // Loop through each adviser to check comments
      await Promise.all(
        adviserSnapshot.docs.map(async (adviserDoc) => {
          const adviserId = adviserDoc.id;
          const commentsRef = collection(db, 'adviser', adviserId, 'comments');
          const q = query(commentsRef, where('paperId', '==', paperId));
          const commentsSnapshot = await getDocs(q);

          if (!commentsSnapshot.empty) {
            const firstCommentDoc = commentsSnapshot.docs[0];
            matchingAdvisers.push({
              id: adviserId,
              ...adviserDoc.data(),
              comment: firstCommentDoc.data().comment,
            });
          }
        })
      );

      // Sort panels by position label
      const sortedPanels = matchingPanels.sort((a, b) => {
        const numA = parseInt(a.position.label.replace(/\D/g, ''), 10);
        const numB = parseInt(b.position.label.replace(/\D/g, ''), 10);
        return numA - numB;
      });

      const allComments = [...sortedPanels, ...matchingAdvisers];
      return allComments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  deletePaper: async (paperId) => {
    try {
      const paperRef = doc(db, 'thesisPaper', paperId);
      await deleteDoc(paperRef);
    } catch (error) {
      console.error('Error deleting paper:', error);
    }
  },

  getThesisStatus: async (paperId) => {
    try {
      const paperRef = doc(db, 'thesisPaper', paperId);
      const paperSnap = await getDoc(paperRef);
      if (paperSnap.exists()) {
        const paperData = paperSnap.data();
        const panelIds = paperData.panelIds || {};

        // Are exactly 4 panels present & all approved?
        const panelValues = Object.values(panelIds);
        const allApproved = panelValues.length > 0 && panelValues.every((p) => p.approved);
        const status =
          allApproved && panelValues.length === 4 ? 'approved' : 'not approved';
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
      return panelsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // UPDATED assignPanelsToPaper with .filter() to remove undefined IDs
  // ─────────────────────────────────────────────────────────────────────────────
  assignPanelsToPaper: async (paperId, panelIds = [], expiry, docId) => {
    try {
      console.log('assignPanelsToPaper called with:', { paperId, panelIds, docId });

      // Filter out any undefined or falsy IDs
      panelIds = panelIds.filter((id) => id);
      console.log('Filtered panelIds =>', panelIds);

      let panelUpdatePromises = [];
      const expiryDate = new Date();
      
			expiryDate.setDate(expiryDate.getDate() + parseInt(expiry, 10));

      let updateData = { expiryDate };

      const paperRef = doc(db, 'thesisPaper', paperId);
      const paperSnap = await getDoc(paperRef);

      if (!paperSnap.exists()) {
        throw new Error('Thesis paper not found for assignment');
      }

      // If docId is provided, do something special (optional logic)
      if (docId) {
        console.log('We are in the docId branch =>', docId);
        const panelRef = doc(db, 'panel', docId);
        const panelSnap = await getDoc(panelRef);

        if (panelSnap.exists()) {
          const label = panelSnap.data().position?.label || 'Panel 1';
          console.log('docId panel label =>', label);

          // Update each panel ID
          panelIds.forEach((panelId) => {
            updateData[`panelIds.${panelId}.panelId`] = panelId;
            updateData[`panelIds.${panelId}.approved`] = false;
          });
        }
      } else {
        console.log('We are in the fallback branch => no docId');
        // Fallback: update each panel ID
        for (const panelId of panelIds) {
          updateData[`panelIds.${panelId}.panelId`] = panelId;
          updateData[`panelIds.${panelId}.approved`] = false;

          // Also add the student to the panel's "students" array
          const panelRef = doc(db, 'panel', panelId);
          panelUpdatePromises.push(
            updateDoc(panelRef, {
              students: arrayUnion({
                studentId: paperSnap.data().studentId,
              }),
            })
          );
        }

        // Remove old panel IDs not in the new list
        const existingPanelIds = paperSnap.data().panelIds || {};
        Object.keys(existingPanelIds).forEach((existingPanelId) => {
          if (!panelIds.includes(existingPanelId)) {
            updateData[`panelIds.${existingPanelId}`] = deleteField();
          }
        });
      }

      // Update the thesisPaper document
      const paperUpdatePromise = updateDoc(paperRef, updateData);

      // Run all updates in parallel
      await Promise.all([...panelUpdatePromises, paperUpdatePromise]);
      console.log('assignPanelsToPaper completed successfully');
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
        const adviserObj = paperData?.adviser;
        const adviserRef = doc(db, 'adviser', adviserObj.adviserId);
        const adviserSnap = await getDoc(adviserRef);

        if (adviserSnap.exists()) {
          const adviserData = adviserSnap.data();
          return adviserData.name || 'Unknown Adviser';
        } else {
          console.warn('Adviser document not found. Returning placeholder.');
          return 'Unknown Adviser';
        }
      } else {
        console.warn('Thesis paper not found. Returning placeholder.');
        return 'Unknown Adviser';
      }
    } catch (error) {
      console.error(error);
      return 'Unknown Adviser';
    }
  },

  fetchAllAdvisers: async () => {
    try {
      const advisersRef = collection(db, 'adviser');
      const advisersSnapshot = await getDocs(advisersRef);
      return advisersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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
        // Fetch adviser name
        const { fetchAdviser } = useThesisStore.getState();
        const adviserName = (await fetchAdviser(paperId)) || 'Unknown Adviser';

        // Fetch student names
        const studentRef = doc(db, 'student', paperData.studentId);
        const studentSnap = await getDoc(studentRef);
        const studentNames = studentSnap.exists() ? studentSnap.data().members : [];
        const leaderName = studentSnap.exists() ? studentSnap.data().name : 'Unknown Leader';

        return { adviserName, allMembers: [leaderName, ...studentNames] };
      } else {
        throw new Error('Thesis paper not found');
      }
    } catch (error) {
      console.error('Error fetching thesis details:', error);
      return { adviserName: 'Unknown Adviser', studentNames: [] };
    }
  },

  getCurrentPaper: async (paperId) => {
    try {
      const paperSnap = await getDoc(doc(db, 'thesisPaper', paperId));
      if (paperSnap.exists()) {
        const paperData = paperSnap.data();
        const studentId = paperData.studentId;

        const studentSnap = await getDoc(doc(db, 'student', studentId));
        if (studentSnap.exists()) {
          const groupNumber = studentSnap.data().groupNumber;
          return { ...paperData, groupNumber };
        }
        return paperData;
      }
    } catch (error) {
      console.error(error);
    }
  },
}));
