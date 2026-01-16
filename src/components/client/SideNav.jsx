"use client"
import React from 'react'
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AuthService from '../../services/AuthService';
import { useAuth } from '../../contexts/AuthContext';

const navlinks = [
    { href: "/", label: "Dashboard", icon: "🏠" },
    { href: "/cases", label: "My Cases", icon: "📁" },
    { href: "/events", label: "My Events", icon: "📅" },
    // { href: "/documents", label: "My Documents", icon: "📄" },
    // { href: "/billing", label: "Billing", icon: "💰" },
    // { href: "/settings", label: "Settings", icon: "⚙️" },
    // { href: "/help", label: "Help & Support", icon: "❓" },
]

const SideNav = () => {
    const pathname = usePathname()
    const router = useRouter()
    const { refetch } = useAuth()

    const handleLogout = async () => {
        const [data, err] = await AuthService.logout()

        if(!data.success || err) {
            alert("Logout Error")

            return
        }

        await refetch()
        router.refresh()
    }
    return (
        <aside className="flex flex-col w-64 bg-white shadow-inner">
            <div className="px-6 py-4 text-xs font-semibold text-gray-500 border-b">
                Client Menu
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1 text-sm">
                {navlinks.map(({ href, label, icon }) => {
                    const isActive = pathname === href || pathname.startsWith(href + "/")

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-left hover:bg-indigo-50 ${isActive ? "bg-indigo-50 text-indigo-700 font-semibold" : ""}`}
                        >
                            <span>{icon}</span>
                            <span>{label}</span>
                        </Link>

                    )
                })}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 text-sm text-red-500 border-t hover:bg-red-50 cursor-pointer"
            >
                <span>⏻</span>
                <span>Log Out</span>
            </button>
        </aside>
    )
}

export default SideNav