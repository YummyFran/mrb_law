"use client"

import HearingService from '../../services/HearingService'
import React, { useEffect, useState } from 'react'
import HearingCard from './HearingCard'

const ClientEvents = () => {
    const [events, setEvents] = useState([])
    const [isEventsLoading, setIsEventsLoading] = useState(false)

    useEffect(() => {
        const fetchEvents = async () => {
            setIsEventsLoading(true)

            const [data, err] = await HearingService.getHearing()

            if (!data.success || err) {
                console.error(data.message || err.message)
                setIsEventsLoading(false)
                return
            }

            setEvents(data.hearings)
            setIsEventsLoading(false)
        }

        fetchEvents()
    }, [])

    return (
        <main className='p-8'>
            <h2 className="mb-4 text-2xl font-bold">My Events</h2>
            {events.length === 0 ? (
                <p className="text-gray-500">No cases found.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {events.map((hearing) => (
                        <HearingCard key={hearing.id} hearingData={hearing} />
                    ))}
                </div>
            )}
        </main>
    )
}

export default ClientEvents