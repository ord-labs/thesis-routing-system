'use client'

import { MessageSquare } from "lucide-react";
import { useState } from "react";
import Modal from "../modal/Modal";
import { useThesisStore } from "../../stores/useThesisStore";
import { commentModel } from "../../models/commentModel";
import { IKImage } from "imagekitio-next";

const PanelAdFileCard = ({ pdfUrl, paperId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comment, setComment] = useState("");

    const thumbnailUrl = `${pdfUrl}/ik-thumbnail.jpg`;
    
    const getFilenameFromUrl = (url) => {
        return url.substring(url.lastIndexOf('/') + 1);
    };

    const extractInfoFromFilename = (filename) => {
        // Remove file extension
        const filenameWithoutExt = filename.replace(/\.[^/.]+$/, '');
        
        // Split the filename by underscores or hyphens
        const parts = filenameWithoutExt.split(/[_-]/);
        
        // Default values
        let groupNumber = 'Unknown Group';
        let projectTitle = 'Untitled Project';
        let submittedOn = new Date().toISOString().split('T')[0];

        // Extracting Info
        if (parts.length >= 3) {
            // Assume format like: Group1_ProjectTitle_Date
            // Group1_ESP32_WiFi_Servers_2025-03-01.pdf
            groupNumber = parts[0];
            projectTitle = parts.slice(1, -1).join(' ');
            
            // Try to parse the last part as a date
            const potentialDate = parts[parts.length - 1];
            if (/^\d{4}-\d{2}-\d{2}$/.test(potentialDate)) {
                submittedOn = potentialDate;
            }
        }

        return { groupNumber, projectTitle, submittedOn };
    };

    const filename = getFilenameFromUrl(pdfUrl);
    const { groupNumber, projectTitle, submittedOn } = extractInfoFromFilename(filename);

    const createThesisComment = useThesisStore((state) => state.createThesisComment);
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        await createThesisComment(
            commentModel(
                paperId,
                comment
            ), 'panel', localStorage.getItem('panelId'), paperId)
        setComment("");
        setIsModalOpen(false);
    };

    return (
        <div className="w-[90%] md:w-80 flex flex-col items-center border shadow-md rounded-lg">
            <div className="w-full flex justify-end p-2 bg-gray-700 rounded-t-lg">
                <MessageSquare
                size={30}
                className="text-white cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                }}
                />
            </div>

            <a href={pdfUrl} className=" w-full flex items-center h-full" target="_blank" rel="noopener noreferrer">
                <img 
                src={thumbnailUrl} 
                alt="PDF Preview" 
                className="  w-full" 
                onError={(e) => e.target.src = "https://via.placeholder.com/150"} 
                />
            </a>

            <div className="flex w-full bg-gray-700 text-white  rounded-b-lg">
                <p className="truncate py-6 px-3 ">
                    {filename}
                </p>
            </div>

            {/* Modal for posting comments */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Post a Comment</h2>
                
                {/* Displaying Group & Project Info */}
                <div className="mb-4 p-3 rounded">
                    <p>
                        <span className="font-bold">Group Number:</span> {groupNumber}
                    </p>
                    <p>
                        <span className="font-bold">Project Title:</span> {projectTitle}
                    </p>
                    <p>
                        <span className="font-bold">Submitted On:</span> {submittedOn}
                    </p>
                </div>
                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your comment here..."
                        className="p-2 border rounded-lg bg-white text-black"
                        rows={5}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full p-2 mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    >
                        Submit
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default PanelAdFileCard;
