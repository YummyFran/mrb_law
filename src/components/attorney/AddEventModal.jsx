"use client"

import CasesService from "../../services/CasesService";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import HearingService from "../../services/HearingService";
import { useRouter } from "next/navigation";

export default function AddEventModal({ onClose, sideEffect }) {
    const [saving, setSaving] = useState(false);
    const [cases, setCases] = useState([]);
    const [formData, setFormData] = useState({
        case_id: "",
        title: "",
        description: "",
        hearing_type: "",
        hearing_date: {
            date: "",
            time: ""
        },
        location: "",
    })
    const { user } = useAuth()
    const router = useRouter()

    const hearingTypes = [
        'arraignment',
        'pre_trial',
        'trial',
        'motion',
        'appeal',
        'sentencing',
        'other'
    ]

    async function loadCases(cid) {
        const [data, error] = await CasesService.getAllAttorneyCases()

        if (!data.success || error) {
            console.log(data.message || error.message)
            return
        }

        setCases(data.cases)
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setSaving(true);

        const [data, error] = await HearingService.createHearing({
            ...formData,
            hearing_date: `${formData.hearing_date.date} ${formData.hearing_date.time}`
        })

        if (!data.success || error) {
            console.log(data.message || error.message)
            setSaving(false)
            return
        }

        setFormData({
            case_id: "",
            title: "",
            description: "",
            hearing_type: "",
            hearing_date: {
                date: "",
                time: ""
            },
            location: "",
        })
        onClose()
        setSaving(false)
        sideEffect()
        router.refresh()
    }

    useEffect(() => {
        loadCases(user.id)
    }, [])

    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <h3 className="mb-3 text-lg font-bold">Add Hearing Event</h3>

                <form onSubmit={handleSubmit} className="space-y-3 text-sm">
                    <div>
                        <label className="font-medium">Case</label>
                        <select
                            value={formData.case_id}
                            onChange={(e) => setFormData(prev => ({ ...prev, case_id: e.target.value }))}
                            className="w-full p-2 mt-1 border rounded"
                            required
                        >
                            <option value="">No case</option>
                            {cases.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* TITLE */}
                    <div>
                        <label className="font-medium">Hearing Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            required
                            className="w-full p-2 mt-1 border rounded"
                            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="font-medium">Hearing Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            className="w-full p-2 mt-1 border rounded"
                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        ></textarea>
                    </div>

                    {/* TYPE */}
                    <div>
                        <label className="font-medium">Hearing Type</label>
                        <select
                            value={formData.hearing_type}
                            onChange={(e) => setFormData(prev => ({ ...prev, hearing_type: e.target.value }))}
                            className="w-full p-2 mt-1 border rounded"
                            required
                        >
                            <option value="">Select Type</option>
                            {hearingTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* DATE */}
                    <div>
                        <label className="font-medium">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.hearing_date.date}
                            required
                            className="w-full p-2 mt-1 border rounded"
                            onChange={e => setFormData(prev => ({ ...prev, hearing_date: { ...prev.hearing_date, date: e.target.value } }))}
                        />
                    </div>

                    {/* TIME */}
                    <div>
                        <label className="font-medium">Time</label>
                        <input
                            type="time"
                            name="time"
                            value={formData.hearing_date.time}
                            required
                            className="w-full p-2 mt-1 border rounded"
                            onChange={e => setFormData(prev => ({ ...prev, hearing_date: { ...prev.hearing_date, time: e.target.value } }))}
                        />
                    </div>

                    {/* LOCATION */}
                    <div>
                        <label className="font-medium">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            className="w-full p-2 mt-1 border rounded"
                            onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={saving}
                            className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 disabled:bg-purple-300"
                        >
                            {saving ? "Saving…" : "Save Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}