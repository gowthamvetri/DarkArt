import React from "react";
import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/UploadImage";
import Axios from "../utils/Axios";
import { MdDelete } from "react-icons/md";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddFieldComponent from "../components/AddFieldComponent";

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });

  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageUrl, setViewImageUrl] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const allSubCategory = useSelector((state) => state.product.allSubCategory);

  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageLoading(true);
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    const imageUrl = ImageResponse.data.url;

    setData((preve) => {
      return {
        ...preve,
        image: [...preve.image, imageUrl], // Store multiple images in an array
      };
    });
    setImageLoading(false);
  };
  const handleDelete = async (index) => {
    data.image.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };
  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };
  // Removed duplicate handleRemoveSubCategory function
  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1);
    setData((preve) => {
      return {
        ...preve,
      };
    });
  };

  const handleAddField = () => {
    setData((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: "",
        },
      };
    });
    setFieldName("");
    setOpenAddField(false);
  };
  const handleSubmit =(e)=>{
    e.preventDefault()
    console.log(data
    )
  }
  return (
    <section className="">
      <div className="p-2 font-semibold bg-white shadow-md flex items-center justify-between">
        <h2 className="font-light">Upload Product</h2>
      </div>

      <div className="grid p-3">
        <form className="grid gap-4 "onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name" className="font-medium">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter a product name"
              name="name"
              value={data.name}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-blue-300 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="description"className="font-medium">Description</label>
            <textarea
              type="text"
              id="description"
              placeholder="Enter a product description"
              name="description"
              value={data.description}
              onChange={handleChange}
              required
              multiple
              row={2}
              className="bg-blue-50 p-2 outline-none border focus-within:border-blue-300 rounded resize-none"
            />
          </div>
          <div>
            <p className="font-medium">Image</p>
            <div>
              <label
                htmlFor="ProductImage"
                className="bg-blue-100 h-24 p-2 outline-none flex justify-center border focus-within:border-blue-300 rounded cursor-pointer"
              >
                <div className=" text-center flex flex-col items-center justify-center">
                  {imageLoading ? (
                    <Loading />
                  ) : (
                    <>
                      <FaCloudUploadAlt
                        className="text-4xl text-blue-400"
                        size={35}
                      />
                      <p>Upload Image</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id="ProductImage"
                  name="image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadImage}
                />
              </label>
              {/** display float image */}
              <div className="my-2 flex flex-wrap gap-4">
                {data.image.map((img, index) => {
                  return (
                    <div
                      key={img + index}
                      className="w-20 h-20 min-w-20 bg-blue-50 border relative group"
                    >
                      <img
                        src={img}
                        alt={`Product Image ${index + 1}`}
                        className="w-full h-full object-scale-down cursor-pointer"
                        onClick={() => setViewImageUrl(img)}
                      />
                      <div
                        onClick={() => handleDelete(index)}
                        className="absolute p-1 ml-13.5 bottom-0 bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded  hidden group-hover:block"
                      >
                        <MdDelete />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label className="font-medium">Category</label>
            <div>
              <select
                className="bg-blue-50 p-2  w-full outline-none border focus-within:border-blue-300 rounded"
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const category = allCategory.find((el) => el._id === value);
                  console.log(category);
                  setData((preve) => {
                    return {
                      ...preve,
                      category: [...preve.category, category],
                    };
                  });
                  setSelectCategory("");
                }}
              >
                <option value={""}>Select Category</option>
                {allCategory.map((c, index) => {
                  return <option value={c?._id}>{c.name}</option>;
                })}
              </select>
              <div className="flex flex-wrap gap-3">
                {data.category.map((c, index) => {
                  return (
                    <div
                      key={c._id + index + "productsection"}
                      className="text-sm flex items-center gap-1 bg-blue-50 mt-2"
                    >
                      <p>{c.name}</p>
                      <div
                        className="hover:text-red-500 cursor-pointer"
                        onClick={() => handleRemoveCategory(index)}
                      >
                        <IoClose size={20} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label className="font-medium">Sub Category</label>
            <div>
              <select
                className="bg-blue-50 p-2  w-full outline-none border focus-within:border-blue-300 rounded"
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const subCategory = allSubCategory.find(
                    (el) => el._id === value
                  );

                  setData((preve) => {
                    return {
                      ...preve,
                      subCategory: [...preve.subCategory, subCategory],
                    };
                  });
                  setSelectSubCategory("");
                }}
              >
                <option value={""} className="text-neutral-600">
                  Select Sub Category
                </option>
                {allSubCategory.map((c, index) => {
                  return <option value={c?._id}>{c.name}</option>;
                })}
              </select>
              <div className="flex flex-wrap gap-3">
                {data.subCategory.map((c, index) => {
                  return (
                    <div
                      key={c._id + index + "productsection"}
                      className="text-sm flex items-center gap-1 bg-blue-50 mt-2"
                    >
                      <p>{c.name}</p>
                      <div
                        className="hover:text-red-500 cursor-pointer"
                        onClick={() => handleRemoveSubCategory(index)}
                      >
                        <IoClose size={20} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="unit"className="font-medium">Unit</label>
            <input
              type="text"
              id="unit"
              placeholder="Enter a product unit"
              name="unit"
              value={data.unit}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-blue-300 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="unit"className="font-medium">Number of Stock</label>
            <input
              type="number"
              id="stock"
              placeholder="Enter a product stock"
              name="stock"
              value={data.stock}
              onChange={handleChange}
              required
              min="0"
              step="1"
              className="bg-blue-50 p-2 outline-none border focus-within:border-blue-300 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="price" className="font-medium">Enter a product Price</label>
            <input
              type="number"
              id="price"
              placeholder="Enter a product price"
              name="price"
              value={data.price}
              onChange={handleChange}
              required
              min="0"
              step="1"
              className="bg-blue-50 p-2 outline-none border focus-within:border-blue-300 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="discount">Discount</label>
            <input
              type="number"
              id="discount"
              placeholder="Enter a product discount "
              name="discount"
              value={data.discount} 
              onChange={handleChange}
              required
              min="0"
              step="1"
              className="bg-blue-50 p-2 outline-none border focus-within:border-blue-300 rounded"
            />
          </div>
          {/**add more field **/}
          
            {
              Object?.keys(data?.more_details)?.map((k, index) => {
                return (
                  <div key={index} className="grid gap-1">
                    <label htmlFor={k}>{k}</label>
                    <input
                      type="text"
                      id={k}
                      placeholder={`Enter ${k}`}
                      name={k}
                      value={data?.more_details[k]}
                      onChange={(e) =>{
                        const value = e.target.value;
                        setData((preve)=>{
                          return{
                            ...preve,
                            more_details: {
                              ...preve.more_details,
                              [k]: value
                            }}
                          
                        })
                      }}
                     
                      required
                      className="bg-blue-50 p-2 outline-none border focus-within:border-blue-300 rounded"
                    />
                 </div> 
                );
              })
            }
        
          <div
            onClick={() => setOpenAddField(true)}
            className="inline-block bg-blue-200 hover:bg-white py-1 px-3 w-32 text-center font-semibold border border-blue-200 hover:text-neutral-900 rounded-3xl cursor-pointer"
          >
            Add Field
          </div>

          <button
          className="bg-blue-100 hover:bg-blue-200 py-2 rounded font-semibold">
            Submit
          </button>
        </form>
      </div>
      {ViewImageUrl && (
        <ViewImage url={ViewImageUrl} close={() => setViewImageUrl("")} />
      )}
      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
          close={() => setOpenAddField(false)}
        />
      )}
    </section>
  );
};

export default UploadProduct;
