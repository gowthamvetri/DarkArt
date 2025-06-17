import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Success = () => {

    const loaction = useLocation();
    const det = loaction.state?.text || "Payment";
    const navigate = useNavigate();
  return (
    <div className='mt-5 w-full max-w-md bg-green-200 p-4 rounded mx-auto py-5 flex flex-col gap-4 items-center justify-center'>
        <p className='text-green-800 font-semibold text-center text-lg'>{det} Successful</p>
        <button onClick={() => navigate("/")} className='text-green-800 border-2 border-green-800 px-2 py-1 hover:bg-green-800 hover:text-white'>Go to Home</button>
    </div>
  )
}

export default Success