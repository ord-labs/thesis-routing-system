"use client";

import { useState } from "react";
import { ChevronDown, LogOut, LayoutDashboard, BookOpen, UserPlus, FileText, User, Settings } from "lucide-react";

const SidebarSection = ({ title, active, setActiveSection, links, icon }) => {
  const isActive = active === title;
  const Icon = icon;

  return (
    <div className="mb-1">
      <button
        onClick={() => setActiveSection(isActive ? null : title)}
        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
          isActive ? "bg-indigo-700 text-white" : "hover:bg-gray-700 hover:text-white text-gray-300"
        }`}
      >
        <div className="flex items-center space-x-3">
          <Icon size={18} className="flex-shrink-0" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <ChevronDown
          size={18}
          className={`transform transition-transform duration-300 ${
            isActive ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${isActive ? "max-h-96" : "max-h-0"}`}>
        <div className="ml-8 pl-3 border-l-2 border-gray-600 space-y-2 py-2">
          {links.map((link, index) => (
            <a
              key={index}
              href="#"
              className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-700 transition-colors duration-200 text-gray-300 hover:text-white"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminSidebar = () => {
  const [activeSection, setActiveSection] = useState("Title Proposal");

  return (
    <div className="w-64 h-screen bg-gray-800 flex flex-col border-r border-gray-700">
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
        <SidebarSection
          icon={FileText}
          title="Title Proposal"
          active={activeSection}
          setActiveSection={setActiveSection}
          links={["Draft Proposal", "Submission", "Approval Status", "Indorsement Form"]}
        />
        
        <SidebarSection
          icon={BookOpen}
          title="Final Defense"
          active={activeSection}
          setActiveSection={setActiveSection}
          links={["Schedule", "Documents", "Results"]}
        />
        
        <SidebarSection
          icon={UserPlus}
          title="Register Account"
          active={activeSection}
          setActiveSection={setActiveSection}
          links={["Panel Members", "Adviser", "Committee"]}
        />
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <a
            href="#"
            className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <Settings size={18} />
            <span>Settings</span>
          </a>
        </div>
      </nav>

      {/* Logout Button */}
      <button className="m-3 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 group">
        <div className="flex items-center justify-center space-x-2">
          <LogOut size={18} className="text-gray-300 group-hover:text-white" />
          <span className="text-sm text-gray-300 group-hover:text-white">Log Out</span>
        </div>
      </button>
    </div>
  );
};

export default AdminSidebar;