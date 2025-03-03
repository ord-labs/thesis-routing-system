'use client';

import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import { Settings, Check } from 'lucide-react'; // Import icons
import { useThesisStore } from '../../stores/useThesisStore';
import CertificateOfEndorsement from '../pdf/CertificateOfEndorsement';
import Modal from '../modal/Modal';
import downloadPDF from './pdfDownloader';

const AdminFileCard = ({ pdfUrl, paperId, showDownloadLink }) => {
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [status, setStatus] = useState(null);
    const [adviserName, setAdviserName] = useState('');
    const [studentNames, setStudentNames] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [panels, setPanels] = useState([]);
    const [selectedPanelIds, setSelectedPanelIds] = useState([]);

    const { getThesisStatus, getThesisDetails, getPanels, assignPanelsToPaper, fetchPanelsAssigned } = useThesisStore((state) => state);
    
    const fetchAssignedPanels = async () => {
        try {
            const assignedPanels = await fetchPanelsAssigned(paperId);
            setSelectedPanelIds(assignedPanels);
            console.log(assignedPanels);
        } catch (error) {
            console.error('Error fetching assigned panels:', error);
        }
    };

    useEffect(() => {
        if (pdfUrl) {
            setThumbnailUrl(`${pdfUrl}/ik-thumbnail.jpg`);
        } else {
            setThumbnailUrl(null);
        }
    }, [pdfUrl]);

    useEffect(() => {
        const fetchStatus = async () => {
            const status = await getThesisStatus(paperId);
            console.log('Fetched status:', status); // Debugging information
            setStatus(status);
        };
        fetchStatus();
    }, [getThesisStatus, paperId]);

    useEffect(() => {
        const fetchDetails = async () => {
            const details = await getThesisDetails(paperId);
            console.log('Fetched details:', details); // Debugging information
            setAdviserName(details.adviserName);
            setStudentNames(details.studentNames || []);
        };
        fetchDetails();
    }, [getThesisDetails, paperId]);

    const getFilenameFromUrl = (url) => {
        return url.substring(url.lastIndexOf('/') + 1);
    };

    const openPanelModal = async () => {
        try {
            const fetchedPanels = await getPanels();
            const assignedPanels = await fetchPanelsAssigned(paperId);
            
            // Ensure assignedPanels is an array
            const panelIds = Array.isArray(assignedPanels) 
                ? assignedPanels 
                : (assignedPanels ? [assignedPanels] : []);
            
            setSelectedPanelIds(panelIds);
            console.log('Assigned panels:', panelIds);
            setPanels(fetchedPanels || []);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching panels:', error);
            setPanels([]);
            setSelectedPanelIds([]);
        }
    };

    const handlePanelSelect = (panelId) => {
        setSelectedPanelIds(prev => {
            // Ensure prev is an array
            const currentSelection = Array.isArray(prev) ? prev : [];
            
            if (currentSelection.includes(panelId)) {
                return currentSelection.filter(id => id !== panelId);
            }
            return currentSelection.length < 4 ? [...currentSelection, panelId] : currentSelection;
        });
    };

    const handlePanelAssignment = async () => {
        if (selectedPanelIds.length > 0) {
            try {
                await assignPanelsToPaper(paperId, selectedPanelIds);
                setIsModalOpen(false);
                setSelectedPanelIds([]); // Reset selection after assignment
            } catch (error) {
                console.error('Error assigning panels:', error);
            }
        }
    };

    const filename = getFilenameFromUrl(pdfUrl);
    const currentDate = new Date().toLocaleDateString();
    console.log('Current date:', currentDate); // Debugging information

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
            <a href={pdfUrl} className="w-full flex items-center h-full" target="_blank" rel="noopener noreferrer">
                {thumbnailUrl ? (
                    <img 
                        src={thumbnailUrl} 
                        alt="PDF Preview" 
                        className="w-full" 
                        onError={(e) => e.target.src = "https://via.placeholder.com/150"} 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span>No Preview Available</span>
                    </div>
                )}
            </a>

            {/* Filename */}
            <div className="flex w-full bg-gray-700 text-white rounded-b-lg">
                <p className="truncate py-6 px-3">
                    {filename}
                </p>
            </div>

            {/* Status */}
            <div className="w-full p-2 text-center">
                <span className={`text-sm font-semibold ${status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>
                    {status ? (status === 'approved' ? 'Approved' : 'Not Approved') : 'Status Unknown'}
                </span>
            </div>

            {status === 'approved' && showDownloadLink && (
                <div className="w-full p-2 text-center">
                    <button 
                        onClick={() => downloadPDF({
                            date: new Date().toLocaleDateString(),
                            adviserName,
                            studentNames
                        })}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                    >
                        Download Endorsement
                    </button>
                </div>
            )}

            {/* Panel Assignment Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Assign Evaluation Panels</h2>
                                <p className="text-sm text-indigo-100 mt-1">
                                    Select up to 4 panels for this thesis paper
                                </p>
                            </div>
                            <div className="bg-white/20 text-white px-3 py-1 rounded-full">
                                {selectedPanelIds.length}/4 selected
                            </div>
                        </div>
                    </div>

                    {/* Panel List */}
                    <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {panels.map(panel => (
                                <div 
                                    key={panel.id}
                                    onClick={() => handlePanelSelect(panel.id)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105
                                        ${(selectedPanelIds || []).includes(panel.id)
                                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className={`font-semibold ${(selectedPanelIds || []).includes(panel.id) ? 'text-indigo-700' : 'text-gray-800'}`}>
                                                {panel.name}
                                            </h4>
                                            {panel.department && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {panel.department}
                                                </p>
                                            )}
                                        </div>
                                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all
                                            ${(selectedPanelIds || []).includes(panel.id)
                                                ? 'bg-indigo-600 border-indigo-600'
                                                : 'bg-white border-gray-300'}`}>
                                            {(selectedPanelIds || []).includes(panel.id) && (
                                                <Check className="w-5 h-5 text-white" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="bg-gray-50 p-6 flex justify-end space-x-4">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handlePanelAssignment}
                            disabled={selectedPanelIds.length === 0}
                            className={`px-6 py-2 rounded-lg text-white transition-all duration-300 
                                ${selectedPanelIds.length > 0 
                                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md' 
                                    : 'bg-gray-400 cursor-not-allowed'}`}
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