import React from 'react';

const TRSButton = ({ label, onClick }) => {
	return (
		<button
			className=" p-2 rounded-lg my-2 text-white bg-gray-700 hover:bg-gray-600"
			onClick={onClick}
		>
			{label}
		</button>
	);
};

export default TRSButton;
