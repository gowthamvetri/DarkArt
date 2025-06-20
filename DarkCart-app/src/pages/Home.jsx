// import React from "react";
// import { useSelector } from "react-redux";
// import { validURLConvert } from "../utils/validURLConvert.js";
// import { useNavigate } from "react-router-dom";
// import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay.jsx";

// function Home() {
//   const loadingCategory = useSelector(
//     (state) => state.product.LoadingCategory
//   );
//   const categoryData = useSelector((state) => state.product.allCategory);
//   const subCategoryData = useSelector(
//     (state) => state.product.allSubCategory
//   );
//   const navigate = useNavigate();
//   const handleRedirectProductListPage = (id, category) => {
//     console.log(id, category);

//     const subcategory = subCategoryData.find((sub) => {
//       const filterData = sub.categoryId.some((c) => {
//         return c._id === id;
//       });
//       return filterData ? true : null;
//     });

//     const url = `/${validURLConvert(category)}-${id}/${validURLConvert(
//       subcategory.name
//     )}-${subcategory._id}`;
//     navigate(url);

//     console.log(subcategory);
//   };

//   return (
//     <section className="bg-gray-50">
//       {/* Responsive Banner */}
//       <div className="bg-white">
//         {/* Desktop Banner */}
//         <div className="hidden md:block">
//           <svg
//             viewBox="0 0 1200 250"
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-full h-auto"
//           >
//             {/* Background */}
//             <rect width="1200" height="250" fill="#ffffff" rx="5" ry="5" />

//             {/* Left side decoration elements */}
//             <g>
//               <circle cx="150" cy="125" r="80" fill="#000000" opacity="0.8" />
//               <circle cx="100" cy="170" r="55" fill="#374151" opacity="0.7" />
//               <circle cx="190" cy="80" r="40" fill="#6b7280" opacity="0.6" />
//               <circle cx="70" cy="90" r="35" fill="#9ca3af" opacity="0.5" />

//               {/* Shopping cart icon */}
//               <g transform="translate(100, 130)">
//                 <path
//                   d="M-20,-15 L25,-15 L20,15 L-15,15 Z M-5,20 A5,5 0 1,0 -5,30 A5,5 0 1,0 -5,20 Z M10,20 A5,5 0 1,0 10,30 A5,5 0 1,0 10,20 Z"
//                   fill="#ffffff"
//                   stroke="#000000"
//                   strokeWidth="2"
//                 />
//               </g>
//             </g>

//             {/* Right side decoration elements */}
//             <g>
//               <circle cx="1050" cy="125" r="80" fill="#000000" opacity="0.8" />
//               <circle cx="1100" cy="80" r="55" fill="#374151" opacity="0.7" />
//               <circle cx="1020" cy="170" r="40" fill="#6b7280" opacity="0.6" />
//               <circle cx="1130" cy="150" r="35" fill="#9ca3af" opacity="0.5" />

//               {/* Package icon */}
//               <g transform="translate(1050, 125)">
//                 <rect
//                   x="-20"
//                   y="-20"
//                   width="40"
//                   height="40"
//                   fill="#ffffff"
//                   stroke="#000000"
//                   strokeWidth="2"
//                 />
//                 <line
//                   x1="-20"
//                   y1="-5"
//                   x2="20"
//                   y2="-5"
//                   stroke="#000000"
//                   strokeWidth="2"
//                 />
//                 <line
//                   x1="0"
//                   y1="-20"
//                   x2="0"
//                   y2="20"
//                   stroke="#000000"
//                   strokeWidth="2"
//                 />
//               </g>
//             </g>

//             {/* Center white space for text */}
//             <rect
//               x="250"
//               y="50"
//               width="700"
//               height="150"
//               fill="#ffffff"
//               rx="10"
//               ry="10"
//             />

//             {/* Banner text */}
//             <g>
//               <text
//                 x="600"
//                 y="115"
//                 fontFamily="Georgia, serif"
//                 fontSize="52"
//                 fontWeight="bold"
//                 fill="#000000"
//                 textAnchor="middle"
//               >
//                 CASUAL CLOTHING
//               </text>
//               <text
//                 x="600"
//                 y="160"
//                 fontFamily="Georgia, serif"
//                 fontSize="24"
//                 fill="#6b7280"
//                 textAnchor="middle"
//               >
//                 Fashion Forward Shopping
//               </text>
//             </g>

