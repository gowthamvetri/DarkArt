import React from "react";
import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/UploadImage";
import Axios from "../utils/Axios";
import {MdDelete} from "react-icons/md";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { useEffect } from "react";

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

  return (
    <section className="">
      <div className="p-2 font-semibold bg-white shadow-md flex items-center justify-between">
        <h2 className="font-light">Upload Product</h2>
      </div>

      <div className="grid p-3">
        <form className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="name">Name</label>
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
            <label htmlFor="description">Description</label>
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
            <p>Image</p>
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
              <div className="my-2 ">
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
                      <div className="absolute p-1 ml-13.5 bottom-0 bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded  hidden group-hover:block">
<MdDelete/>
                        </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </form>
      </div>
      {
        ViewImageUrl && (
          <ViewImage url ={ViewImageUrl} close={()=>setViewImageUrl("")} />
        )
      }
    </section>
  );
};

export default UploadProduct;
