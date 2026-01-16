'use client'

import Link from 'next/link'
import HearingService from '../../services/HearingService'
import React, { useEffect, useState } from 'react'

const page = () => {
    const [hearings, setHearings] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const colorMap = {
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

    const fetchHearings = async () => {
        setIsLoading(true)

        const [data, error] = await HearingService.getHearing()

        if (!data.success || error) {
            console.log(data.message || error.message)
            setIsLoading(false)
            return
        }

        setHearings(data.hearings)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchHearings()
    }, [])

    return (
        <section className="flex-1 px-6 py-6 overflow-y-auto">
            <h1 className="text-2xl font-bold mb-4">
                Hearings
            </h1>

            {
                isLoading ?
                    <p>Fetching hearings...</p>
                    :
                    <div className='flex flex-col gap-2'>
                        {hearings.map((item) => (
                            <Link href={`/hearings/${item.id}`} key={item.id} className="px-3 py-2 border rounded-lg bg-gray-50 flex flex-col gap-1">
                                <div className="font-semibold text-lg">
                                    {item.title}
                                </div>
                                <div>
                                    {item.description}
                                </div>
                                <div className="text-gray-600">
                                    {new Date(item.hearing_date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })} · {new Date(item.hearing_date).toLocaleTimeString()}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                    {item.location || item.mode}
                                </div>
                                <div
                                    className={`mt-1 inline-block px-2 py-0.5 text-[10px] rounded-full self-start ${colorMap[item.status].bg} ${colorMap[item.status].text}`}
                                >
                                    {item.status}
                                </div>
                            </Link>
                        ))}
                    </div>
            }
        </section>
    )
}

export default page