//             {/* Decorative elements */}
//             <g>
//               <circle cx="320" cy="70" r="10" fill="#d1d5db" />
//               <circle cx="880" cy="70" r="10" fill="#d1d5db" />
//               <circle cx="350" cy="180" r="15" fill="#9ca3af" opacity="0.7" />
//               <circle cx="850" cy="180" r="15" fill="#9ca3af" opacity="0.7" />

//               {/* Stars */}
//               <path
//                 d="M350,80 l2,6 h6 l-5,4 l2,6 l-5,-3 l-5,3 l2,-6 l-5,-4 h6 Z"
//                 fill="#6b7280"
//               />
//               <path
//                 d="M850,80 l2,6 h6 l-5,4 l2,6 l-5,-3 l-5,3 l2,-6 l-5,-4 h6 Z"
//                 fill="#6b7280"
//               />
//             </g>

//             {/* Sparkles/dots */}
//             <g fill="#000000">
//               <circle cx="250" cy="50" r="3" />
//               <circle cx="270" cy="90" r="2" />
//               <circle cx="230" cy="130" r="4" />
//               <circle cx="260" cy="170" r="2" />
//               <circle cx="240" cy="210" r="3" />

//               <circle cx="950" cy="50" r="3" />
//               <circle cx="930" cy="90" r="2" />
//               <circle cx="970" cy="130" r="4" />
//               <circle cx="940" cy="170" r="2" />
//               <circle cx="960" cy="210" r="3" />
//             </g>
//           </svg>
//         </div>

//         {/* Mobile Banner */}
//         <div className="block md:hidden">
//           <div className="relative bg-gradient-to-r from-gray-100 via-white to-gray-100 py-12 px-4 text-center">
//             {/* Background decorative elements */}
//             <div className="absolute inset-0 overflow-hidden">
//               <div className="absolute top-4 left-4 w-16 h-16 bg-black rounded-full opacity-20"></div>
//               <div className="absolute top-8 right-6 w-12 h-12 bg-gray-400 rounded-full opacity-30"></div>
//               <div className="absolute bottom-6 left-8 w-10 h-10 bg-gray-600 rounded-full opacity-25"></div>
//               <div className="absolute bottom-4 right-4 w-14 h-14 bg-gray-300 rounded-full opacity-35"></div>

//               {/* Small dots */}
//               <div className="absolute top-12 left-1/4 w-2 h-2 bg-black rounded-full opacity-40"></div>
//               <div className="absolute top-6 right-1/4 w-3 h-3 bg-gray-500 rounded-full opacity-30"></div>
//               <div className="absolute bottom-8 left-1/3 w-2 h-2 bg-gray-600 rounded-full opacity-35"></div>
//               <div className="absolute bottom-12 right-1/3 w-2 h-2 bg-black rounded-full opacity-40"></div>
//             </div>

//             {/* Content */}
//             <div className="relative z-10">
//               <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3 font-serif tracking-wide">
//                 CASUAL CLOTHING
//               </h1>
//               <p className="text-gray-600 text-lg font-medium">
//                 Fashion Forward Shopping
//               </p>

