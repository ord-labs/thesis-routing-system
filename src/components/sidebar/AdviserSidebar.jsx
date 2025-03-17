'use client';

import { useEffect, useState } from 'react';
import {
	LogOut,
	LayoutDashboard,
	BookOpen,
	UserPlus,
	FileText,
	User,
	Settings,
	Menu,
	X,
} from 'lucide-react';
import SidebarSection from './SidebarSection';
import { useSidebarStore } from '../../stores/useSidebarStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import SMCCLogo from '../../../public/smcc-logo-2.png';
import Image from 'next/image';

const AdviserSidebar = () => {
	const [activeSection, setActiveSection] = useState('Title Proposal');
	const [isOpen, setIsOpen] = useState(false);
	const [userDetails, setUserDetails] = useState({
		name: '',
		role: '',
	});
	const router = useRouter();

	const { getUserDetails } = useSidebarStore((state) => state);
	const { logoutUser } = useAuthStore((state) => state);

	useEffect(() => {
		const getUser = async () => {
			const role = Cookies.get('role');
			const adviserId = Cookies.get('adviserId');

			const currentUser = await getUserDetails(role, adviserId);
			setUserDetails({
				name: currentUser.name,
				role: role,
			});
		};
		getUser();
	}, []);

	const handleLogout = async () => {
		await logoutUser();
		router.push('/');
	};

	return (
		<>
			{/* Mobile menu button */}
			<button
				className="md:hidden fixed left-4 top-4 z-50 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
				onClick={() => setIsOpen(!isOpen)}
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
							<p className="text-sm font-medium text-white">
								{userDetails.name}
							</p>
							<p className="text-xs text-gray-400">{userDetails.role}</p>
						</div>
					</div>
				</div>

				{/* Navigation Sections */}
				<nav className="flex-1 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
					<SidebarSection
						icon={FileText}
						title="Title Proposal"
						active={activeSection}
						setActiveSection={setActiveSection}
						links={[
							{ name: 'Route 1', href: '/adviser/proposal/route-1' },
							{ name: 'Route 2', href: '/adviser/proposal/route-2' },
							{ name: 'Route 3', href: '/adviser/proposal/route-3' },
						]}
						onLinkClick={() => setIsOpen(false)}
					/>

					<SidebarSection
						icon={BookOpen}
						title="Final"
						active={activeSection}
						setActiveSection={setActiveSection}
						links={[
							{ name: 'Route 1', href: '/adviser/final/route-1' },
							{ name: 'Route 2', href: '/adviser/final/route-2' },
							{ name: 'Route 3', href: '/adviser/final/route-3' },
						]}
						onLinkClick={() => setIsOpen(false)}
					/>
				</nav>
				<div className="flex justify-center gap-x-3">
					<Image src={SMCCLogo} alt="SMCC Logo" className="w-12 h-12" />
					<div className="flex flex-col items-start justify-center">
						<p className="text-center text-white font-semibold text-sm">
							Thesis Routing System
						</p>
						<p className="text-center text-white text-xs">
							St. Michael's College of Caraga
						</p>
					</div>
				</div>
				{/* Logout Button */}
				<button
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

export default AdviserSidebar;
