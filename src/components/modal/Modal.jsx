import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; 

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-gray-800 text-white p-6 rounded-xl shadow-lg w-96 relative" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={onClose}>
                    <X size={20} />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
