'use client';

import { useEffect, useState } from 'react';
import {
  LogOut,
  LayoutDashboard,
  BookOpen,
  UserPlus,
  FileText,
  User,
  Menu,
  X,
} from 'lucide-react';
import SidebarSection from './SidebarSection';
import { useSidebarStore } from '../../stores/useSidebarStore';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/useAuthStore';
import Cookies from 'js-cookie';
import SMCCLogo from '../../../public/smcc-logo-2.png';
import Image from 'next/image';

const StudentSidebar = () => {
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
      try {
        // Retrieve and log cookie values
        const role = Cookies.get('role');
        const studentId = Cookies.get('studentId');
        console.log("StudentSidebar - Role cookie:", role);
        console.log("StudentSidebar - studentId cookie:", studentId);

        // Validate cookies before making the API call
        if (!role || !studentId) {
          console.error("Missing role or studentId cookie.");
          // Optionally, redirect the user to the login page if cookies are missing
          router.push('/login');
          return;
        }

        // Fetch user details from Firestore using the cookies
        const currentUser = await getUserDetails(role, studentId);
        console.log("StudentSidebar - currentUser data:", currentUser);

        // Check if user data is returned correctly
        if (!currentUser || !currentUser.name) {
          console.error("User data is missing or 'name' is not defined:", currentUser);
          return;
        }

        setUserDetails({
          name: currentUser.name,
          role: role,
        });
      } catch (error) {
        console.error("Error fetching student user data:", error);
      }
    };

    getUser();
  }, [getUserDetails, router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed left-4 top-4 z-50 p-2 rounded-lg bg-smccprimary text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? (
          <X size={24} className="bg-smccprimary" />
        ) : (
          <Menu size={24} className="bg-smccprimary" />
        )}
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
        className={`fixed md:relative w-64 h-screen bg-white flex flex-col border-r border-gray-300 transform transition-transform duration-200 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Profile Section */}
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-smccprimary">
                {userDetails.name || "Guest"}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {userDetails.role || "No role"}
              </p>
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
              { name: 'Route 1', href: '/student/proposal/route-1' },
              { name: 'Route 2', href: '/student/proposal/route-2' },
              { name: 'Route 3', href: '/student/proposal/route-3' },
            ]}
            onLinkClick={() => setIsOpen(false)}
          />

          <SidebarSection
            icon={BookOpen}
            title="Final"
            active={activeSection}
            setActiveSection={setActiveSection}
            links={[
              { name: 'Route 1', href: '/student/final/route-1' },
              { name: 'Route 2', href: '/student/final/route-2' },
              { name: 'Route 3', href: '/student/final/route-3' },
            ]}
            onLinkClick={() => setIsOpen(false)}
          />
        </nav>

        <div className="flex justify-center gap-x-3">
          <Image src={SMCCLogo} alt="SMCC Logo" className="w-12 h-12" />
          <div className="flex flex-col items-start justify-center">
            <p className="text-center text-smccprimary font-semibold text-sm">
              Thesis Routing System
            </p>
            <p className="text-center text-gray-600 text-xs">
              St. Michael's College of Caraga
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          className="m-3 p-2 rounded-lg bg-smccprimary transition-colors duration-200 group"
          onClick={handleLogout}
        >
          <div className="flex items-center justify-center space-x-2">
            <LogOut size={18} className="text-gray-300 group-hover:text-white" />
            <span className="text-sm text-gray-300 group-hover:text-white">
              Log Out
            </span>
          </div>
        </button>
      </div>
    </>
  );
};

export default StudentSidebar;
