import React from 'react';
import FileCard from '../../../../components/card/FileCard';
import TRSButton from '../../../../components/button/TRSButton';
import { FileUp } from 'lucide-react';

const Page = () => {
	return (
		<div className=' text-white'>
			<div className='ml-12 md:ml-0 mb-4'>
				<TRSButton label={<FileUp />} onClick={console.log('asjkdfnkj')} />
			</div>
			<FileCard/>
		</div>
	);
};

export default Page;
