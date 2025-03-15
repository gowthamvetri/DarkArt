import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'

function UploadCategoryModel   ({close})  {
    const[data,setData] = useState({
        name:"",
        image:""
    })
    const handleChange = (e) =>{
        const {name,value} = e.target
        setData((prevData)=>{
            return{
                ...prevData,
                [name]:value
            }
        })
    }
    const handleSubmit = (e) =>{
        e.preventDefault()
        console.log(data)
    }
    const handleUploadCategoryImage = (e) =>{
        const file = e.target.files[0]
        if(!file)
        {
            return;
        }
        // const reader = new FileReader()
        // reader.readAsDataURL(file)
        // reader.onloadend = () =>{
        //     setData((prevData)=>{
        //         return{
        //             ...prevData,
        //             image:reader.result
        //         }
        //     })
        // }
    }
  
  return (
<section className='fixed top-0 bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md flex items-center justify-center'>
<div className='bg-white max-w-4xl w-full p-4 rounded'>
    <div className='flex items-center justify-between'>
        <h1 className='font-semibold text-lg'>
            Category
        </h1>
        <button className='absolute top-2 right-2'>
   <IoClose onClick={close} className='text-2xl text-red-500 cursor-pointer'/>
        </button>
    </div>
    <form className='my-3 grid gap-4 'onSubmit={handleSubmit}>
        <div className='grid gap-1'>
            <label id ='Category Name' className='block text-sm font-semibold'>Category Name</label>
            <input type='text'
            id='categoryName'
             placeholder='Enter Category Name' 
             value={data.name} 
             onChange={(e)=> setData({...data,name:e.target.value})}  
             className='w-full border p-2 rounded bg-blue-50 border-blue-100 focus-within:border-blue-300 outline-none '
             />
        </div>
        
           <div className='grid gap-1'>
            <p>
             Image
            </p>
            <div className='flex gap-4 flex-col  lg:flex-row items-center'>
            <div className='border bg-blue-50 h-52 w-full lg:w-52  flex items-center justify-center rounded'>
<p className='text-sm text-neutral-500'>No Image</p>
            </div>
            <label htmlFor='uploadCategoryImage' className='flex items-center gap-2'>
            <div disabled={!data.name} className={`
            ${!data.name ? 'bg-gray-400' : 'bg-blue-400'}
            p-2 rounded text-white w-full lg:w-52
            `}
            >Upload Image</div>
            <input onChange={handleUploadCategoryImage} type='file'  id ='uploadCategoryImage'  hidden/>
            </label>
            </div>
           </div>
       
    </form>
 
  </div>
    </section>
  )
}

export default UploadCategoryModel
