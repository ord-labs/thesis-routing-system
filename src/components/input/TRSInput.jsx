import React from 'react';

const TRSInput = ({ label, placeholder, type = 'text', value, onChange }) => {
	return (
		<div className="flex flex-col mb-4">
			{label && (
				<label className="mb-2 text-sm font-medium text-gray-700">
					{label}
				</label>
			)}
			<input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				className="p-2 border text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 bg-white text-gray-800"
			/>
		</div>
	);
};

export default TRSInput;
