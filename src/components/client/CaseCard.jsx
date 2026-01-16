import React from 'react'


const CaseCard = ({ caseData }) => {
    const statusColorMap = {
        ongoing: {
            bg: 'bg-green-200',
            text: 'text-green-700',
        },
        closed: {
            bg: 'bg-gray-200',
            text: 'text-gray-700',
        },
        pending: {
            bg: 'bg-yellow-200',
            text: 'text-yellow-700',
        },
        appealed: {
            bg: 'bg-blue-200',
            text: 'text-blue-700',
        },
        dismissed: {
            bg: 'bg-red-200',
            text: 'text-red-700',
        },
    };


    return (
        <div className="p-4 bg-white shadow rounded-xl w-65 flex flex-col gap-2">
            <div className='text-xs text-gray-500 font-semibold'>#{caseData.case_number}</div>
            <div>
                <div className="font-semibold flex items-center justify-between gap-2">
                    {caseData.title}
                    <span className={`text-xs font-normal ${statusColorMap[caseData.status].bg} rounded-full py-0.5 px-2 ${statusColorMap[caseData.status].text}`}>{caseData.status}</span>
                </div>
                <div className='text-xs'>{caseData.practice_area}</div>
            </div>
            <div className="text-sm text-gray-700 line-clamp-3">{caseData.summary}</div>
            <div className='text-xs text-gray-500'>Filling date: {new Date(caseData.filling_date).toLocaleDateString()}</div>
        </div>
    )
}

export default CaseCard