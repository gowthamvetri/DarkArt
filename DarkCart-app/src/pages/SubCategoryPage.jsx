import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
const SubCategoryPage = () => {
  const [openAddSubCategory,setOpenAddSubCategory]=useState(false)
  return (
    <section className=''>
    <div className='p-2   bg-white shadow-md flex items-center justify-between'>
        <h2 className='font-semibold'>Sub Category</h2>
        <button onClick={()=>setOpenAddSubCategory(true)} className='text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded'>Add Sub Category</button>
    </div>
    {
          openAddSubCategory && (
            <UploadSubCategoryModel 
              close={()=>setOpenAddSubCategory(false)}
              
            />
          )
        }


    </section>
  )
}

export default SubCategoryPage
