"use client";

import { useState } from "react";
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
} from "lucide-react";
import SidebarSection from "./SidebarSection";

const StudentSidebar = () => {
  const [activeSection, setActiveSection] = useState("Title Proposal");
  const [isOpen, setIsOpen] = useState(false);

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
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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
              <p className="text-xs text-gray-400">Student</p>
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
              { name: "route 1", href: "/student/proposal/route-1" },
              { name: "route 2", href: "/student/proposal/route-2" },
              { name: "route 3", href: "/student/proposal/route-3" },
            ]}
            onLinkClick={() => setIsOpen(false)}
          />

          <SidebarSection
            icon={BookOpen}
            title="Final"
            active={activeSection}
            setActiveSection={setActiveSection}
            links={[
              { name: "route 1", href: "/student/final/route-1" },
              { name: "route 2", href: "/student/final/route-2" },
              { name: "route 3", href: "/student/final/route-3" },
            ]}
            onLinkClick={() => setIsOpen(false)}
          />

          <div className="mt-4 pt-4 border-t border-gray-700">
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={18} />
              <span>Settings</span>
            </a>
          </div>
        </nav>

        {/* Logout Button */}
        <button
          className="m-3 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 group"
          onClick={() => setIsOpen(false)}
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