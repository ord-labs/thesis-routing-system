'use client'

import { ChevronDown, CircleCheck, Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../modal/Modal";
import { IKImage } from "imagekitio-next";
import Accordion from "../accordion/Accordion";
import { useThesisStore } from "../../stores/useThesisStore";


const StudentFileCard = ({ pdfUrl, paperId }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openCommentIndex, setOpenCommentIndex] = useState(null); 
    const [comments, setComments] = useState([{}]);   

    const { getThesisComment } = useThesisStore((state) => state)

    const thumbnailUrl = `${pdfUrl}/ik-thumbnail.jpg`;
    
    const getFilenameFromUrl = (url) => {
        return url.substring(url.lastIndexOf('/') + 1);
    };

    const toggleMenu = async () => {   
        try {  
            const fetchedComments = await getThesisComment(paperId ); 
            
            setComments(Array.isArray(fetchedComments) ? fetchedComments : []);  
        } catch (error) {  
            console.error("Error fetching comments:",    error);  
            setComments([]);  
        } finally {  
            setIsMenuOpen(true);  
        }  
    };

    const toggleComment = (index) => {
        setOpenCommentIndex(openCommentIndex === index ? null : index);
        
    };
    
    return (
        <div className="w-[90%] bg-white md:w-80 flex flex-col items-center  border shadow-md  rounded-lg ">
          
          <div className="w-full flex justify-end px-2 py-2 bg-gray-700 rounded-t-lg ">
            <Ellipsis size={30} className="text-white cursor-pointer" onClick={e => { e.stopPropagation(); toggleMenu()} }/>
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
                {getFilenameFromUrl(pdfUrl)}
            </p>
        </div>

        <Modal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Details</h2>
                <div className="flex flex-col gap-7 p-3 bg-gray-600 rounded-lg">
                    {comments.map((comment, index) => (
                        <div key={index} className="flex flex-col gap-3">
                            <div className="flex justify-between">
                                <div className="flex gap-2">
                                    <ChevronDown 
                                        className="cursor-pointer" 
                                        onClick={() => toggleComment(index)} 
                                    />
                                    <p>{comment.name}</p>
                                </div>
                                <span className="flex gap-2 items-center">
                                    <CircleCheck size={20} /> Approved
                                </span>
                            </div>
                            <Accordion isCommentOpen={openCommentIndex === index}>
                                <div className="pl-3 border-l-2 rounded-lg text-black border-gray-600 bg-white space-y-2 py-2">
                                    {comment.comment}
                                </div>
                            </Accordion>
                        </div>
                    ))}
                </div>
                <button className="w-full p-2 mt-5 bg-red-700 hover:bg-red-600 rounded-lg">Delete</button>
            </Modal>
    
        </div>
    );
}

export default StudentFileCard;
