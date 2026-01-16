"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import CasesService from "../../services/CasesService";
import HearingService from "../../services/HearingService";
import Link from "next/link";

export default function ClientDashboard() {
    const [activeCase, setActiveCases] = useState(null);
    const [hearing, setHearing] = useState(null);

    const [loading, setLoading] = useState({
        cases: false,
        hearings: false
    });

    const { user } = useAuth()

    async function loadCases() {
        setLoading(prev => ({ ...prev, cases: true }))

        const [data, err] = await CasesService.getClientActiveCase()

        if (!data.success || err) {
            console.error(data.message || err.message)
            setLoading(prev => ({ ...prev, cases: false }))
            return
        }

        setActiveCases(data.cases[0])
        setLoading(prev => ({ ...prev, cases: false }))
    }

    async function loadHearings() {
        setLoading(prev => ({ ...prev, hearings: true }))

        const [data, err] = await HearingService.getHearing()

        if (!data.success || err) {
            console.error(data.message || err.message)
            setLoading(prev => ({ ...prev, hearings: false }))
            return
        }

        setHearing(data.hearings[0])
        setLoading(prev => ({ ...prev, hearings: false }))
    }

    useEffect(() => {
        const fetchDashboard = async () => {
            await Promise.all([
                loadCases(),
                loadHearings()
            ])
        }
        fetchDashboard()
    }, [])

    return (
        <main className="flex-1 p-8 overflow-auto">
            <div>
                <h1 className="mb-1 text-2xl font-bold">Dashboard</h1>
                <p className="mb-6 text-gray-500">Here’s what’s happening today</p>

                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
                    <div className="p-6 text-center bg-white shadow rounded-xl">
                        <div className="text-lg font-semibold">{user?.name}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>

                    <div className="p-6 bg-white shadow rounded-xl">
                        <div className="mb-2 font-semibold">Active Cases</div>
                        {
                            loading.cases ? (
                                <p className="text-sm text-gray-500">Loading cases...</p>
                            ) :
                                !!activeCase ? (
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-700">
                                            {activeCase?.title}
                                        </p>
                                        <Link href={`/cases/${activeCase?.case_number}`} className="text-xs hover:underline text-gray-500 hover:text-gray-700">See Details</Link>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No active case</p>
                                )
                        }
                    </div>

                    <div className="p-6 bg-white shadow rounded-xl">
                        <div className="mb-2 font-semibold">Next Hearing</div>
                        {
                            loading.hearings ? (
                                <p className="text-sm text-gray-500">Loading hearings...</p>
                            ) : 
                            !!hearing ? (
                                <p className="text-sm text-gray-700">
                                    {new Date(hearing.hearing_date).toLocaleString()}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500">None scheduled</p>
                            )}
                    </div>
                </div>
            </div>
        </main>
    );
}


function CasesSection({ cases }) {
    return (
        <section>
            <h2 className="mb-4 text-xl font-semibold">My Cases</h2>
            {cases.length === 0 ? (
                <p className="text-gray-500">No cases found.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {cases.map((c) => (
                        <div key={c.id} className="p-4 bg-white shadow rounded-xl">
                            <div className="font-semibold">{c.title}</div>
                            <div className="text-sm text-gray-500">{c.description}</div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

function EventsSection({ events }) {
    return (
        <section>
            <h2 className="mb-4 text-xl font-semibold">My Events</h2>
            {events.length === 0 ? (
                <p className="text-gray-500">No events found.</p>
            ) : (
                <div className="space-y-3">
                    {events.map((e) => (
                        <div key={e.id} className="p-4 bg-white shadow rounded-xl">
                            <div className="font-semibold">{e.title}</div>
                            <div className="text-sm text-gray-500">
                                {new Date(e.start_datetime).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

function DocumentsSection({ documents, onUpload, uploading }) {
    return (
        <section>
            <h2 className="mb-4 text-xl font-semibold">My Documents</h2>

            <form
                onSubmit={onUpload}
                className="max-w-xl p-4 mb-6 space-y-3 bg-white shadow rounded-xl"
            >
                <div className="font-semibold">Upload Document</div>

                <input name="title" className="w-full px-2 py-1 border rounded" placeholder="Title" />
                <input name="caseId" className="w-full px-2 py-1 border rounded" placeholder="Case ID (optional)" />
                <input name="eventId" className="w-full px-2 py-1 border rounded" placeholder="Event ID (optional)" />

                <input type="file" name="file" />

                <button
                    disabled={uploading}
                    className="px-4 py-2 text-white bg-indigo-600 rounded"
                >
                    {uploading ? "Uploading…" : "Upload"}
                </button>
            </form>

            {documents.length === 0 ? (
                <p className="text-gray-500">No documents yet.</p>
            ) : (
                <div className="max-w-2xl space-y-2">
                    {documents.map((d) => (
                        <div key={d.id} className="p-4 bg-white shadow rounded-xl">
                            <div className="font-semibold">{d.title}</div>
                            <a href={d.file_path} className="text-sm text-indigo-600" target="_blank">
                                Open Document
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

function BillingSection({ billing }) {
    return (
        <section>
            <h2 className="mb-4 text-xl font-semibold">Billing</h2>

            {billing.length === 0 ? (
                <p className="text-gray-500">No billing records.</p>
            ) : (
                <div className="max-w-xl space-y-3">
                    {billing.map((b) => (
                        <div key={b.id} className="flex justify-between p-4 bg-white shadow rounded-xl">
                            <div>
                                <div className="font-semibold">{b.description}</div>
                                <div className="text-xs text-gray-500">
                                    Due: {new Date(b.due_date).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold">₱{Number(b.amount).toFixed(2)}</div>
                                <div className="text-xs">{b.status.toUpperCase()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
