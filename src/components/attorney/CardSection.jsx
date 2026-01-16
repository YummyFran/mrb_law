"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

const CardSection = ({ title, items, colorMap }) => {
    const router = useRouter()

    return (
        <div className="p-5 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold">{title}</h3>
                <button className="text-xs text-indigo-600 cursor-pointer hover:underline" onClick={() => router.push('/hearings')}>View all </button>
            </div>

            <div className="text-xs flex flex-col gap-3">
                {items.map((item) => (
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
        </div>
    );
}

export default CardSection