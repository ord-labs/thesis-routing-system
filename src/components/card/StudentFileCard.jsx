'use client'

import { CircleCheck, Ellipsis } from "lucide-react";
import { useState } from "react";
import Modal from "../modal/Modal";
import { IKImage } from "imagekitio-next";

const pdfUrl = "https://ik.imagekit.io/zzm6teifoe/Lab_4_-_ESP32_WiFi_and_Web_Servers_y4z-6sYTn.pdf";
const thumbnailUrl = "https://ik.imagekit.io/zzm6teifoe/Lab_4_-_ESP32_WiFi_and_Web_Servers_y4z-6sYTn.pdf/ik-thumbnail.jpg";

const getFilenameFromUrl = (url) => {
    return url.substring(url.lastIndexOf('/') + 1);
};

const StudentFileCard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="w-[90%] md:w-80 flex flex-col items-center  border shadow-md  rounded-lg ">
          
          <div className="w-full flex justify-end px-2 py-2 bg-gray-700 rounded-t-lg ">
            <Ellipsis size={30} className="text-white cursor-pointer" onClick={e => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen)} }/>
          </div>
          <a href={pdfUrl} className=" w-full" target="_blank" rel="noopener noreferrer">
            <img 
              src={thumbnailUrl} 
              alt="PDF Preview" 
              className=" h-full w-full" 
              onError={(e) => e.target.src = "https://via.placeholder.com/150"} 
            />
          </a>

          <div className="flex w-full bg-gray-700 text-white  rounded-b-lg">
            <p className="truncate py-6 px-3 ">
                {getFilenameFromUrl(pdfUrl)}
            </p>
        </div>

        {/* Modal */}
        <Modal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                <h2 className="text-xl font-bold mb-4">Details</h2>
                <div className="flex flex-col gap-7 p-3 bg-gray-600 rounded-lg">
                    <div className="flex justify-between">
                        <p>Kenneth Ian B. Barrera</p>
                        <span className="flex gap-2 items-center"><CircleCheck size={20} /> Approved</span>
                    </div>
                    <div className="flex justify-between">
                        <p>Marlon Juhn M. Timogan</p>
                        <span className="flex gap-2 items-center"><CircleCheck size={20} /> Approved</span>
                    </div>
                    <div className="flex justify-between">
                        <p>Marisol S. Rosario</p>
                        <span className="flex gap-2 items-center"><CircleCheck size={20} /> Approved</span>
                    </div>
                    <div className="flex justify-between">
                        <p>Rea Mie Omas-as</p>
                        <span className="flex gap-2 items-center"><CircleCheck size={20} /> Approved</span>
                    </div>
                </div>
                <button className="w-full p-2 mt-5 bg-red-700 hover:bg-red-600 rounded-lg">Delete</button>
            </Modal>

    
        </div>
    );
}

export default StudentFileCard;
