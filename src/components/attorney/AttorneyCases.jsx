"use client"

import CasesService from '../../services/CasesService'
import React, { useEffect, useState } from 'react'

const AttorneyCases = () => {
    const [cases, setCases] = useState([])
    const [isCasesLoading, setIsCasesLoading] = useState(false)

    const statusColorMap = {
        ongoing: {
            bg: 'bg-green-200',
            text: 'text-green-700',
        },
        closed: {
            bg: 'bg-gray-200',
            text: 'text-gray-700',
        },
        pending: {
            bg: 'bg-yellow-200',
            text: 'text-yellow-700',
        },
        appealed: {
            bg: 'bg-blue-200',
            text: 'text-blue-700',
        },
        dismissed: {
            bg: 'bg-red-200',
            text: 'text-red-700',
        },
    };

    useEffect(() => {
        const fetchCases = async () => {
            setIsCasesLoading(true)

            const [data, err] = await CasesService.getAllAttorneyCases()

            if (!data.success || err) {
                console.log(data.message || err.message)
                setIsCasesLoading(false)
                return
            }

            setCases(data.cases)
            setIsCasesLoading(false)
        }

        fetchCases()
    }, [])

    return (
        <main className='p-8'>
            <h2 className="mb-4 text-2xl font-bold">Cases</h2>
            {
                isCasesLoading ? (
                    <p className="text-sm text-gray-500">Loading cases...</p>
                ) :
                    cases.length === 0 ? (
                        <p className="text-gray-500">No cases found.</p>
                    ) : (
                        <div className="grid gap-2 md:grid-cols-1">
                            {cases.map((c) => (
                                <div
                                    key={c.id}
                                    className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                                >
                                    <div>
                                        <div className="font-semibold text-gray-800">{c.title}</div>
                                        <div className="text-[11px] text-gray-500">
                                            Client: {c.clientName} · Status: <span className={`py-0.5 px-2 rounded-full ${statusColorMap[c.status].bg} ${statusColorMap[c.status].text}`}>{c.status}</span>
                                        </div>
                                    </div>

                                    <i className="text-xs text-gray-400 fa-solid fa-chevron-right"></i>
                                </div>
                            ))}
                        </div>
                    )}
        </main>
    )
}

export default AttorneyCases