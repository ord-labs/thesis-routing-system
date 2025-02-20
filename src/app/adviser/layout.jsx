import AdviserSidebar from "../../components/sidebar/AdviserSidebar";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <AdviserSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
};

export default layout;