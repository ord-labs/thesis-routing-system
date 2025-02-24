'use client'

import { FileUp } from 'lucide-react';
import FileCard from '../../../../components/card/FileCard';
import TRSButton from '../../../../components/button/TRSButton';
import SubmitFile from '../../../../components/button/SubmitFile';

const Page = () => {
	return (
		<div className='  flex flex-col justify-center md:items-start'>
			<div className=' md:ml-0 mb-4 ml-12 '>
				<SubmitFile/>
			</div>
			<div className='w-full flex justify-center md:justify-start'>
				<FileCard/>
			</div>
		</div>
	);
};

export default Page;
