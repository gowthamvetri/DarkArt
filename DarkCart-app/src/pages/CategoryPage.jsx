import React, { useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import SummaryApi from '../common/SummaryApi'
import { useEffect } from 'react'
import Loading from '../components/Loading'
import AnimatedImage from '../components/NoData'
import Axios from '../utils/Axios'
function CategoryPage() {
    const[openUploadCategory,setOpenUploadCategory] = useState(false)
    const [loading,setLoading] = useState(false)

    const [categoryData,setCategoryData] = useState([])
    const fetchCategory = async()=>{
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory
            })
            const { data : responseData } = response

            if(responseData.success){
                setCategoryData(responseData.data)
            }
        } catch (error) {
            
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchCategory()
    },[])

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
        !categoryData[0] && !loading && (
          <AnimatedImage/>
        )
    }

<div className='p-4 grid  grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>
{
     categoryData.map((category,index)=>{
        return(
            <div className='w-32 h-56 rounded shadow-md' key={category._id}>
                <img 
                    alt={category.name}
                    src={category.image}
                    className='w-full object-scale-down'
                />
            </div>
        );
    })
}
</div>

{
    loading  && (
        <Loading/>
    )
}




    {
        openUploadCategory &&(
        
            <UploadCategoryModel fetchData={fetchCategory} close={()=>setOpenUploadCategory(false)}/>
        )
    }
   
   </section>
  )
}

export default CategoryPage
