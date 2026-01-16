"use client"

import EventsService from '../../services/EventsService'
import React, { useEffect, useState } from 'react'

const ScheduleBar = ({ onAddEvent, sideEffect }) => {
    const [weeklyEvents, setWeeklyEvents] = useState([])

    const fetchWeeklyEvents = async () => {
        const [data, error] = await EventsService.getWeekEvents()

        if(!data.success || error) {
            console.log(data.message || error.message)
            return
        }

        setWeeklyEvents(data.days)
    }

    useEffect(() => {
        fetchWeeklyEvents()
    }, [])
    return (
        <>
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700">Weekly Schedule</h2>

                {/* Internal event by default */}
                <button
                    onClick={() => onAddEvent({ eventType: "internal" })}
                    className="px-3 py-1 text-xs text-white bg-purple-600 rounded-full hover:bg-purple-700"
                >
                    + Add Event
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-xs">
                {weeklyEvents.map((d, idx) => (
                    <div
                        title={d.date}
                        key={d.day}
                        className={`rounded-lg px-2 py-3 text-center border border-gray-200 ${d.events.length > 0
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "bg-gray-50 text-gray-700"
                            }`}
                    >
                        <div className="font-semibold">{d.day} {idx == 0 && <span className='text-gray-600 font-normal'>(Today)</span>}</div>
                        <div className="mt-1 text-[11px]">
                            {d.events.length > 0 ? d.events[0].title : "No Event"}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default ScheduleBar