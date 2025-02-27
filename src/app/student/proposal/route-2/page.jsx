'use client'

import { FileUp } from 'lucide-react';
import StudentFileCard from '../../../../components/card/StudentFileCard';
import TRSButton from '../../../../components/button/TRSButton';
import SubmitFile from '../../../../components/button/SubmitFile';
import { useCallback, useEffect, useState } from 'react';
import { useThesisStore } from '../../../../stores/useThesisStore';

const Page = () => {
    const { theses, loading, getThesisByStudentAndRoute } = useThesisStore((state) => state);
	
    const getThesisPapers = useCallback(async () => {
		await getThesisByStudentAndRoute('studentId123')
    }, [getThesisByStudentAndRoute]);

    useEffect(() => {
        getThesisPapers();
    }, [getThesisPapers]); 

	return (
		<div className='  flex flex-col justify-center md:items-start'>
			<div className=' md:ml-0 mb-4 ml-12 '>
				<SubmitFile/>
			</div>
			{loading ? (
                <div className="flex justify-center w-full items-center h-40">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="w-full flex flex-wrap gap-20 justify-center md:justify-start">
                    {theses.length > 0 ? (
                        theses.map((thesis, index) => (
                            <StudentFileCard key={index} paperId={thesis.id} pdfUrl={thesis.fileUrl} />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No thesis papers found.</p>
                    )}
                </div>
            )}
		</div>
	);
};

export default Page;
