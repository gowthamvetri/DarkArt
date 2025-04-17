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
    console.log(subCategoryData)
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
    console.log(value)
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
        data: {
          name:subCategoryData.name,
          image:subCategoryData.image,
          category : subCategoryData.category
        }
      });
      console.log(response)

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
  console.log(subCategoryData);
  console.log(allCategory);
  

  const isSubmitDisabled = !subCategoryData.name || !subCategoryData.image || subCategoryData.category.length === 0;

  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50'>
      <div className='w-full max-w-5xl bg-white p-4 rounded shadow-lg'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-semibold'>Add Sub Category</h1>
          <button onClick={close}>
            <IoClose size={25} />
          </button>
        </div>

        <form className='my-4 grid gap-4' onSubmit={handleSubmitSubCategory}>
          {/* Name Field */}
          <div className='grid gap-1'>
            <label htmlFor='name'>Name</label>
            <input
              id='name'
              name='name'
              value={subCategoryData.name}
              onChange={handleChange}
              className='p-3 bg-blue-50 border rounded outline-none focus:border-primary-200'
            />
          </div>

          {/* Image Upload */}
          <div className='grid gap-1'>
            <label>Image</label>
            <div className='flex flex-col lg:flex-row items-center gap-3'>
              <div className='border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center'>
                {
                  !subCategoryData.image ? (
                    <p className='text-sm text-neutral-400'>No Image</p>
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
                <div className='px-4 py-1 border border-primary-100 text-primary-200 rounded hover:bg-primary-200 hover:text-neutral-900 cursor-pointer'>
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
          <div className='grid gap-1'>
            <label>Select Category</label>
            <div className='border rounded focus-within:border-primary-200 p-2'>
              {/* Selected Values */}
              <div className='flex flex-wrap gap-2 mb-2'>
                {
                  subCategoryData.category.map(cat => (
                    <p key={cat._id} className='bg-white shadow px-2 py-1 flex items-center gap-2 rounded'>
                      {cat.name}
                      <button
                        type='button'
                        className='hover:text-red-600'
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
                className='w-full p-2 bg-transparent outline-none border'
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
            className={`px-4 py-2 border rounded font-semibold transition-colors
              ${isSubmitDisabled ? "bg-gray-200 cursor-not-allowed" : "bg-primary-200 hover:bg-primary-100"}
            `}
            disabled={isSubmitDisabled}
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadSubCategoryModel;
