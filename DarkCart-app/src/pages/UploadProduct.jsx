import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosTostError';
import successAlert from '../utils/SuccessAlert';
import { useEffect } from 'react';

const UploadProduct = () => {
  const [data,setData] = useState({
      name : "",
      image : [],
      category : [],
      subCategory : [],
      unit : "",
      stock : "",
      price : "",
      discount : "",
      description : "",
      more_details : {},
  })
  const [imageLoading,setImageLoading] = useState(false)
  const [ViewImageURL,setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory,setSelectCategory] = useState("")
  const [selectSubCategory,setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField,setOpenAddField] = useState(false)
  const [fieldName,setFieldName] = useState("")


  const handleChange = (e)=>{
    const { name, value} = e.target 

    setData((preve)=>{
      return{
          ...preve,
          [name]  : value
      }
    })
  }

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0]

    if(!file){
      return 
    }
    setImageLoading(true)
    const response = await uploadImage(file)
    const { data : ImageResponse } = response
    const imageUrl = ImageResponse.data.url 

    setData((preve)=>{
      return{
        ...preve,
        image : [...preve.image,imageUrl]
      }
    })
    setImageLoading(false)

  }

  const handleDeleteImage = async(index)=>{
      data.image.splice(index,1)
      setData((preve)=>{
        return{
            ...preve
        }
      })
  }

  const handleRemoveCategory = async(index)=>{
    data.category.splice(index,1)
    setData((preve)=>{
      return{
        ...preve
      }
    })
  }
  const handleRemoveSubCategory = async(index)=>{
      data.subCategory.splice(index,1)
      setData((preve)=>{
        return{
          ...preve
        }
      })
  }

  const handleAddField = ()=>{
    setData((preve)=>{
      return{
          ...preve,
          more_details : {
            ...preve.more_details,
            [fieldName] : ""
          }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    console.log("data",data)

    try {
      const response = await Axios({
          ...SummaryApi.createProduct,
          data : data
      })
      const { data : responseData} = response

      if(responseData.success){
          successAlert(responseData.message)
          setData({
            name : "",
            image : [],
            category : [],
            subCategory : [],
            unit : "",
            stock : "",
            price : "",
            discount : "",
            description : "",
            more_details : {},
          })

      }
    } catch (error) {
        AxiosToastError(error)
    }


  }

  // useEffect(()=>{
  //   successAlert("Upload successfully")
  // },[])
  return (
    <section className='min-h-[75vh] max-h-[75vh] overflow-y-auto bg-gray-50'>
        <div className='p-4 bg-white shadow-md flex items-center justify-between sticky top-0 z-10 border-b border-gray-200'>
            <h2 className='font-bold text-xl text-gray-900 font-serif'>Upload Product</h2>
        </div>
        <div className='p-4'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <form className='grid gap-6' onSubmit={handleSubmit}>
                    <div className='grid gap-2'>
                      <label htmlFor='name' className='font-medium text-gray-700'>Product Name</label>
                      <input 
                        id='name'
                        type='text'
                        placeholder='Enter product name'
                        name='name'
                        value={data.name}
                        onChange={handleChange}
                        required
                        className='bg-gray-50 p-3 outline-none border border-gray-300 focus:border-black focus:bg-white rounded-md transition-colors'
                      />
                    </div>
                    <div className='grid gap-2'>
                      <label htmlFor='description' className='font-medium text-gray-700'>Description</label>
                      <textarea 
                        id='description'
                        type='text'
                        placeholder='Enter product description'
                        name='description'
                        value={data.description}
                        onChange={handleChange}
                        required
                        multiple 
                        rows={3}
                        className='bg-gray-50 p-3 outline-none border border-gray-300 focus:border-black focus:bg-white rounded-md resize-none transition-colors'
                      />
                    </div>
                    <div>
                        <p className='font-medium text-gray-700 mb-3'>Product Images</p>
                        <div>
                          <label htmlFor='productImage' className='bg-gray-50 h-24 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors'>
                              <div className='text-center flex justify-center items-center flex-col'>
                                {
                                  imageLoading ?  <Loading/> : (
                                    <>
                                       <FaCloudUploadAlt size={35} className='text-gray-500'/>
                                       <p className='text-gray-600 font-medium'>Upload Images</p>
                                    </>
                                  )
                                }
                              </div>
                              <input 
                                type='file'
                                id='productImage'
                                className='hidden'
                                accept='image/*'
                                onChange={handleUploadImage}
                              />
                          </label>
                          {/**display uploded image*/}
                          <div className='flex flex-wrap gap-3 mt-3'>
                            {
                              data.image.map((img,index) =>{
                                  return(
                                    <div key={img+index} className='h-20 w-20 min-w-20 bg-gray-50 border border-gray-200 rounded-md relative group overflow-hidden'>
                                      <img
                                        src={img}
                                        alt={img}
                                        className='w-full h-full object-scale-down cursor-pointer' 
                                        onClick={()=>setViewImageURL(img)}
                                      />
                                      <div onClick={()=>handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-700 rounded-tl-md text-white hidden group-hover:block cursor-pointer transition-colors'>
                                        <MdDelete size={14}/>
                                      </div>
                                    </div>
                                  )
                              })
                            }
                          </div>
                        </div>

                    </div>
                    <div className='grid gap-2'>
                      <label className='font-medium text-gray-700'>Category</label>
                      <div>
                        <select
                          className='bg-gray-50 border border-gray-300 w-full p-3 rounded-md focus:border-black focus:bg-white transition-colors'
                          value={selectCategory}
                          onChange={(e)=>{
                            const value = e.target.value 
                            const category = allCategory.find(el => el._id === value )
                            
                            setData((preve)=>{
                              return{
                                ...preve,
                                category : [...preve.category,category],
                              }
                            })
                            setSelectCategory("")
                          }}
                        >
                          <option value={""}>Select Category</option>
                          {
                            allCategory.map((c,index)=>{
                              return(
                                <option key={c._id} value={c?._id}>{c.name}</option>
                              )
                            })
                          }
                        </select>
                        <div className='flex flex-wrap gap-2 mt-3'>
                          {
                            data.category.map((c,index)=>{
                              return(
                                <div key={c._id+index+"productsection"} className='text-sm flex items-center gap-2 bg-gray-100 border border-gray-300 px-3 py-1 rounded-md'>
                                  <p className='text-gray-700'>{c.name}</p>
                                  <div className='hover:text-red-500 cursor-pointer transition-colors' onClick={()=>handleRemoveCategory(index)}>
                                    <IoClose size={16}/>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    </div>
                    <div className='grid gap-2'>
                      <label className='font-medium text-gray-700'>Sub Category</label>
                      <div>
                        <select
                          className='bg-gray-50 border border-gray-300 w-full p-3 rounded-md focus:border-black focus:bg-white transition-colors'
                          value={selectSubCategory}
                          onChange={(e)=>{
                            const value = e.target.value 
                            const subCategory = allSubCategory.find(el => el._id === value )

                            setData((preve)=>{
                              return{
                                ...preve,
                                subCategory : [...preve.subCategory,subCategory]
                              }
                            })
                            setSelectSubCategory("")
                          }}
                        >
                          <option value={""} className='text-gray-600'>Select Sub Category</option>
                          {
                            allSubCategory.map((c,index)=>{
                              return(
                                <option key={c._id} value={c?._id}>{c.name}</option>
                              )
                            })
                          }
                        </select>
                        <div className='flex flex-wrap gap-2 mt-3'>
                          {
                            data.subCategory.map((c,index)=>{
                              return(
                                <div key={c._id+index+"productsection"} className='text-sm flex items-center gap-2 bg-gray-100 border border-gray-300 px-3 py-1 rounded-md'>
                                  <p className='text-gray-700'>{c.name}</p>
                                  <div className='hover:text-red-500 cursor-pointer transition-colors' onClick={()=>handleRemoveSubCategory(index)}>
                                    <IoClose size={16}/>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    </div>

                    <div className='grid gap-2'>
                      <label htmlFor='unit' className='font-medium text-gray-700'>Unit</label>
                      <input 
                        id='unit'
                        type='text'
                        placeholder='Enter product unit (e.g., piece, kg, liter)'
                        name='unit'
                        value={data.unit}
                        onChange={handleChange}
                        required
                        className='bg-gray-50 p-3 outline-none border border-gray-300 focus:border-black focus:bg-white rounded-md transition-colors'
                      />
                    </div>

                    <div className='grid gap-2'>
                      <label htmlFor='stock' className='font-medium text-gray-700'>Stock Quantity</label>
                      <input 
                        id='stock'
                        type='number'
                        placeholder='Enter available stock quantity'
                        name='stock'
                        value={data.stock}
                        onChange={handleChange}
                        required
                        className='bg-gray-50 p-3 outline-none border border-gray-300 focus:border-black focus:bg-white rounded-md transition-colors'
                      />
                    </div>

                    <div className='grid gap-2'>
                      <label htmlFor='price' className='font-medium text-gray-700'>Price (₹)</label>
                      <input 
                        id='price'
                        type='number'
                        placeholder='Enter product price'
                        name='price'
                        value={data.price}
                        onChange={handleChange}
                        required
                        className='bg-gray-50 p-3 outline-none border border-gray-300 focus:border-black focus:bg-white rounded-md transition-colors'
                      />
                    </div>

                    <div className='grid gap-2'>
                      <label htmlFor='discount' className='font-medium text-gray-700'>Discount (%)</label>
                      <input 
                        id='discount'
                        type='number'
                        placeholder='Enter discount percentage'
                        name='discount'
                        value={data.discount}
                        onChange={handleChange}
                        required
                        className='bg-gray-50 p-3 outline-none border border-gray-300 focus:border-black focus:bg-white rounded-md transition-colors'
                      />
                    </div>


                    {/**add more field**/}
                      {
                        Object?.keys(data?.more_details)?.map((k,index)=>{
                            return(
                              <div key={k+index} className='grid gap-2'>
                                <label htmlFor={k} className='font-medium text-gray-700'>{k}</label>
                                <input 
                                  id={k}
                                  type='text'
                                  value={data?.more_details[k]}
                                  onChange={(e)=>{
                                      const value = e.target.value 
                                      setData((preve)=>{
                                        return{
                                            ...preve,
                                            more_details : {
                                              ...preve.more_details,
                                              [k] : value
                                            }
                                        }
                                      })
                                  }}
                                  required
                                  className='bg-gray-50 p-3 outline-none border border-gray-300 focus:border-black focus:bg-white rounded-md transition-colors'
                                />
                              </div>
                            )
                        })
                      }

                    <div onClick={()=>setOpenAddField(true)} className='hover:bg-gray-200 bg-gray-100 py-2 px-4 w-fit text-center font-medium border border-gray-300 hover:text-gray-900 cursor-pointer rounded-md transition-colors'>
                      Add Custom Fields
                    </div>

                    <button
                      className='bg-black hover:bg-gray-800 text-white py-3 rounded-md font-semibold tracking-wide transition-colors'
                    >
                      Upload Product
                    </button>
                </form>
            </div>
        </div>

        {
          ViewImageURL && (
            <ViewImage url={ViewImageURL} close={()=>setViewImageURL("")}/>
          )
        }

        {
          openAddField && (
            <AddFieldComponent 
              value={fieldName}
              onChange={(e)=>setFieldName(e.target.value)}
              submit={handleAddField}
              close={()=>setOpenAddField(false)} 
            />
          )
        }
    </section>
  )
}

export default UploadProduct