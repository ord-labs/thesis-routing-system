'use client'

import { MessageSquare, FileText } from "lucide-react";
import { useState } from "react";
import Modal from "../modal/Modal";
import { useThesisStore } from "../../stores/useThesisStore";
import { commentModel } from "../../models/commentModel";
import { IKImage } from "imagekitio-next";
import Cookies from 'js-cookie';

const PanelAdFileCard = ({ pdfUrl, paperId, role }) => {
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const [comment, setComment] = useState("");
    const [allComments, setAllComments] = useState([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isApproved, setIsApproved] = useState(false);

    const thumbnailUrl = `${pdfUrl}/ik-thumbnail.jpg`;
    
    const handleOpenFullComment = (commentItem) => {
        setSelectedComment(commentItem);
    };

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
    const updateApproveStatus = useThesisStore((state) => state.updateApproveStatus);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const result = await createThesisComment(
                commentModel(
                    paperId,
                    comment
                ), role, Cookies.get(`${role}Id`), paperId, isApproved
            );
            setComment("");
            setIsCommentsModalOpen(false);
            setSuccessMessage("Comment submitted successfully!");
            // Auto-dismiss the success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (error) {
            console.error("Error creating comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getThesisComment = useThesisStore((state) => state.getThesisComment);
    
    const handleFetchComments = async () => {
        setIsCommentsModalOpen(true);
        setIsLoadingComments(true);
        setAllComments([]);

        try {
            const comments = await getThesisComment(paperId);
            setAllComments(comments);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleApproveStatus = () => {
        setIsApproved(!isApproved);
        updateApproveStatus(Cookies.get('role'), Cookies.get('panelId'), paperId, !isApproved);
    }

    return (
        <div className="w-[90%] md:w-80 flex flex-col items-center border shadow-md rounded-lg">
            <div className="w-full flex justify-end p-2 bg-gray-700 rounded-t-lg">
                <MessageSquare
                    size={30}
                    className="text-white cursor-pointer mx-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleFetchComments();
                    }}
                />
            </div>

            {/* Toast Notification */}
            {successMessage && (
                <div 
                    className={`
                        fixed bottom-4 right-4 z-50 
                        bg-green-500 text-white 
                        px-6 py-3 rounded-lg shadow-lg 
                        transition-all duration-1000 ease-in-out
                        transform ${successMessage ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
                    `}
                >
                    {successMessage}
                </div>
            )}

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
            <Modal isOpen={isCommentsModalOpen} onClose={() => {
                setIsCommentsModalOpen(false);
                setIsLoadingComments(false);
                setAllComments([]);
            }}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold mb-4">Thesis Comments</h2>
                    
                    <button className=" py-2 px-3 mt-5 bg-green-700 hover:bg-green-600 rounded-lg" onClick={handleApproveStatus}>{isApproved? "Paper Approved" : "Approve Paper"}</button>
                </div>
                
                {isLoadingComments ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-4">

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

                        {/* Comments Section */}
                        {!isLoadingComments && (
                            <div className="space-y-4">
                                {allComments.map((commentItem, index) => (
                                    <div 
                                        key={index} 
                                        className="p-3 border rounded-lg cursor-pointer"
                                        onClick={() => handleOpenFullComment(commentItem)}
                                    >
                                        <p className="font-bold">
                                            {commentItem.position?.label || commentItem.name}
                                        </p>
                                        <p className="break-words line-clamp-3">
                                            {commentItem.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Full Comment Modal */}
                        {selectedComment && (
                            <Modal 
                                isOpen={!!selectedComment} 
                                onClose={() => setSelectedComment(null)}
                                className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-4xl mx-auto"
                            >
                                <div className="flex flex-col h-[70vh] max-h-[70vh]">
                                    <h3 className="text-lg font-bold mb-4 py-2 border-b border-gray-700">
                                        <span className="font-semibold">
                                            {selectedComment.position?.label || selectedComment.name}
                                        </span>
                                    </h3>
                                    <div className="flex-grow overflow-y-auto px-2 py-4">
                                        <p className="whitespace-pre-wrap break-words text-base leading-relaxed">
                                            {selectedComment.comment}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-2 border-t border-gray-700">
                                        <button 
                                            onClick={() => setSelectedComment(null)}
                                            className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300 ease-in-out"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                                
                            </Modal>
                        )}

                        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3 absolute bottom-0 left-0 right-0 p-6 bg-gray-800 rounded-b-xl">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write your comment here..."
                                className="p-2 border rounded-lg bg-white text-black"
                                rows={5}
                                required
                            />
                            <div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full p-2 mt-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                    <>
                                        <svg
                                        className="animate-spin h-5 w-5 mr-2 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        ></path>
                                        </svg>
                                        Submitting...
                                    </>
                                    ) : (
                                    'Submit'
                                    )}
                                </button>
                            </div>
                        </form>
                        
                    </div>
                )}
                
            </Modal>
        </div>
    );
};

export default PanelAdFileCard;
