'use client'

import DeleteModal from '../../../components/attorney/DeleteModal'
import HearingService from '../../../services/HearingService'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const { id } = useParams()
    const [originalHearing, setOriginalHearing] = useState({})
    const [hearing, setHearing] = useState({})
    const [saving, setSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleteModalShowing, setIsDeleteModalShowing] = useState(false)
    const router = useRouter()

    const hasContentChanged = JSON.stringify(originalHearing) !== JSON.stringify(hearing)

    const fetchHearing = async () => {
        if (!id) return

        setIsLoading(true)

        const [data, error] = await HearingService.getHearingById(id)

        if (!data.success || error) {
            setIsLoading(false)
            console.log(data.message || error.message)
            return
        }

        setOriginalHearing(data.hearing)
        setHearing(data.hearing)
        setIsLoading(false)
    }

    const handleChange = e => {
        setHearing((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    const handleDelete = async () => {
        const [data, error] = await HearingService.deleteHearing(id)

        if (!data.success || error) {
            setSaving(false)
            console.log(data.message || error.message)
            return
        }

        router.push("/")
    }

    const handleSave = async () => {
        setSaving(true)

        const [data, error] = await HearingService.updateHearing({ id, title: hearing.title, description: hearing.description })

        if (!data.success || error) {
            setSaving(false)
            console.log(data.message || error.message)
            return
        }

        setSaving(false)
        fetchHearing()
    }

    useEffect(() => {
        fetchHearing()
    }, [id])

    if (isLoading) return <p>Fetching hearing...</p>
    if (!isLoading && !hearing.id) return <p>404</p>
    return (
        <div className='flex-1 px-6 py-6 overflow-y-auto'>
            {isDeleteModalShowing && <DeleteModal text={"Are you sure you want to delete hearing?"} onClose={() => setIsDeleteModalShowing(false)} onDelete={handleDelete}/>}
            <div className='flex gap-4 items-center'>
                <p className='mr-auto py-3'>Hearing #{hearing.id}</p>
                {hasContentChanged && <button className='bg-blue-900 px-4 py-2 cursor-pointer rounded-full text-white disabled:opacity-5' onClick={handleSave} disabled={saving}>{saving ? "Saving changes" : "Save"}</button>}
                <button className='text-sm cursor-pointer hover:text-red-500' onClick={() => setIsDeleteModalShowing(true)}>Delete</button>
            </div>
            <div>
                <h1 className='text-2xl font-bold'><input type="text" className='outline-none field-sizing-content' name='title' value={hearing.title} onChange={handleChange}/></h1>
                <p className='text-m text-gray-500'>{hearing.hearing_type}</p>
                <p className='py-4 text-lg'><textarea className='outline-none field-sizing-content' name='description' value={hearing.description} onChange={handleChange}></textarea></p>

                <div className='px-6 py-4 my-4 rounded-md bg-white w-fit shadow-md'>
                    <p className='text-sm text-gray-600'>Case #{hearing.case_number}</p>
                    <h2 className='text-bold text-xl'>{hearing.case_title}</h2>
                    <p>{hearing.practice_area}</p>
                </div>

                <p className='font-bold flex gap-4'>Court: <span className='font-normal'>{hearing.court}</span></p>
                <p className='font-bold flex gap-4'>Location: <span className='font-normal'>{hearing.location}</span></p>
                <p className='font-bold flex gap-4'>Hearing Date: <span className='font-normal'>{new Date(hearing.hearing_date).toLocaleString()}</span></p>
            </div>
        </div>
    )
}

export default page