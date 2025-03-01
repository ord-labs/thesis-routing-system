'use client';

import { useState, useEffect } from 'react';
import {
	LogOut,
	FileText,
	BookOpen,
	UserPlus,
	User,
	Menu,
	X,
} from 'lucide-react';
import SidebarSection from './SidebarSection';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const sidebarSections = [
	{
		icon: FileText,
		title: 'Title Proposal',
		links: [
			{ name: 'Route 1', href: '/admin/proposal/route-1' },
			{ name: 'Route 2', href: '/admin/proposal/route-2' },
			{ name: 'Route 3', href: '/admin/proposal/route-3' },
			{ name: 'Indorsement Form', href: '/admin/proposal/endorsement' },
		],
	},
	{
		icon: BookOpen,
		title: 'Final',
		links: [
			{ name: 'Route 1', href: '/admin/final/route-1' },
			{ name: 'Route 2', href: '/admin/final/route-2' },
			{ name: 'Route 3', href: '/admin/final/route-3' },
		],
	},
	{
		icon: UserPlus,
		title: 'Register Account',
		links: [
			{ name: 'Adviser', href: '/admin/register/adviser' },
			{ name: 'Panel', href: '/admin/register/panel' },
		],
	},
];

const AdminSidebar = () => {
	const [activeSection, setActiveSection] = useState('Title Proposal');
	const [isOpen, setIsOpen] = useState(false);
	const logoutUser = useAuthStore((state) => state.logoutUser);
	const router = useRouter();

	useEffect(() => {
		const storedSection = Cookies.get('activeSection');
		if (storedSection) setActiveSection(storedSection);
	}, []);

	const handleLogout = async () => {
		await logoutUser();
		router.push('/');
	};

	const handleSectionChange = (title) => {
		setActiveSection(title);
		Cookies.set('activeSection', title);
		setIsOpen(false); // Close sidebar on mobile after selection
	};

	return (
		<>
			{/* Mobile menu button */}
			<button
				className="md:hidden fixed left-4 top-4 z-50 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
				onClick={() => setIsOpen(!isOpen)}
				aria-label="Toggle Sidebar"
			>
				{isOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			{/* Backdrop for mobile */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 md:hidden z-40"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`fixed md:relative w-64 h-screen bg-gray-800 flex flex-col border-r border-gray-700 transform transition-transform duration-200 ease-in-out z-50 ${
					isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
				}`}
			>
				{/* Profile Section */}
				<div className="p-4 border-b border-gray-700">
					<div className="flex items-center space-x-3">
						<div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
							<User size={20} className="text-white" />
						</div>
						<div>
							<p className="text-sm font-medium text-white">El Jay</p>
							<p className="text-xs text-gray-400">Admin</p>
						</div>
					</div>
				</div>

				{/* Navigation Sections */}
				<nav className="flex-1 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
					{sidebarSections.map((section) => (
						<SidebarSection
							key={section.title}
							icon={section.icon}
							title={section.title}
							active={activeSection}
							setActiveSection={handleSectionChange}
							links={section.links}
						/>
					))}
				</nav>

				{/* Logout Button */}
				<button
					type="button"
					className="m-3 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 group"
					onClick={handleLogout}
				>
					<div className="flex items-center justify-center space-x-2">
						<LogOut
							size={18}
							className="text-gray-300 group-hover:text-white"
						/>
						<span className="text-sm text-gray-300 group-hover:text-white">
							Log Out
						</span>
					</div>
				</button>
			</div>
		</>
	);
};

export default AdminSidebar;
