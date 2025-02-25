'use client'

import { FileUp } from 'lucide-react';
import PanelAdFileCard from '../../../../components/card/PanelAdFileCard';

const Page = () => {
	return (
		<div className='  flex flex-col justify-center md:items-start'>
			<div className='w-full flex justify-center md:justify-start'>
				<PanelAdFileCard/>
			</div>
		</div>
	);
};

export default Page;
