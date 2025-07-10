import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';
import AxiosTostError from '../utils/AxiosTostError';

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [selectCategory, setSelectCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const allCategory = useSelector(state => state.product.allCategory);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageLoading(true);
    try {
      const response = await uploadImage(file);
      const { data: ImageResponse } = response;
      setData(prev => ({
        ...prev,
        image: [...prev.image, ImageResponse.data.url]
      }));
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...data.image];
    updatedImages.splice(index, 1);
    setData(prev => ({
      ...prev,
      image: updatedImages
    }));
  };

  const handleRemoveCategory = (index) => {
    const updatedCategories = [...data.category];
    updatedCategories.splice(index, 1);
    setData(prev => ({
      ...prev,
      category: updatedCategories
    }));
  };

  const handleAddField = () => {
    setData(prev => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: ""
      }
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.createProduct,
        data: data
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        // Reset form
        setData({
          name: "",
          image: [],
          category: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosTostError(error);
    }
  };

  return (
    <section className='bg-white'>
      <div className='container mx-auto p-4'>
        <form className='grid p-4' onSubmit={handleSubmit}>
          <div className='grid gap-2'>
            <label htmlFor='name' className='font-medium'>Name</label>
            <input
              id='name'
              type='text'
              placeholder='Enter product name'
              name='name'
              value={data.name}
              onChange={handleChange}
              required
              className='bg-gray-50 border border-gray-300 p-2 rounded focus:outline-none focus:border-primary-200'
            />
          </div>

          <div className='grid gap-2'>
            <label htmlFor='description' className='font-medium'>Description</label>
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
              className='bg-gray-50 border border-gray-300 p-2 rounded resize-none focus:outline-none focus:border-primary-200'
            />
          </div>

          <div>
            <p className='font-medium'>Image</p>
            <div>
              <label htmlFor='productImage'>
                <div className='h-24 bg-gray-50 border border-gray-300 rounded flex items-center justify-center cursor-pointer'>
                  <div className='text-center flex justify-center items-center flex-col'>
                    {imageLoading ? (
                      <div>Loading...</div>
                    ) : (
                      <>
                        <div>Upload Image</div>
                        <p className='text-sm'>*ratio 1:1 square recommended</p>
                      </>
                    )}
                  </div>
                </div>
                <input
                  type='file'
                  id='productImage'
                  className='hidden'
                  accept='image/*'
                  onChange={handleUploadImage}
                />
              </label>
              <div className='flex flex-wrap gap-4'>
                {data.image.map((img, index) => (
                  <div key={img + index} className='h-20 mt-1 w-20 min-w-20 bg-gray-50 border relative group'>
                    <img
                      src={img}
                      alt={img}
                      className='w-full h-full object-scale-down cursor-pointer'
                    />
                    <div
                      onClick={() => handleDeleteImage(index)}
                      className='absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer'
                    >
                      <IoClose />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='grid gap-2'>
            <label className='font-medium'>Category</label>
            <div>
              <select
                className='bg-gray-50 border border-gray-300 w-full p-2 rounded focus:outline-none focus:border-primary-200'
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const category = allCategory.find(el => el._id === value);
                  
                  setData(prev => ({
                    ...prev,
                    category: [...prev.category, category],
                  }));
                  setSelectCategory("");
                }}
              >
                <option value={""}>Select Category</option>
                {allCategory.map((c, index) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <div className='flex flex-wrap gap-2 mt-3'>
                {data.category.map((c, index) => (
                  <div key={c._id + index + "productsection"} className='text-sm flex items-center gap-1 bg-gray-100 p-1 rounded'>
                    <p>{c.name}</p>
                    <div className='hover:text-red-500 cursor-pointer' onClick={() => handleRemoveCategory(index)}>
                      <IoClose size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='grid gap-2'>
            <label htmlFor='unit' className='font-medium'>Unit</label>
            <input
              id='unit'
              type='text'
              placeholder='Enter product unit'
              name='unit'
              value={data.unit}
              onChange={handleChange}
              required
              className='bg-gray-50 border border-gray-300 p-2 rounded focus:outline-none focus:border-primary-200'
            />
          </div>

          <div className='grid gap-2'>
            <label htmlFor='stock' className='font-medium'>Number of Stock</label>
            <input
              id='stock'
              type='number'
              placeholder='Enter product stock'
              name='stock'
              value={data.stock}
              onChange={handleChange}
              required
              className='bg-gray-50 border border-gray-300 p-2 rounded focus:outline-none focus:border-primary-200'
            />
          </div>

          <div className='grid gap-2'>
            <label htmlFor='price' className='font-medium'>Price</label>
            <input
              id='price'
              type='number'
              placeholder='Enter product price'
              name='price'
              value={data.price}
              onChange={handleChange}
              required
              className='bg-gray-50 border border-gray-300 p-2 rounded focus:outline-none focus:border-primary-200'
            />
          </div>

          <div className='grid gap-2'>
            <label htmlFor='discount' className='font-medium'>Discount</label>
            <input
              id='discount'
              type='number'
              placeholder='Enter product discount'
              name='discount'
              value={data.discount}
              onChange={handleChange}
              className='bg-gray-50 border border-gray-300 p-2 rounded focus:outline-none focus:border-primary-200'
            />
          </div>

          <div>
            <div className='flex items-center gap-3'>
              <label className='font-medium'>More Details</label>
              <button
                type='button'
                onClick={() => setOpenAddField(true)}
                className='bg-black text-white p-1 rounded hover:bg-gray-800'
              >
                Add Field
              </button>
            </div>
            <div className='grid gap-2'>
              {Object.entries(data.more_details).map(([key, value], index) => (
                <div key={index} className='grid gap-1'>
                  <label htmlFor={key}>{key}</label>
                  <input
                    id={key}
                    type='text'
                    value={value}
                    onChange={(e) => {
                      const value = e.target.value;
                      setData(prev => ({
                        ...prev,
                        more_details: {
                          ...prev.more_details,
                          [key]: value
                        }
                      }));
                    }}
                    className='bg-gray-50 border border-gray-300 p-2 rounded focus:outline-none focus:border-primary-200'
                  />
                </div>
              ))}
            </div>
          </div>

          <button className='bg-black hover:bg-gray-800 text-white py-2 rounded my-3 font-semibold'>
            Submit
          </button>
        </form>
      </div>

      {openAddField && (
        <section className='fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
          <div className='bg-white p-4 w-full max-w-md rounded'>
            <div className='flex items-center justify-between gap-4'>
              <h1 className='font-semibold'>Add Field</h1>
              <button onClick={() => setOpenAddField(false)}>
                <IoClose size={25} />
              </button>
            </div>
            <input
              className='bg-gray-50 border border-gray-300 p-2 rounded w-full my-3 focus:outline-none focus:border-primary-200'
              placeholder='Enter field name'
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            />
            <button
              onClick={handleAddField}
              className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800'
            >
              Add Field
            </button>
          </div>
        </section>
      )}
    </section>
  );
};

export default UploadProduct;