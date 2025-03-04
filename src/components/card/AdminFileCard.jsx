'use client';

import { useEffect, useState } from 'react';
import { Settings, Check } from 'lucide-react';
import { useThesisStore } from '../../stores/useThesisStore';
import Modal from '../modal/Modal';
import downloadPDF from './pdfDownloader';

// Optional: If you're using the CertificateOfEndorsement, uncomment this import
// import CertificateOfEndorsement from '../pdf/CertificateOfEndorsement';

const AdminFileCard = ({ pdfUrl, paperId, showDownloadLink }) => {
const [thumbnailUrl, setThumbnailUrl] = useState('');
const [status, setStatus] = useState(null);
const [adviserName, setAdviserName] = useState('');
const [studentNames, setStudentNames] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);

// List of all panels from Firestore
const [panels, setPanels] = useState([]);

// IDs of the panels the user selects in the modal
const [selectedPanelIds, setSelectedPanelIds] = useState([]);

// Full objects for panels already assigned (fetched from the DB)
const [assignedPanels, setAssignedPanels] = useState([]);

// Pull the store methods we need
const {
    getThesisStatus,
    getThesisDetails,
    getPanels,
    assignPanelsToPaper,
    fetchPanelsAssigned,
} = useThesisStore((state) => state);

// Set up the thumbnail URL if pdfUrl changes
useEffect(() => {
    if (pdfUrl) {
    setThumbnailUrl(`${pdfUrl}/ik-thumbnail.jpg`);
    } else {
    setThumbnailUrl(null);
    }
}, [pdfUrl]);

// Fetch the approval status for this paper
useEffect(() => {
    const fetchStatus = async () => {
    const statusData = await getThesisStatus(paperId);
    console.log('Fetched status:', statusData);
    setStatus(statusData);
    };
    fetchStatus();
}, [getThesisStatus, paperId]);

// Fetch adviser and student names for this paper
useEffect(() => {
    const fetchDetails = async () => {
    const details = await getThesisDetails(paperId);
    console.log('Fetched details:', details);
    setAdviserName(details.adviserName);
    setStudentNames(details.studentNames || []);
    };
    fetchDetails();
}, [getThesisDetails, paperId]);

// Helper to extract filename from the PDF URL
const getFilenameFromUrl = (url) => {
    return url.substring(url.lastIndexOf('/') + 1);
};
const filename = getFilenameFromUrl(pdfUrl);

