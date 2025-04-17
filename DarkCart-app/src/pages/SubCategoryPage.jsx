import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosTostError from '../utils/AxiosTostError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
const SubCategoryPage = () => {
  const [openAddSubCategory,setOpenAddSubCategory]=useState(false)
  const [data,setData]=useState([])
  const [loading,setLoading]=useState(false)

  const fetchSubCategory=  async() => {
    try{
      setLoading(true)
      console.log("subdata",data)
        const response = await Axios({
          ...SummaryApi.getSubCategory
        })
        const {data:responseData} = response
        if(responseData.success){
          setData(responseData.data)
        }
       
    }
    catch(error){
      AxiosTostError(error)
    }
    finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchSubCategory()
  }, [])
  console.log("subdata",data)
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
