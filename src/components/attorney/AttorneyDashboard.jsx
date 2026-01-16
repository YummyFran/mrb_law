"use client"

import { useAuth } from '../../contexts/AuthContext'
import React, { useEffect, useState } from 'react'
import ScheduleBar from './ScheduleBar'
import DashboardStats from './DashboardStats'
import CardSection from './CardSection'
import EventsService from "../../services/EventsService";
import CasesService from "../../services/CasesService";
import AddEventModal from './AddEventModal'
import AddCaseModal from './AddCaseModal'
import { useRouter } from 'next/navigation'

const AttorneyDashboard = () => {
    const [scheduleView, setScheduleView] = useState("week");
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [showAddCase, setShowAddCase] = useState(false);
    const [loadingCases, setLoadingCases] = useState(false);
    const [upcomingEvents, setUpcomingEvents] = useState([])
    const [activeCases, setActiveCases] = useState([])

    const { user } = useAuth()
    const router = useRouter()

    const recentDocuments = [
        {
            id: 1,
            title: "Smith Contract Agreement.pdf",
            date: "Today · 10:34 AM",
            by: "Atty. Jane Smith",
        },
        {
            id: 2,
            title: "Motion for Extension.docx",
            date: "Yesterday · 3:20 PM",
            by: "Staff – John Cruz",
        },
        {
            id: 3,
            title: "Case Summary – Doe vs. Smith.pdf",
            date: "Mar 3, 2025",
            by: "Atty. Mark Reyes",
        },
    ];

    const hearingStatusMap = {
        scheduled: {
            bg: 'bg-green-200',
            text: 'text-green-700',
        },
        completed: {
            bg: 'bg-gray-200',
            text: 'text-gray-700',
        },
        postponed: {
            bg: 'bg-yellow-200',
            text: 'text-yellow-700',
        },
        cancelled: {
            bg: 'bg-red-200',
            text: 'text-red-700',
        },
    };

    function openAddCaseModal() {
        setShowAddCase(true);
    }

    const fetchActiveCases = async () => {
        setLoadingCases(true)

        const [data, error] = await CasesService.getAttorneytActiveCase()

        if (!data.success || error) {
            console.log(data.message || error.message)
            setLoadingCases(false)
            return
        }

        setActiveCases(data.cases)
        setLoadingCases(false)
    }

    const fetchUpcomingEvents = async () => {
        const [data, error] = await EventsService.getUpcomingEvents()

        if (!data.success || error) {
            console.log(data.message || error.message)
            return
        }

        setUpcomingEvents(data.hearings)
    }

    useEffect(() => {
        fetchUpcomingEvents()
        fetchActiveCases()
    }, [])

    return (
        <section className="flex-1 px-6 py-6 overflow-y-auto">

            <h1 className="text-2xl font-bold">
                Welcome, {user?.name || "User"}
            </h1>
            <p className="text-sm text-gray-600">
                Here&apos;s what&apos;s happening today
            </p>

            <div className="p-4 mt-4 bg-white shadow-sm rounded-xl">
                <ScheduleBar
                    scheduleView={scheduleView}
                    onAddEvent={() => setShowAddEvent(true)}
                />
            </div>

            {/* OVERVIEW */}
            <div className="flex items-center justify-between mt-6">
                <h2 className="text-lg font-semibold">Dashboard Overview</h2>
                <button
                    onClick={openAddCaseModal}
                    className="px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700"
                >
                    + Add Case
                </button>
            </div>

            <DashboardStats activeCases={activeCases} upcomingEvents={upcomingEvents} />

            {/* HEARINGS + CONSULTATIONS */}
            <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-1">

                <CardSection title="Upcoming Court Hearings" items={upcomingEvents} colorMap={hearingStatusMap} />

                {/* <CardSection title="Upcoming Consultations" items={upcomingConsultations} /> */}

            </div>

            {/* CASES */}
            <div className="p-5 mt-6 bg-white shadow-sm rounded-xl">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold">Recent Cases</h3>
                    <button className="text-xs font-medium text-indigo-600 cursor-pointer hover:underline" onClick={() => router.push('/cases')}>
                        View all cases
                    </button>
                </div>

                {loadingCases && (
                    <p className="text-xs text-gray-500">Loading cases…</p>
                )}

                {!loadingCases && activeCases.length === 0 && (
                    <p className="text-xs text-gray-500">No cases yet.</p>
                )}

                {!loadingCases && activeCases.length > 0 && (
                    <div className="space-y-2 text-xs">
                        {activeCases.slice(0, 5).map((c) => (
                            <div
                                key={c.id}
                                className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                            >
                                <div>
                                    <div className="font-semibold text-gray-800">{c.title}</div>
                                    <div className="text-[11px] text-gray-500">
                                        Client: {c.clientName} · Status: {c.status}
                                    </div>
                                </div>

                                <i className="text-xs text-gray-400 fa-solid fa-chevron-right"></i>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* RECENT DOCUMENTS */}
            {/* <div className="p-5 mt-6 bg-white shadow-sm rounded-xl">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold">Recent Documents</h3>
                    <button className="text-xs font-medium text-indigo-600">
                        View all filings
                    </button>
                </div>

                <div className="space-y-2 text-xs">
                    {recentDocuments.map((d) => (
                        <div
                            key={d.id}
                            className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                        >
                            <div>
                                <div className="font-semibold text-gray-800">{d.title}</div>
                                <div className="text-[11px] text-gray-500">
                                    {d.date} · {d.by}
                                </div>
                            </div>

                            <i className="text-xs text-gray-400 fa-solid fa-chevron-right"></i>
                        </div>
                    ))}
                </div>
            </div> */}

            {showAddCase && <AddCaseModal onClose={() => setShowAddCase(false)} sideEffect={() => fetchActiveCases()} />}
            {showAddEvent && <AddEventModal onClose={() => setShowAddEvent(false)} sideEffect={() => fetchUpcomingEvents()} />}

        </section>
    )
}

export default AttorneyDashboard