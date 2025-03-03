'use client'

import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import { Settings, Check } from 'lucide-react'; // Import icons
import { useThesisStore } from '../../stores/useThesisStore';
import CertificateOfEndorsement from '../pdf/CertificateOfEndorsement';
import Modal from '../modal/Modal';

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), { ssr: false });
const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), { ssr: false });

const AdminFileCard = ({ pdfUrl, paperId, showDownloadLink }) => {
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [status, setStatus] = useState(null);
    const [adviserName, setAdviserName] = useState('');
    const [studentNames, setStudentNames] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [panels, setPanels] = useState([]);
    const [selectedPanelIds, setSelectedPanelIds] = useState([]);

    const getThesisStatus = useThesisStore((state) => state.getThesisStatus);
    const getThesisDetails = useThesisStore((state) => state.getThesisDetails);
    const getPanels = useThesisStore((state) => state.getPanels);
    const assignPanelsToPaper = useThesisStore((state) => state.assignPanelsToPaper);

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
            setPanels(fetchedPanels);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching panels:', error);
        }
    };

    const handlePanelSelect = (panelId) => {
        setSelectedPanelIds(prev => {
            if (prev.includes(panelId)) {
                return prev.filter(id => id !== panelId);
            }
            return prev.length < 4 ? [...prev, panelId] : prev;
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

            {/* Download Endorsement */}
            {showDownloadLink && status === 'approved' && (
                <div className="w-full p-2 text-center">
                    <PDFDownloadLink
                        document={<CertificateOfEndorsement date={currentDate} adviserName={adviserName} studentNames={studentNames} />}
                        fileName="Certificate_of_Endorsement.pdf"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                    >
                        {({ loading }) => (loading ? "Generating PDF..." : "Download Endorsement")}
                    </PDFDownloadLink>
                </div>
            )}

            {/* Panel Assignment Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="bg-white p-0 rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
                    {/* Modal Header */}
                    <div className="bg-indigo-50 p-6 border-b border-indigo-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Assign Evaluation Panels</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {selectedPanelIds.length}/4 panels selected
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Panel List */}
                    <div className="max-h-[60vh] overflow-y-auto p-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">Available Panels</h3>
                        <div className="grid gap-3">
                            {panels.map(panel => (
                                <div 
                                    key={panel.id}
                                    onClick={() => handlePanelSelect(panel.id)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all
                                        ${selectedPanelIds.includes(panel.id)
                                            ? 'border-indigo-300 bg-indigo-50'
                                            : 'border-gray-200 hover:border-indigo-200'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-gray-800">{panel.name}</h4>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                                            ${selectedPanelIds.includes(panel.id)
                                                ? 'bg-indigo-600 border-indigo-600'
                                                : 'bg-white border-gray-300'}`}>
                                            {selectedPanelIds.includes(panel.id) && (
                                                <Check className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
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