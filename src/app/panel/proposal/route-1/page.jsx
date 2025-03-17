'use client';

import PanelAdFileCard from '../../../../components/card/PanelAdFileCard';
import { useCallback, useEffect, useState } from 'react';
import { useThesisStore } from '../../../../stores/useThesisStore';
import Cookies from 'js-cookie';
const Page = () => {
	const theses = useThesisStore((state) => state.theses);
	const loading = useThesisStore((state) => state.loading);
	const getPanelPapers = useThesisStore((state) => state.getPanelPapers);

	const getThesisPapers = useCallback(async () => {
		await getPanelPapers(Cookies.get('panelId'));
	}, [getPanelPapers]);

	useEffect(() => {
		getThesisPapers();
	}, [getThesisPapers]);

	return (
		<div className="  flex flex-col justify-center md:items-start">
			{loading ? (
				<div className="flex justify-center w-full items-center h-40">
					<div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
				</div>
			) : (
				<div className="w-full flex flex-wrap gap-4 justify-center md:justify-start">
					{theses.length > 0 ? (
						theses.map((thesis) => (
							<PanelAdFileCard
								key={thesis.id}
								role={'panel'}
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
