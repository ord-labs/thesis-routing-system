import React, { useState } from 'react';

const TRSDropdown = ({ label, options, onSelect }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState(null);

	const handleSelect = (option) => {
		setSelected(option);
		setIsOpen(false);
		onSelect(option);
	};

	return (
		<div className="flex flex-col mb-4 relative">
			{/* Label */}
			{label && (
				<label className="mb-2 text-sm font-medium text-gray-700">
					{label}
				</label>
			)}
			{/* TRSDropdown Button */}
			<div
				className="p-2 border text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 bg-white text-gray-800 cursor-pointer flex justify-between items-center"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span>{selected ? selected.label : 'Select an option'}</span>
				<svg
					className={`w-5 h-5 transform transition-transform ${
						isOpen ? 'rotate-180' : 'rotate-0'
					}`}
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</div>
			{/* TRSDropdown Options */}
			{isOpen && (
				<ul className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md max-h-60 overflow-auto z-10">
					{options.map((option) => (
						<li
							key={option.value}
							className="p-2 text-sm hover:bg-indigo-500 hover:text-white cursor-pointer"
							onClick={() => handleSelect(option)}
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default TRSDropdown;
