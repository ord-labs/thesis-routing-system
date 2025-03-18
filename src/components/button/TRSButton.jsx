import React from 'react';

const TRSButton = ({ label, onClick, disabled = false }) => {
	return (
		<button
			disabled={disabled}
			className={`p-2 rounded-lg my-2 text-white text-sm ${
				disabled ? 'bg-gray-500' : 'bg-smccprimary hover:bg-blue-700'
			} `}
			onClick={onClick}
		>
			{label}
		</button>
	);
};

export default TRSButton;
