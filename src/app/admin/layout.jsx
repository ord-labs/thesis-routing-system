import AdminSidebar from "../../components/sidebar/AdminSidebar";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
};

export default layout;