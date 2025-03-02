'use client'

import { useEffect, useState } from 'react';
import { useThesisStore } from '../../stores/useThesisStore';
import { IKImage } from 'imagekitio-next';

const AdminFileCard = ({ pdfUrl, paperId }) => {
    const [thumbnailUrl, setThumbnailUrl] = useState('');

    useEffect(() => {
        if (pdfUrl) {
            setThumbnailUrl(`${pdfUrl}/ik-thumbnail.jpg`);
        } else {
            setThumbnailUrl(null);
        }
    }, [pdfUrl]);

    const getFilenameFromUrl = (url) => {
        return url.substring(url.lastIndexOf('/') + 1);
    };

    const filename = getFilenameFromUrl(pdfUrl);

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
        </div>
    );
};

export default AdminFileCard;
