import React from 'react';
import TopMenu from '../../../../components/menu/TopMenu';
import { FileUp } from 'lucide-react';

const Page = () => {
	const menuItems = [
		{ label: "Submit File", icon: <FileUp size={25} /> },
		{ label: "Panel" },
		{ label: "Adviser" },
	  ];
	
	return (
		<div>
			<TopMenu menuItems={menuItems} />
		</div>
	);
};

export default Page;
