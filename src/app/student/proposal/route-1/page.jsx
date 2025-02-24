'use client'

import { FileUp } from 'lucide-react';
import FileCard from '../../../../components/card/FileCard';
import TRSButton from '../../../../components/button/TRSButton';
import SubmitFile from '../../../../components/button/SubmitFile';

const Page = () => {
	return (
		<div className=' text-white'>
			<div className='ml-12 md:ml-0 mb-4'>
				<SubmitFile/>
			</div>
			<FileCard/>
		</div>
	);
};

export default Page;
