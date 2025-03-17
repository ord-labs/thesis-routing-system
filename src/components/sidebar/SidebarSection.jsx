'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const SidebarSection = ({ title, active, setActiveSection, links, icon }) => {
	const isActive = active === title;
	const Icon = icon;

	return (
		<div className="mb-1">
			<button
				onClick={() => setActiveSection(isActive ? null : title)}
				className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
					isActive
						? 'bg-indigo-100 text-smccprimary'
						: 'hover:bg-indigo-200 text-gray-500'
				}`}
			>
				<div className="flex items-center space-x-3">
					<Icon size={18} className="flex-shrink-0" />
					<span className="text-sm font-medium">{title}</span>
				</div>
				<ChevronDown
					size={18}
					className={`transform transition-transform duration-300 ${
						isActive ? 'rotate-180' : 'rotate-0'
					}`}
				/>
			</button>

			<div
				className={`overflow-hidden transition-all duration-300 ${
					isActive ? 'max-h-96' : 'max-h-0'
				}`}
			>
				<div className="ml-8 pl-3 border-l border-gray-300 space-y-2 py-2">
					{links.map((link, index) =>
						typeof link === 'string' ? (
							<a
								key={index}
								href="#"
								className="block px-3 py-2 text-sm rounded-lg hover:bg-indigo-200 transition-colors duration-200 text-gray-500 hover:text-gray-600"
							>
								{link}
							</a>
						) : (
							<Link
								key={index}
								href={link.href}
								className="block px-3 py-2 text-sm rounded-lg hover:bg-indigo-200 transition-colors duration-200 text-gray-500 hover:text-gray-600"
							>
								{link.name}
							</Link>
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default SidebarSection;
