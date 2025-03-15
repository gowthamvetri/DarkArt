import React, { useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'

function CategoryPage() {
    const[openUploadCategory,setOpenUploadCategory] = useState(false)
  return (
   <section>
    <div className='p-2 font-semibold bg-white shadow-md flex items-center justify-between'>
<h2 className='font-light'>Catgeory</h2>
<button onClick={()=> setOpenUploadCategory(true)}
 className='text-cyan-100 font-stretch-110% border-b-blue-400 hover:bg-blue-400 px-3 py-1 rounded-md '>
    Add Cateogry
</button>
    </div>
    {
        openUploadCategory &&(
        
        <UploadCategoryModel close={() => setOpenUploadCategory(false)}/>
        )
    }
   
   </section>
  )
}

export default CategoryPage
