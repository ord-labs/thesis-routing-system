const Modal = ({ isOpen, onClose, children, className = '' }) => {
    if (!isOpen) return null; 

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
            <div 
                className={`
                    bg-gray-800 text-white 
                    p-6 rounded-xl shadow-lg 
                    w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] 
                    max-w-4xl mx-auto 
                    h-[80vh] max-h-[90vh]
                    relative 
                    ${className}
                `} 
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;
