'use client'

import { MessageSquare } from "lucide-react";
import { useState } from "react";
import Modal from "../modal/Modal";

const pdfUrl = "https://ik.imagekit.io/zzm6teifoe/Lab_4_-_ESP32_WiFi_and_Web_Servers_y4z-6sYTn.pdf";
const thumbnailUrl = "https://ik.imagekit.io/zzm6teifoe/Lab_4_-_ESP32_WiFi_and_Web_Servers_y4z-6sYTn.pdf/ik-thumbnail.jpg";

const getFilenameFromUrl = (url) => {
    return url.substring(url.lastIndexOf("/") + 1);
};

const PanelAdFileCard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comment, setComment] = useState("");

    // Group/Project info {Placeholder}
    const groupNumber = "Group 1";
    const projectTitle = "Lab 4 - ESP32 WiFi and Web Servers";
    const submittedOn = " 2025-03-01";

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        // Comment posting logic here
        console.log("Submitted comment:", comment);
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

        <a
            href={pdfUrl}
            className="w-full"
            target="_blank"
            rel="noopener noreferrer"
        >
            <img
            src={thumbnailUrl}
            alt="PDF Preview"
            className="h-full w-full"
            onError={(e) =>
                (e.target.src = "https://via.placeholder.com/150")
            }
            />
        </a>

        <div className="flex w-full bg-gray-700 text-white rounded-b-lg">
            <p className="truncate py-6 px-3">{getFilenameFromUrl(pdfUrl)}</p>
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
