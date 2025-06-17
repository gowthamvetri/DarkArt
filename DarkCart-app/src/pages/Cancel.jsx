import React from 'react'
import { useNavigate } from 'react-router-dom';

const Cancel = () => {
    const navigate = useNavigate();
  return (
    <div>
        <div className='mt-5 w-full max-w-md bg-red-200 p-4 rounded mx-auto py-5 flex flex-col gap-4 items-center justify-center'>
        <p className='text-red-800 font-semibold text-center text-lg'>Order Cancel</p>
        <button onClick={() => navigate("/")} className='text-red-800 border-2 border-red-800 px-2 py-1 hover:bg-red-800 hover:text-white'>Go to Home</button>
    </div>
    </div>
  )
}

export default Cancel