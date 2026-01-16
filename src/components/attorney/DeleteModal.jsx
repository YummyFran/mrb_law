import React from 'react'

const DeleteModal = ({ text, onClose, onDelete }) => {
  return (
    <div className='fixed inset-0 bg-black/30 grid place-items-center' onClick={onClose}>
        <div className='bg-white w-100 absolute px-6 py-4 rounded-lg flex flex-col gap-6'>
            <p className='text-lg'>{text}</p>

            <div className='flex justify-end gap-2'>
                <button className='px-4 py-3 rounded-lg cursor-pointer hover:brightness-95 bg-gray-200' onClick={onclose}>Cancel</button>
                <button className='px-4 py-3 rounded-lg cursor-pointer hover:brightness-95 bg-red-500 text-white' onClick={onDelete}>Yes, delete</button>
            </div>
        </div>
    </div>
  )
}

export default DeleteModal