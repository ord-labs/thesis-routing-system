'use client'

import { CircleCheck, Ellipsis } from "lucide-react"
import { useState } from "react";
import Modal from "../modal/Modal";

const FileCard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="bg-gray-700 w-64 px-4 py-2 h-36 text-center items-center cursor-pointer justify-center rounded-2xl flex flex-col overflow-y-auto">
            <div className="flex justify-end w-full">
                <Ellipsis className=" cursor-pointer" onClick={e => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen)} }/>
            </div>
            <p className="flex-grow flex mt-[12%] justify-center">
                Chapter 1 - 3 Group 2.1mb 
            </p>

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
    )
}

export default FileCard