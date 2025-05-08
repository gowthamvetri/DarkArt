import React from "react";
import { useSelector } from "react-redux";
import { validURLConvert } from "../utils/validURLConvert.js";
import { useNavigate } from "react-router-dom";
 import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay.jsx";
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

    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.categoryId.some(c => {
        return c._id === id;
      });
      return filterData ? true : null;
    });

    const url =   `/${validURLConvert(category)}-${id}/${validURLConvert(subcategory.name)}-${subcategory._id}`;
navigate(url);
    
    console.log(subcategory);
  };

  return (
    <section>
      <div>
        <svg viewBox="0 0 1200 250" xmlns="http://www.w3.org/2000/svg">
          {/* Background */}
          <rect width="1200" height="250" fill="#ffffff" rx="5" ry="5" />

          {/* Left side decoration elements */}
          <g>
            {/* Circles and decorative elements on left */}
            <circle cx="150" cy="125" r="80" fill="#3498db" opacity="0.8" />
            <circle cx="100" cy="170" r="55" fill="#2ecc71" opacity="0.7" />
            <circle cx="190" cy="80" r="40" fill="#9b59b6" opacity="0.6" />
            <circle cx="70" cy="90" r="35" fill="#e74c3c" opacity="0.5" />

            {/* Shopping cart icon */}
            <g transform="translate(100, 130)">
              <path
                d="M-20,-15 L25,-15 L20,15 L-15,15 Z M-5,20 A5,5 0 1,0 -5,30 A5,5 0 1,0 -5,20 Z M10,20 A5,5 0 1,0 10,30 A5,5 0 1,0 10,20 Z"
                fill="#ffffff"
                stroke="#333333"
                strokeWidth="2"
              />
            </g>
          </g>

          {/* Right side decoration elements */}
          <g>
            {/* Circles and decorative elements on right */}
            <circle cx="1050" cy="125" r="80" fill="#3498db" opacity="0.8" />
            <circle cx="1100" cy="80" r="55" fill="#2ecc71" opacity="0.7" />
            <circle cx="1020" cy="170" r="40" fill="#9b59b6" opacity="0.6" />
            <circle cx="1130" cy="150" r="35" fill="#e74c3c" opacity="0.5" />

            {/* Package icon */}
            <g transform="translate(1050, 125)">
              <rect
                x="-20"
                y="-20"
                width="40"
                height="40"
                fill="#ffffff"
                stroke="#333333"
                strokeWidth="2"
              />
              <line
                x1="-20"
                y1="-5"
                x2="20"
                y2="-5"
                stroke="#333333"
                strokeWidth="2"
              />
              <line
                x1="0"
                y1="-20"
                x2="0"
                y2="20"
                stroke="#333333"
                strokeWidth="2"
              />
            </g>
          </g>

          {/* Center white space for text */}
          <rect
            x="300"
            y="50"
            width="600"
            height="150"
            fill="#ffffff"
            rx="10"
            ry="10"
          />

          {/* Banner text */}
          <g>
            <text
              x="600"
              y="115"
              fontFamily="Arial, sans-serif"
              fontSize="60"
              fontWeight="bold"
              fill="#333333"
              textAnchor="middle"
            >
              DARK CART
            </text>
            <text
              x="600"
              y="160"
              fontFamily="Arial, sans-serif"
              fontSize="24"
              fill="#3498db"
              textAnchor="middle"
            >
              Shop Smarter, Not Harder
            </text>
          </g>

          {/* Small decorative elements */}
          <g>
            <circle cx="320" cy="70" r="10" fill="#f1c40f" />
            <circle cx="880" cy="70" r="10" fill="#f1c40f" />
            <circle cx="350" cy="180" r="15" fill="#e74c3c" opacity="0.7" />
            <circle cx="850" cy="180" r="15" fill="#e74c3c" opacity="0.7" />

            {/* Stars */}
            <path
              d="M350,80 l2,6 h6 l-5,4 l2,6 l-5,-3 l-5,3 l2,-6 l-5,-4 h6 Z"
              fill="#f39c12"
            />
            <path
              d="M850,80 l2,6 h6 l-5,4 l2,6 l-5,-3 l-5,3 l2,-6 l-5,-4 h6 Z"
              fill="#f39c12"
            />

            {/* Small device icons */}
            <g transform="translate(400, 200) scale(0.5)">
              <rect
                x="-15"
                y="-20"
                width="30"
                height="40"
                rx="3"
                ry="3"
                fill="#95a5a6"
              />
              <rect x="-10" y="-15" width="20" height="25" fill="#ecf0f1" />
              <circle cx="0" cy="15" r="3" fill="#ecf0f1" />
            </g>

            <g transform="translate(800, 200) scale(0.5)">
              <rect
                x="-20"
                y="-15"
                width="40"
                height="30"
                rx="3"
                ry="3"
                fill="#95a5a6"
              />
              <rect x="-15" y="-10" width="30" height="20" fill="#ecf0f1" />
              <rect x="-10" y="15" width="20" height="5" fill="#95a5a6" />
            </g>
          </g>

          {/* Sparkles/dots across banner */}
          <g fill="#3498db">
            <circle cx="250" cy="50" r="3" />
            <circle cx="270" cy="90" r="2" />
            <circle cx="230" cy="130" r="4" />
            <circle cx="260" cy="170" r="2" />
            <circle cx="240" cy="210" r="3" />

            <circle cx="950" cy="50" r="3" />
            <circle cx="930" cy="90" r="2" />
            <circle cx="970" cy="130" r="4" />
            <circle cx="940" cy="170" r="2" />
            <circle cx="960" cy="210" r="3" />
          </g>

          <g fill="#2ecc71">
            <circle cx="280" cy="60" r="2" />
            <circle cx="220" cy="100" r="3" />
            <circle cx="270" cy="140" r="2" />
            <circle cx="230" cy="180" r="4" />
            <circle cx="280" cy="220" r="2" />

            <circle cx="920" cy="60" r="2" />
            <circle cx="980" cy="100" r="3" />
            <circle cx="930" cy="140" r="2" />
            <circle cx="970" cy="180" r="4" />
            <circle cx="920" cy="220" r="2" />
          </g>
        </svg>
      </div>

      <div className='container mx-auto px-4 lg:px-10 my-2 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2'>
          {
            loadingCategory ? (
              new Array(12).fill(null).map((c,index)=>{
                return(
                  <div key={index+"loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                    <div className='bg-blue-100 min-h-24 rounded'></div>
                    <div className='bg-blue-100 h-8 rounded'></div>
                  </div>
                )
              })
            ) :categoryData.map((category,index)=>{
              return(
                <div key ={category._id +"displayCategory"} className='w-full h-full' onClick={()=> handleRedirectProductListPage(category._id,category.name)}>
                  <div>
                      <img 
                        src={category.image}
                        className='w-full h-full object-scale-down'
                      />
                  </div>
                </div>
              )
            })
            
}
        
    </div>

     {/* **display category product */}
     {
        categoryData?.map((c,index)=>{
          return(
            <CategoryWiseProductDisplay
              key={c?._id+"CategorywiseProduct"} 
              id={c?._id} 
              name={c?.name}
            />
          )
        })
      }

           
    </section>
  );
}

export default Home;
