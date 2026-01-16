"use client"

import CasesService from '../../services/CasesService'
import React, { useEffect, useState } from 'react'
import CaseCard from './CaseCard'

const ClientCases = () => {
    const [cases, setCases] = useState([])
    const [isCasesLoading, setIsCasesLoading] = useState(false)

    useEffect(() => {
        const fetchCases = async () => {
            setIsCasesLoading(true)

            const [data, err] = await CasesService.getClientActiveCase()

            if (!data.success || err) {
                console.error(data.message || err.message)
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
            <h2 className="mb-4 text-2xl font-bold">My Cases</h2>
            {
                isCasesLoading ? (
                    <p className="text-sm text-gray-500">Loading hearings...</p>
                ) :
                    cases.length === 0 ? (
                        <p className="text-gray-500">No cases found.</p>
                    ) : (
                        <div className="flex gap-4 flex-wrap">
                            {cases.map((c) => (
                                <CaseCard key={c.id} caseData={c} />
                            ))}
                        </div>
                    )}
        </main>
    )
}

export default ClientCases