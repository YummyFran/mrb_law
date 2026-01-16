import React from 'react'

const SimpleSideBarItem = ({ icon, label, blue, collapsed }) => {
  return (
    <button
      className={`flex items-center w-full px-2 py-2 rounded ${
        blue ? "hover:bg-blue-800" : "hover:bg-gray-100"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <i className={`fa-solid ${icon} text-lg ${collapsed ? "" : "mr-3"}`}></i>
      {!collapsed && label}
    </button>
  );
}

export default SimpleSideBarItem