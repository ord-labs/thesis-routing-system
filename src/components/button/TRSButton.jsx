import React from 'react';

const TRSButton = ({ label, onClick }) => {
	return (
		<button
			className="p-2 rounded-lg my-2 text-white text-sm bg-smccprimary hover:bg-blue-700"
			onClick={onClick}
		>
			{label}
		</button>
	);
};

export default TRSButton;
