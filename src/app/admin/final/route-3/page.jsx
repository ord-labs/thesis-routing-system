'use client';

import AdminFileCard from '../../../../components/card/AdminFileCard';
import { useCallback, useEffect, useState } from 'react';
import { useThesisStore } from '../../../../stores/useThesisStore';
import TRSDropdown from '../../../../components/input/TRSDropdown';

const Page = () => {
	const { theses, loading, getAllThesis, filterPapers } = useThesisStore((state) => state);
	const [selectedCollege, setSelectedCollege] = useState('');

	const getThesisPapers = useCallback(async () => {
		selectedCollege.label === 'Select College' || selectedCollege === '' ? 
		  await getAllThesis() 
		  : 
		  await filterPapers(selectedCollege.label);
	  }, [getAllThesis, filterPapers, selectedCollege]);

	const colleges = [
		{ value: 'Select College', label: 'Select College' },
		{ value: 'CTHM', label: 'CTHM' },
		{ value: 'CTE', label: 'CTE' },
		{ value: 'CAS', label: 'CAS' },
		{ value: 'CCIS', label: 'CCIS' },
		{ value: 'CCJE', label: 'CCJE' },
	];


	useEffect(() => { 
		getThesisPapers();
	}, [getThesisPapers, selectedCollege]);

	return (
		<div className="flex flex-col justify-center md:items-start">
			<TRSDropdown
				options={colleges}
				onSelect={setSelectedCollege}
				innerLabel={'Select College'}
			/>

			{loading ? (
				<div className="flex justify-center w-full items-center h-40">
					<div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
				</div>
			) : (
				<div className="w-full flex flex-wrap gap-10 justify-center md:justify-start">
					{theses.length > 0 ? (
						theses.map((thesis) => (
							<AdminFileCard
								key={thesis.id}
								paperId={thesis.id}
								pdfUrl={thesis.fileUrl}
							/>
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
