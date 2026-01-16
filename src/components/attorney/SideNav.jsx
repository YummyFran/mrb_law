"use client"

import React, { useState } from 'react'
import SideBarItem from './SideBarItem';
import SimpleSideBarItem from './SimpleSidebarItem';
import AuthService from '../../services/AuthService';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SideNav = () => {
    const [folders, setFolders] = useState({
        clients: false,
        documents: false,
        workflow: false,
    });
    const [clients, setClients] = useState({
        isLoading: false,
        list: []
    });
    const { refetch } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        const [data, err] = await AuthService.logout()

        if (!data.success || err) {
            alert("Logout Error")

            return
        }

        await refetch()
        router.refresh()
    }

    const toggleFolder = (key) => setFolders((prev) => ({ ...prev, [key]: !prev[key] }));
    function clientsByGroup(groupLabel) {
        const groups = {
            "A-D": ["A", "B", "C", "D"],
            "E-H": ["E", "F", "G", "H"],
            "I-L": ["I", "J", "K", "L"],
            "M-P": ["M", "N", "O", "P"],
            "Q-T": ["Q", "R", "S", "T"],
            "U-Z": ["U", "V", "W", "X", "Y", "Z"],
        };

        const letters = groups[groupLabel];
        if (!letters) return [];

        return clients.list.filter(
            (c) => c?.name && letters.includes(c.name.charAt(0).toUpperCase())
        );
    }
    return (
        <aside className="flex flex-col w-64 text-white bg-blue-900 max-h-screen sticky top-0">
            <Link href={'/'} className="flex items-center justify-center h-16 border-b border-blue-800">
                <h1 className="text-xl font-extrabold tracking-widest">
                    MRB <span className="text-blue-300">LAW</span>
                </h1>
            </Link>

            <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
                {/* CLIENTS */}
                <SideBarItem
                    icon="fa-users"
                    label="Clients"
                    open={folders.clients}
                    onClick={() => toggleFolder("clients")}
                    hasArrow
                    blue
                >
                    {clients.isLoading && (
                        <p className="ml-8 text-xs text-gray-300">Loading…</p>
                    )}

                    {!clients.isLoading &&
                        ["A-D", "E-H", "I-L", "M-P", "Q-T", "U-Z"].map((grp) => {
                            const list = clientsByGroup(grp);
                            return (
                                <div key={grp} className="mt-2 ml-6">
                                    <div className="text-xs font-semibold text-blue-200">
                                        {grp}
                                    </div>
                                    <ul className="mt-1 space-y-1 text-[11px] text-blue-100">
                                        {list.map((c) => (
                                            <li
                                                key={c.id}
                                                onClick={() => setSelectedClient(c)}
                                                className={`truncate cursor-pointer px-2 py-1 rounded
                         ${selectedClient?.id === c.id
                                                        ? "bg-blue-700"
                                                        : "hover:bg-blue-800"
                                                    }`}
                                            >
                                                {c.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                </SideBarItem>

                {/* DOCUMENTS */}
                <SideBarItem
                    icon="fa-folder-open"
                    label="Documents"
                    open={folders.documents}
                    onClick={() => toggleFolder("documents")}
                    hasArrow
                    blue
                >
                    <ul className="mt-2 ml-8 space-y-1 text-[13px] text-blue-100">
                        <li>Recent Documents</li>
                        <li>Shared with Me</li>
                        <li>Starred</li>
                        <li>Templates</li>
                    </ul>
                </SideBarItem>

                {/* WORKFLOW DROPDOWN */}
                <SideBarItem
                    icon="fa-diagram-project"
                    label="Workflow"
                    open={folders.workflow}
                    onClick={() => toggleFolder("workflow")}
                    hasArrow
                    blue
                >
                    <div className="mt-2 ml-8 space-y-1 text-[13px] text-blue-100">
                        <button className="flex items-center w-full text-left hover:underline">
                            <i className="mr-2 fa-solid fa-timeline" />
                            <span>Case Timeline</span>
                        </button>

                        <button className="flex items-center w-full text-left hover:underline">
                            <i className="mr-2 fa-solid fa-receipt" />
                            <span>Expenses</span>
                        </button>

                        <button className="flex items-center w-full text-left hover:underline">
                            <i className="mr-2 fa-solid fa-list-check" />
                            <span>Activities</span>
                        </button>
                    </div>
                </SideBarItem>
            </nav>

            {/* FOOTER NAV */}
            <nav className="px-4 pb-5 space-y-2 text-sm border-t border-blue-800">
                <SimpleSideBarItem icon="fa-gear" label="Settings" blue />
                <SimpleSideBarItem
                    icon="fa-circle-question"
                    label="Help & Support"
                    blue
                />
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-2 py-2 text-red-300 rounded hover:bg-blue-800"
                >
                    <i className="mr-3 fa-solid fa-right-from-bracket"></i>
                    Log Out
                </button>
            </nav>
        </aside>
    )
}

export default SideNav