import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosTostError from '../utils/AxiosTostError';

const UploadSubCategoryModel = ({ close, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: []
  });

  const allCategory = useSelector(state => state.product.allCategory);

  useEffect(() => {
    setSubCategoryData(prev => ({
      ...prev,
      category: []
    }));
  }, [allCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
  
  };

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await uploadImage(file);
      const { data: ImageResponse } = response;

      setSubCategoryData(prev => ({
        ...prev,
        image: ImageResponse?.data?.url || ""
      }));
    } catch (error) {
      AxiosTostError(error);
    }
  };

  const handleRemoveCategorySelected = (categoryId) => {
    setSubCategoryData(prev => ({
      ...prev,
      category: prev.category.filter(el => el._id !== categoryId)
    }));
  };

  const handleCategorySelect = (e) => {
    const value = e.target.value;
    if (!value) return;

    const categoryDetails = allCategory.find(el => el._id === value);

    if (!categoryDetails) return;

    const alreadyExists = subCategoryData.category.some(el => el._id === value);
    if (alreadyExists) return;

    setSubCategoryData(prev => ({
      ...prev,
      category: [...prev.category, categoryDetails]
    }));
  };

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.createSubCategory,
        data: subCategoryData
      });
console.log(response);
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        close?.();
        fetchData?.();
      }
    } catch (error) {
      AxiosTostError(error);
    }
  };
  
  

  const isSubmitDisabled = !subCategoryData.name || !subCategoryData.image || subCategoryData.category.length === 0;

  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='w-full max-w-5xl bg-white p-6 rounded-lg shadow-xl border border-gray-100'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-xl font-bold text-gray-900 font-serif'>Add Sub Category</h1>
          <button 
            onClick={close}
            className='text-gray-400 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100'
          >
            <IoClose size={25} />
          </button>
        </div>

        <form className='my-4 grid gap-6' onSubmit={handleSubmitSubCategory}>
          {/* Name Field */}
          <div className='grid gap-2'>
            <label htmlFor='name' className='font-medium text-gray-700'>Name</label>
            <input
              id='name'
              name='name'
              value={subCategoryData.name}
              onChange={handleChange}
              placeholder='Enter subcategory name'
              className='p-3 bg-gray-50 border border-gray-300 rounded-md outline-none focus:border-black focus:bg-white transition-colors'
            />
          </div>

          {/* Image Upload */}
          <div className='grid gap-2'>
            <label className='font-medium text-gray-700'>Image</label>
            <div className='flex flex-col lg:flex-row items-center gap-4'>
              <div className='border border-gray-300 h-36 w-full lg:w-36 bg-gray-50 flex items-center justify-center rounded-md overflow-hidden'>
                {
                  !subCategoryData.image ? (
                    <p className='text-sm text-gray-400'>No Image</p>
                  ) : (
                    <img
                      alt='subCategory'
                      src={subCategoryData.image}
                      className='w-full h-full object-scale-down'
                    />
                  )
                }
              </div>
              <label htmlFor='uploadSubCategoryImage'>
                <div className='px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer font-medium transition-colors'>
                  Upload Image
                </div>
                <input
                  type='file'
                  id='uploadSubCategoryImage'
                  className='hidden'
                  onChange={handleUploadSubCategoryImage}
                />
              </label>
            </div>
          </div>

          {/* Category Selector */}
          <div className='grid gap-2'>
            <label className='font-medium text-gray-700'>Select Category</label>
            <div className='border border-gray-300 rounded-md focus-within:border-black p-3 bg-gray-50 focus-within:bg-white transition-colors'>
              {/* Selected Values */}
              <div className='flex flex-wrap gap-2 mb-3'>
                {
                  subCategoryData.category.map(cat => (
                    <p key={cat._id} className='bg-gray-100 border border-gray-200 px-3 py-2 flex items-center gap-2 rounded-md text-gray-700'>
                      {cat.name}
                      <button
                        type='button'
                        className='hover:text-red-600 transition-colors'
                        onClick={() => handleRemoveCategorySelected(cat._id)}
                      >
                        <IoClose size={18} />
                      </button>
                    </p>
                  ))
                }
              </div>

              {/* Dropdown */}
              <select
                className='w-full p-2 bg-transparent outline-none border border-gray-300 rounded-md focus:border-black transition-colors'
                onChange={handleCategorySelect}
              >
                <option value="">Select Category</option>
                {
                  allCategory.map(category => (
                    <option value={category._id} key={category._id}>
                      {category.name}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className={`px-6 py-3 rounded-md font-semibold tracking-wide transition-colors
              ${isSubmitDisabled 
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : "bg-black hover:bg-gray-800 text-white"
              }
            `}
            disabled={isSubmitDisabled}
          >
            Add Sub Category
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadSubCategoryModel;
