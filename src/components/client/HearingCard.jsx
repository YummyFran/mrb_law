import React from 'react'

const HearingCard = ({ hearingData }) => {
    const statusColorMap = {
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
    return (
        <div className="p-4 bg-white shadow rounded-xl w-65 flex flex-col gap-2">
            <div className='text-xs text-gray-500 font-semibold'>#{hearingData.case_number}</div>
            <div>
                <div className="font-semibold flex items-center justify-between gap-2">
                    {hearingData.title}
                    <span className={`text-xs font-normal rounded-full py-0.5 px-2 ${statusColorMap[hearingData.status].bg} ${statusColorMap[hearingData.status].text}`}>{hearingData.status}</span>
                </div>
                <div className='text-xs'>{hearingData.hearing_type}</div>
            </div>
            <div className='text-xs text-gray-500'>Case Tittle: {hearingData.case_title}</div>
            <div className='text-xs text-gray-500'>Location: {hearingData.location}</div>
            <div className='text-xs text-gray-500'>Hearing date: {new Date(hearingData.hearing_date).toLocaleDateString()}</div>
        </div>
    )
}

export default HearingCard