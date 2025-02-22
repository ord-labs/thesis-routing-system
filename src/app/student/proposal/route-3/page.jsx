import React from 'react';
import TopMenu from '../../../../components/menu/TopMenu';
import { studentContent } from '../../../../content/student/studentContent';

const Page = () => {
	return (
		<div>
			<TopMenu menuItems={studentContent.menuItems} />
		</div>
	);
};

export default Page;
