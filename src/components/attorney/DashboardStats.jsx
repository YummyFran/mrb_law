"use client"
import { useEffect, useState } from "react";
import ClientService from "../../services/ClientService";

export default function DashboardStats({ activeCases, upcomingEvents }) {
    const [totalClients, setTotalClients] = useState(0)

    const items = [
        ["Total Clients", "fa-users", "text-blue-600", totalClients.length],
        ["Active Cases", "fa-briefcase", "text-green-600", activeCases.length],
        ["Upcoming Events", "fa-calendar", "text-purple-600", upcomingEvents.length],
        ["Pending Bills", "fa-receipt", "text-yellow-600", 1],
    ];

    const fetchTotalClients = async () => {
        const [data, error] = await ClientService.getTotalClients()

        if(!data.success || error) {
            console.log(data.message || error.message)
            return
        }

        setTotalClients(data.totalClients)
    }

    useEffect(() => {
        fetchTotalClients()
    },[])

    return (
        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(([label, icon, color, value]) => (
                <div
                    key={label}
                    className="flex items-center p-4 bg-white shadow rounded-xl"
                >
                    <div className="p-3 bg-gray-100 rounded-full">
                        <i className={`fa-solid ${icon} text-xl ${color}`}></i>
                    </div>

                    <div className="ml-4">
                        <p className="text-sm text-gray-600">{label}</p>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}