// ─────────────────────────────────────────────────────────────────────────────
// OPEN THE MODAL AND FETCH PANELS + ASSIGNED PANELS
// ─────────────────────────────────────────────────────────────────────────────
const openPanelModal = async () => {
    try {
    // Fetch all panels from Firestore
    const fetchedPanels = await getPanels();

    // Fetch assigned panels from Firestore: returns array of objects
    // e.g. [ { panelId: "docId1", approved: false }, { panelId: "docId2", approved: true } ]
    let assignedPanelData = await fetchPanelsAssigned(paperId);
    if (!Array.isArray(assignedPanelData)) {
        assignedPanelData = Object.values(assignedPanelData || {});
    }

    // Convert those objects into a list of panel IDs for easy "selection" toggling
    const assignedPanelIds = assignedPanelData.map((obj) => obj.panelId);

    // Update local states
    setPanels(fetchedPanels);
    setAssignedPanels(assignedPanelData); // full objects
    setSelectedPanelIds(assignedPanelIds); // just the IDs

    // Open the modal
    setIsModalOpen(true);
    } catch (error) {
    console.error('Error fetching panels:', error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// HANDLE PANEL SELECTION (LIMIT 4)
// ─────────────────────────────────────────────────────────────────────────────
const handlePanelSelect = (panelId) => {
    setSelectedPanelIds((prev) => {
    if (prev.includes(panelId)) {
        // If already selected, unselect
        return prev.filter((id) => id !== panelId);
    }
    // Otherwise, select if under the limit of 4
    return prev.length < 4 ? [...prev, panelId] : prev;
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// ASSIGN SELECTED PANELS TO THE PAPER, THEN REFRESH THE ASSIGNMENT LIST
// ─────────────────────────────────────────────────────────────────────────────
const handlePanelAssignment = async () => {
    if (selectedPanelIds.length > 0) {
    try {
        // Assign the selected panels in Firestore
        await assignPanelsToPaper(paperId, selectedPanelIds);

        // Close the modal
        setIsModalOpen(false);

        // Fetch the updated assignments so the UI knows which are assigned
        const updatedPanelAssignments = await fetchPanelsAssigned(paperId) || [];
        setAssignedPanels(updatedPanelAssignments);
    } catch (error) {
        console.error('Error assigning panels:', error);
    }
    }
};

// Current date if needed for debugging or PDF
const currentDate = new Date().toLocaleDateString();
console.log('Current date:', currentDate);

    return (
        <div className="w-[90%] md:w-80 flex flex-col items-center border shadow-md rounded-lg relative group">
            {/* Settings icon for panel assignment */}
            <button
                onClick={openPanelModal}
                className="absolute top-2 right-2 p-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm hover:bg-indigo-50 transition-all"
                title="Assign Panel"
            >
                <Settings className="w-5 h-5 text-gray-500 hover:text-indigo-600 transition-colors" />
            </button>

            {/* PDF Thumbnail */}
            <a
                href={pdfUrl}
                className="w-full flex items-center h-full"
                target="_blank"
                rel="noopener noreferrer"
            >
                {thumbnailUrl ? (
                <img
                    src={thumbnailUrl}
                    alt="PDF Preview"
                    className="w-full"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                />
                ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span>No Preview Available</span>
                </div>
                )}
            </a>

            {/* Filename */}
            <div className="flex w-full bg-gray-700 text-white rounded-b-lg">
                <p className="truncate py-6 px-3">{filename}</p>
            </div>

            {/* Status */}
            <div className="w-full p-2 text-center">
                <span
                className={`text-sm font-semibold ${
                    status === 'approved' ? 'text-green-500' : 'text-red-500'
                }`}
                >
                {status
                    ? status === 'approved'
                    ? 'Approved'
                    : 'Not Approved'
                    : 'Status Unknown'}
                </span>
            </div>

            {/* Download Button (If Approved) */}
            {status === 'approved' && showDownloadLink && (
                <div className="w-full p-2 text-center">
                    <button
                        onClick={() =>
                        downloadPDF({
                            date: new Date().toLocaleDateString(),
                            adviserName,
                            studentNames,
                        })
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                    >
                        Download Endorsement
                    </button>
                </div>
            )}

            {/* Panel Assignment Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="bg-white p-0 rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
                {/* Modal Header */}
                <div className="bg-indigo-50 p-6 border-b border-indigo-100">
                    <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                        Assign Evaluation Panels
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                        {selectedPanelIds.length}/4 panels selected
                        </p>
                    </div>
                    </div>
                </div>

                {/* Panel List */}
                <div className="max-h-[60vh] overflow-y-auto p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                        Available Panels
                    </h3>
                        <div className="grid gap-3">
                            {panels.map((panel) => {
                                // Check if user has toggled this panel
                                const isSelected =
                                Array.isArray(selectedPanelIds) &&
                                selectedPanelIds.includes(panel.id);

                                
                                // Check if this panel is already assigned in DB
                                // assignedPanels is an array of objects: [{ panelId, approved }, ...]
                                const assignedPanelsArray = Array.isArray(assignedPanels)
                                    ? assignedPanels
                                    : Object.values(assignedPanels || {});

                                const isAssigned = assignedPanelsArray.some(
                                    (assignedObj) => assignedObj.panelId === panel.id
                                );

                                return (
                                    <div
                                        key={panel.id}
                                        onClick={() => {
                                        // Toggle selection
                                        handlePanelSelect(panel.id);
                                        }}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all
                                        ${
                                            isAssigned
                                            ? 'border-green-500 bg-green-50'
                                            : isSelected
                                            ? 'border-indigo-300 bg-indigo-50'
                                            : 'border-gray-200 hover:border-indigo-200'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-gray-800">
                                                {panel.name}
                                            </h4>
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                                ${
                                                isSelected
                                                    ? 'bg-indigo-600 border-indigo-600'
                                                    : 'bg-white border-gray-300'
                                                }`}
                                            >
                                                {isSelected && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                        </div>
                                        {isAssigned && (
                                            <span className="text-xs text-green-600 font-semibold mt-2 block">
                                                Assigned
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                        <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-5 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={handlePanelAssignment}
                        disabled={selectedPanelIds.length === 0}
                        className="px-5 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                        Assign Panels
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminFileCard;
