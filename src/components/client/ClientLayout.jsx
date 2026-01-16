import React from 'react'
import TopBar from './TopBar'
import SideNav from './SideNav'

const ClientLayout = ({ children }) => {
  return (
     <div className="min-h-screen flex flex-col bg-[#f5f5fb] text-gray-900">
        <TopBar />
        <div className="flex flex-1 min-h-0">
            <SideNav />
            { children }
        </div>
     </div>
  )
}

export default ClientLayout