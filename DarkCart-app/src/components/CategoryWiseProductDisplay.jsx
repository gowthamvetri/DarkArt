// import React from "react";
// import { Link } from "react-router-dom";
// import AxiosTostError from "../utils/AxiosTostError";
// import SummaryApi from "../common/SummaryApi";
// import { useState } from "react";
// import { useEffect } from "react";
// import Axios from "../utils/Axios";
// import CardLoading from "./CardLoading";
// import { useRef } from "react";
// import { useSelector } from "react-redux";
// import CardProduct from "./CardProduct";
// import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
// function CategoryWiseProductDisplay({ id, name }) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const loadingCardNumber = new Array(6).fill(null)
//   const containerRef = useRef()

//   const fetchCategoryWiseProduct = async () => {
//     try {
//       setLoading(true);
//       const response = await Axios({
//         ...SummaryApi.getProductByCategory,
//         data: {
//             id: [id],
//         },
//       });

//       const { data: responseData } = response
// console.log(responseData)
//             if (responseData.success) {
//                 setData(responseData.data)
//             }
//         } catch (error) {
//             AxiosTostError(error)
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         fetchCategoryWiseProduct()
//     }, [])
//     const handleScrollRight = () => {
//         containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//       };

//       const handleScrollLeft = () => {
//         containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//       };

//   return (
//     <div>
//       <div>
//         <div className="container mx-auto p-4 flex items-center justify-between gap-4">
//           <h3 className="font-semibold text-lg md:text-xl">{name}</h3>
//           <Link className="text-green-600 hover:text-green-400">See All</Link>
//         </div>
//       </div>
//       <div className='relative flex items-center '>
//                 <div className=' flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth' ref={containerRef}>
//                     {loading &&
//                         loadingCardNumber.map((_, index) => {
//                             return (
//                                 <CardLoading key={"CategorywiseProductDisplay123" + index} />
//                             )
//                         })
//                     }

//                     {
//                         data.map((p, index) => {
//                             return (
//                                 <CardProduct
//                                     data={p}
//                                     key={p._id + "CategorywiseProductDisplay" + index}
//                                 />
//                             )
//                         })
//                     }
//                   <div className='w-full left-0 right-0 container mx-auto  px-2  absolute hidden lg:flex justify-between'>
//                     <button onClick={handleScrollLeft} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full'>
//                         <FaAngleLeft />
//                     </button>
//                     <button onClick={handleScrollRight} className='z-10 relative  bg-white hover:bg-gray-100 shadow-lg p-2 text-lg rounded-full'>
//                         <FaAngleRight />
//                     </button>
//                 </div>

//                 </div>
//                 </div>
//     </div>
//   );
// }

// export default CategoryWiseProductDisplay;
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AxiosTostError from "../utils/AxiosTostError";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

function CategoryWiseProductDisplay({ id, name }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingCardNumber = new Array(6).fill(null);
  const containerRef = useRef();

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: [id],
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryWiseProduct();
  }, []);

  const handleScrollRight = () => {
    containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleScrollLeft = () => {
    containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  return (
    <div className="relative bg-white py-6">
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-bold text-xl md:text-2xl text-gray-900 font-serif">{name}</h3>
        <Link className="text-black hover:text-gray-600 font-medium tracking-wide transition-colors">See All</Link>
      </div>

      {/* Scrollable Product Cards */}
      <div className="relative">
        <div
          className="flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-auto scroll-smooth no-scrollbar"
          ref={containerRef}
        >
          {loading &&
            loadingCardNumber.map((_, index) => (
              <div key={"CategorywiseProductDisplay123" + index} className="flex-shrink-0">
                <div className="w-48 h-80 sm:w-52 sm:h-84 md:w-56 md:h-88 lg:w-64 lg:h-96">
                  <CardLoading />
                </div>
              </div>
            ))}

          {data.map((p, index) => (
            <div key={p._id + "CategorywiseProductDisplay" + index} className="flex-shrink-0">
              <div className="w-48 h-80 sm:w-52 sm:h-84 md:w-56 md:h-88 lg:w-64 lg:h-96">
                <CardProduct data={p} />
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
          <button
            onClick={handleScrollLeft}
            className="z-10 bg-white hover:bg-gray-100 shadow-lg text-gray-700 hover:text-black p-3 rounded-full pointer-events-auto hidden lg:block border border-gray-200 transition-colors"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleScrollRight}
            className="z-10 bg-white hover:bg-gray-100 shadow-lg text-gray-700 hover:text-black p-3 rounded-full pointer-events-auto hidden lg:block border border-gray-200 transition-colors"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryWiseProductDisplay;
