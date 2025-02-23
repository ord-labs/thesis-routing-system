import { FileUp } from 'lucide-react';
import FileCard from '../../../../components/card/FileCard';
import StudentTopMenu from '../../../../components/menu/StudentTopMenu';

const Page = () => {
	return (
		<div className='flex flex-col gap-4 text-white'>
			<StudentTopMenu />
			<FileCard/>
		</div>
	);
};

export default Page;