//               {/* Mobile icons */}
//               <div className="flex justify-center items-center gap-8 mt-6">
//                 <div className="flex items-center justify-center w-10 h-10 bg-black rounded-full">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
//                     <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" />
//                   </svg>
//                 </div>
//                 <div className="flex items-center justify-center w-10 h-10 bg-gray-600 rounded-full">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
//                     <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
//                   </svg>
//                 </div>
//                 <div className="flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
//                     <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L13.5 2.5L16.17 5.17L10.5 10.84L11.91 12.25L15.59 8.57L17 10V9H21ZM1 18.5L9.5 10L11 11.5L2.5 20L1 18.5Z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 lg:px-10 my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
//         {loadingCategory
//           ? new Array(12).fill(null).map((c, index) => {
//               return (
//                 <div
//                   key={index + "loadingcategory"}
//                   className="bg-white rounded-lg p-3 md:p-4 min-h-32 md:min-h-36 grid gap-2 shadow-sm animate-pulse border border-gray-200"
//                 >
//                   <div className="bg-gray-100 min-h-20 md:min-h-24 rounded-md"></div>
//                   <div className="bg-gray-100 h-6 md:h-8 rounded-md"></div>
//                 </div>
//               );
//             })
//           : categoryData.map((category, index) => {
//               return (
//                 <div
//                   key={category._id + "displayCategory"}
//                   className="w-full h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden cursor-pointer group"
//                   onClick={() =>
//                     handleRedirectProductListPage(category._id, category.name)
//                   }
//                 >
//                   <div className="p-3 md:p-4 h-28 md:h-32 flex items-center justify-center bg-gray-50">
//                     <img
//                       src={category.image}
//                       alt={category.name}
//                       className="w-full h-full object-scale-down group-hover:scale-105 transition-transform duration-300"
//                     />
//                   </div>
//                   <div className="p-2 md:p-3 border-t border-gray-100">
//                     <h3 className="text-xs md:text-sm font-medium text-gray-900 text-center truncate">
//                       {category.name}
//                     </h3>
//                   </div>
//                 </div>
//               );
//             })}
//       </div>

//       {/* **display category product */}
//       {categoryData?.map((c, index) => {
//         return (
//           <CategoryWiseProductDisplay
//             key={c?._id + "CategorywiseProduct"}
//             id={c?._id}
//             name={c?.name}
//           />
//         );
//       })}
//     </section>
//   );
// }

// export default Home;
import React from "react";
import { useSelector } from "react-redux";
import { validURLConvert } from "../utils/validURLConvert.js";
import { useNavigate } from "react-router-dom";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay.jsx";
import HomeBannerCarousel from "../components/HomeBannerCarousel.jsx";

function Home() {
  const loadingCategory = useSelector(
    (state) => state.product.LoadingCategory
  );
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector(
    (state) => state.product.allSubCategory
  );
  const navigate = useNavigate();
  const handleRedirectProductListPage = (id, category) => {
    console.log(id, category);

    const subcategory = subCategoryData.find((sub) => {
      const filterData = sub.categoryId.some((c) => {
        return c._id === id;
      });
      return filterData ? true : null;
    });

    const url = `/${validURLConvert(category)}-${id}/${validURLConvert(
      subcategory.name
    )}-${subcategory._id}`;
    navigate(url);

    console.log(subcategory);
  };

  return (
    <section className="bg-gray-50">
      {/* Animated Banner Carousel */}
      <HomeBannerCarousel />

      <div className="container mx-auto px-4 lg:px-10 my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
        {loadingCategory
          ? new Array(12).fill(null).map((c, index) => {
              return (
                <div
                  key={index + "loadingcategory"}
                  className="bg-white rounded-lg p-3 md:p-4 min-h-32 md:min-h-36 grid gap-2 shadow-sm animate-pulse border border-gray-200"
                >
                  <div className="bg-gray-100 min-h-20 md:min-h-24 rounded-md"></div>
                  <div className="bg-gray-100 h-6 md:h-8 rounded-md"></div>
                </div>
              );
            })
          : categoryData.map((category, index) => {
              return (
                <div
                  key={category._id + "displayCategory"}
                  className="w-full h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden cursor-pointer group"
                  onClick={() =>
                    handleRedirectProductListPage(category._id, category.name)
                  }
                >
                  <div className="p-3 md:p-4 h-28 md:h-32 flex items-center justify-center bg-gray-50">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-scale-down group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2 md:p-3 border-t border-gray-100">
                    <h3 className="text-xs md:text-sm font-medium text-gray-900 text-center truncate">
                      {category.name}
                    </h3>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Display category products */}
      {categoryData?.map((c, index) => {
        return (
          <CategoryWiseProductDisplay
            key={c?._id + "CategorywiseProduct"}
            id={c?._id}
            name={c?.name}
          />
        );
      })}
    </section>
  );
}

export default Home;