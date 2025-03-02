'use client'

import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";

import { useThesisStore } from '../../stores/useThesisStore';
import CertificateOfEndorsement from '../pdf/CertificateOfEndorsement';


const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), { ssr: false });
const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), { ssr: false });

const AdminFileCard = ({ pdfUrl, paperId, showDownloadLink }) => {
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [status, setStatus] = useState(null);
    const [adviserName, setAdviserName] = useState('');
    const [studentNames, setStudentNames] = useState([]);
    const getThesisStatus = useThesisStore((state) => state.getThesisStatus);
    const getThesisDetails = useThesisStore((state) => state.getThesisDetails);

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

    const filename = getFilenameFromUrl(pdfUrl);
    const currentDate = new Date().toLocaleDateString();
    console.log('Current date:', currentDate); // Debugging information

    return (
        <div className="w-[90%] md:w-80 flex flex-col items-center border shadow-md rounded-lg">
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
            <div className="flex w-full bg-gray-700 text-white rounded-b-lg">
                <p className="truncate py-6 px-3 ">
                    {filename}
                </p>
            </div>
            <div className="w-full p-2 text-center">
                <span className={`text-sm font-semibold ${status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>
                    {status ? (status === 'approved' ? 'Approved' : 'Not Approved') : 'Status Unknown'}
                </span>
            </div>
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
        </div>
    );
};

export default AdminFileCard;
