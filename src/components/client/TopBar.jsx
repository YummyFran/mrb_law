"use client"
import { useAuth } from '../../contexts/AuthContext'
import React from 'react'

const TopBar = () => {
    const { user } = useAuth()

    return (
        <header className="flex items-center justify-between bg-[#4338ca] text-white px-6 py-3 shadow">
            <div className="flex items-center gap-2 font-semibold tracking-wide">
                <span>MRB LAW</span>
                <span className="text-sm text-indigo-200">Client Portal</span>
            </div>

            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-indigo-600">
                    <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1" />
                    <i className="text-indigo-100 fa-solid fa-bell"></i>
                </button>

                {/* Profile */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 uppercase rounded-full bg-white/20 font-semibold">
                        {user?.name.charAt(0)}
                    </div>
                    <div className="text-sm text-indigo-100">
                        <div className="font-semibold">{user?.name}</div>
                        <div className="text-xs">{user?.email}</div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default TopBar