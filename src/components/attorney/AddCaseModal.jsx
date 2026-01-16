import CasesService from "../../services/CasesService";
import ClientService from "../../services/ClientService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCaseModal({ onClose, sideEffect }) {
    const [clients, setClients] = useState([])
    const [addingCase, setAddingCase] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        summary: "",
        practice_area: "",
        court: "",
        client_id: "",
    })
    const router = useRouter()

    const PRACTICE_AREAS = [
        "Civil Law",
        "Criminal Law",
        "Family Law",
        "Labor and Employment Law",
        "Corporate Law",
        "Commercial Law",
        "Tax Law",
        "Real Estate Law",
        "Intellectual Property Law",
        "Immigration Law",
        "Environmental Law",
        "Administrative Law",
        "Banking and Finance Law",
        "Insurance Law",
        "Consumer Protection Law",
        "Human Rights Law",
        "Constitutional Law",
        "International Law",
        "Maritime Law",
        "Cyber and Technology Law",
        "Health and Medical Law",
        "Energy Law",
        "Agrarian Law",
        "Election Law"
    ];

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setAddingCase(true)

        const [data, error] = await CasesService.createCase(formData)

        if (!data.success || error) {
            console.log(data.message || error.message)
            setAddingCase(false)
            return
        }

        setAddingCase(false)
        sideEffect()
        router.refresh()
        onClose()
        setFormData({
            title: "",
            summary: "",
            practice_area: "",
            court: "",
            client_id: "",
        })
    }

    const fetchClients = async () => {
        const [data, error] = await ClientService.getAllClients()

        if (!data.success || error) {
            console.log(data.message || error.message)
            return
        }

        setClients(data.allClients)
    }

    useEffect(() => {
        fetchClients()
    }, [])

    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg p-6 text-sm bg-white rounded-lg shadow-lg">
                <h3 className="mb-4 text-lg font-bold">Add New Case</h3>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="font-medium">Case Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full p-2 mt-1 border rounded"
                        />
                    </div>

                    <div>
                        <label className="font-medium">Summary</label>
                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-2 mt-1 border rounded"
                        />
                    </div>

                    <div>
                        <label className="font-medium">Practice Area</label>
                        <select
                            name="practice_area"
                            value={formData.practice_area}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border rounded"
                            required
                        >
                            <option value="">Select practice area</option>
                            {PRACTICE_AREAS.map((practice_area) => (
                                <option key={practice_area} value={practice_area}>
                                    {practice_area}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="font-medium">Client</label>
                        <select
                            name="client_id"
                            value={formData.client_id}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border rounded"
                            required
                        >
                            <option value="">Select client</option>
                            {clients.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={addingCase}
                            className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 disabled:bg-purple-300"
                        >
                            {addingCase ? "Saving…" : "Save Case"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}