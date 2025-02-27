import PanelSidebar from "../../components/sidebar/PanelSidebar";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <PanelSidebar />
      <main className="flex-1 overflow-y-auto relative bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
};

export default layout;