import React from 'react';

const TRSButton = ({ label, onClick }) => {
	return (
		<button
			className="bg-smccprimary p-2 rounded-lg my-2 text-white hover:bg-blue-700"
			onClick={onClick}
		>
			{label}
		</button>
	);
};

export default TRSButton;
