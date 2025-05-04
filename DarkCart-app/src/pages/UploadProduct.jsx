import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import UploadImage from "../utils/UploadImage";
import Loading from "../components/Loading"
import ViewImage from "../components/ViewImage"
import { MdDelete } from "react-icons/md";

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: [],
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });
  const [loading,setLoading] = useState(false);
  const [viewImageUrl,setViewImageUrl] = useState("");

  const handleChange = (e) => {
    
    const { name } = e.target;
    setData({
      ...data,
      [name]: e.target.value,
    });
  };

  const handleImgChange = async (e) => {
    setLoading(true);
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const response = await UploadImage(file);
    const { data: ImageResponse } = response;
    const url = ImageResponse.data.secure_url;

    setData({
      ...data,
      image: [...data.image,url]
    })
    setLoading(false)
  };

  const handleDelete = (ind)=>{
    data.image.splice(ind-1,1)
    
    setData({
      ...data,
      image:[...data.image]
    })
  }
  
  return (
    <section>
      <div className="p-2 font-semibold bg-white shadow-md flex items-center justify-between">
        <h2 className="font-light">Catgeory</h2>
      </div>
      <div className="flex flex-col p-4">
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Enter the product name"
              value={data.name}
              onChange={handleChange}
              name="name"
              id="name"
              required
              className="bg-blue-50 p-2 focus-within:outline-yellow-300 border-1 border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              placeholder="Enter the product description"
              value={data.description}
              onChange={handleChange}
              name="description"
              id="description"
              required
              rows={3}
              className="bg-blue-50 p-2 focus-within:outline-yellow-300 border-1 border-gray-300 rounded resize-none"
            />
          </div>

          <div>
            <p>Image</p>
            <div>
              <label className="bg-blue-50 h-28 rounded border border-gray-300 flex items-center justify-center cursor-pointer">
                <div className="flex flex-col items-center text-slate-600/70">
                  <FaCloudUploadAlt className="text-6xl " />
                  {loading ? <Loading/>:<p>Upload Image</p>}
                </div>
                <input
                  type="file"
                  id="img"
                  className="hidden"
                  onChange={handleImgChange}
                  accept="image/*"
                />
              </label>
            </div>
            {/* display images */}
            <div className="flex gap-2">
              {data.image.map((img, index) => {
                return (
                  <div key={img + index} className="w-20 h-20 my-2  border border-gray-300 cursor-pointer relative group ">
                    <img
                      src={img}
                      alt={img}
                      className="w-full h-full object-scale-down group-hover:bg-black/5 group-hover:blur-xs"
                      onClick={()=>setViewImageUrl(img)}
                    />
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 hidden group-hover:block">
                      <MdDelete className="text-2xl text-red-600 cursor-pointer" onClick={()=>handleDelete(index+1)}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </form>
      </div>


      {
        viewImageUrl && (
          <ViewImage url={viewImageUrl} close={()=>setViewImageUrl("")}/>
        )
      }

    </section>
  );
};

export default UploadProduct;
