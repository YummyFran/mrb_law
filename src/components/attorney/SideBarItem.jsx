import React from 'react'

const SideBarItem = ({
    icon,
    label,
    open,
    onClick,
    hasArrow,
    children,
    blue,
    collapsed,
}) => {
    return (
        <div>
            <button
                onClick={onClick}
                className={`flex items-center w-full px-2 py-2 rounded ${blue ? "hover:bg-blue-800" : "hover:bg-gray-100"
                    }`}
            >
                <i className={`fa-solid ${icon} text-lg ${collapsed ? "" : "mr-3"}`}></i>
                {!collapsed && <span className="flex-1">{label}</span>}
                {hasArrow && !collapsed && (
                    <i
                        className={`fa-solid fa-chevron-${open ? "down" : "right"} text-xs`}
                    ></i>
                )}
            </button>


            <div
                className={`overflow-hidden transition-all duration-300 ${open && !collapsed ? "max-h-96 mt-1" : "max-h-0"
                    }`}
            >
                {open && !collapsed && children}
            </div>
        </div>
    );
}

export default SideBarItem