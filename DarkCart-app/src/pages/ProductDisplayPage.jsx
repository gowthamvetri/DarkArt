import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi.js'
import Axios from '../utils/Axios'
import AxiosTostError from '../utils/AxiosTostError'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/noData.jpg'
import image2 from '../assets/noData.jpg'
import image3 from '../assets/noData.jpg'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton.jsx'

const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({
    name: "",
    image: []
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const imageContainer = useRef(null)

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosTostError(error)
    } finally {
      setLoading(false)
    }
  }

  console.log(data.stock)

  useEffect(() => {
    fetchProductDetails()
  }, [params])

  // Check if scrolling is possible
  useEffect(() => {
    if (imageContainer.current) {
      const checkScrollability = () => {
        const { scrollLeft, scrollWidth, clientWidth } = imageContainer.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
      }
      
      // Initial check
      checkScrollability()
      
      // Add event listener for scroll
      imageContainer.current.addEventListener('scroll', checkScrollability)
      
      // Cleanup
      return () => {
        if (imageContainer.current) {
          imageContainer.current.removeEventListener('scroll', checkScrollability)
        }
      }
    }
  }, [data.image]) // Re-run when images change

  // Create a component for product details to avoid duplication
  const ProductDetails = ({ className }) => (
    <div className={`my-4 grid gap-3 ${className}`}>
      <div>
        <p className='font-semibold text-gray-900'>Description</p>
        <p className='text-base text-gray-600'>{data.description}</p>
      </div>
      <div>
        <p className='font-semibold text-gray-900'>Unit</p>
        <p className='text-base text-gray-600'>{data.unit}</p>
      </div>
      {
        data?.more_details && Object.keys(data?.more_details).map((element, index) => {
          return(
            <div key={`details-${element}-${index}`}>
              <p className='font-semibold text-gray-900'>{element}</p>
              <p className='text-base text-gray-600'>{data?.more_details[element]}</p>
            </div>
          )
        })
      }
    </div>
  )

  return (
    <section className='bg-gray-50 min-h-screen'>
      <div className='container mx-auto p-4 grid lg:grid-cols-2'>
        <div className=''>
          <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded-lg min-h-56 max-h-56 h-full w-full shadow-sm border border-gray-200'>
            {data.image && data.image.length > 0 && (
              <img
                src={data.image[image]}
                alt={data.name}
                className='w-full h-full object-scale-down'
              />
            )}
          </div>
          
          <div className='flex items-center justify-center gap-3 my-2'>
            {
              data.image && data.image.map((img, index) => {
                return(
                  <div 
                    key={`indicator-${index}`} 
                    onClick={() => setImage(index)}
                    className={`w-3 h-3 lg:w-5 lg:h-5 rounded-full cursor-pointer transition-colors ${index === image ? "bg-black" : "bg-gray-300"}`}
                  ></div>
                )
              })
            }
          </div>
          
          <div className='flex items-center justify-between gap-2'>
            <div 
              ref={imageContainer} 
              className='flex-1 overflow-x-auto flex gap-2 lg:gap-4 hide-scrollbar py-2'
            >
              {
                data.image && data.image.map((img, index) => {
                  return(
                    <div 
                      key={`thumbnail-${index}`}
                      className={`flex-shrink-0 border-2 rounded overflow-hidden ${index === image ? 'border-black' : 'border-gray-200'}`}
                    >
                      <img 
                        src={img} 
                        alt={`${data.name} - thumbnail ${index + 1}`} 
                        className='w-20 h-20 lg:w-28 lg:h-28 object-scale-down cursor-pointer' 
                        onClick={() => setImage(index)}
                      />
                    </div>
                  )
                })
              }
            </div>
          </div>
          
          {/* Desktop product details */}
          <ProductDetails className="hidden lg:grid" />
        </div>

        <div className='p-4 lg:pl-7 text-base lg:text-lg bg-white rounded-lg shadow-sm border border-gray-200 h-fit'>
          <p className='bg-gray-200 text-gray-800 w-fit px-3 py-1 rounded-full text-sm font-medium'>Quick Delivery</p>
          <h2 className='text-lg font-semibold lg:text-3xl text-gray-900 mt-3'>{data.name}</h2>  
          <p className='text-gray-600'>{data.unit}</p> 
          <Divider/>
          <div>
            <p className='text-gray-900 font-medium'>Price</p> 
            <div className='flex items-center gap-2 lg:gap-4'>
              <div className='border border-gray-300 px-4 py-2 rounded bg-gray-50 w-fit'>
                <p className='font-semibold text-lg lg:text-xl text-black'>
                  {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
                </p>
              </div>
              {
                data.discount && (
                  <p className='line-through text-gray-500'>{DisplayPriceInRupees(data.price)}</p>
                )
              }
              {
                data.discount && (
                  <p className="font-bold text-black lg:text-2xl">
                    {data.discount}% <span className='text-base text-gray-500'>Discount</span>
                  </p>
                )
              }
            </div>
          </div> 
            
          {
            data.stock === 0 ? (
              <p className='text-lg text-red-500 my-2'>Out of Stock</p>
            ) : (
              <div className='my-4'>
              <AddToCartButton data={data}/>
            </div>
            )
          }
         
          <h2 className='font-semibold text-gray-900'>Why shop from Casual Clothing?</h2>
          <div>
            <div className='flex items-center gap-4 my-4 p-3 bg-gray-50 rounded-lg border border-gray-200'>
              <img
                src={image1}
                alt='superfast delivery'
                className='w-16 h-16 lg:w-20 lg:h-20 rounded-lg'
              />
              <div className='text-sm'>
                <div className='font-semibold text-gray-900'>Express Delivery</div>
                <p className='text-gray-600'>Get your fashion items delivered to your doorstep quickly from our nearby stores.</p>
              </div>
            </div>
            <div className='flex items-center gap-4 my-4 p-3 bg-gray-50 rounded-lg border border-gray-200'>
              <img
                src={image2}
                alt='Best prices offers'
                className='w-16 h-16 lg:w-20 lg:h-20 rounded-lg'
              />
              <div className='text-sm'>
                <div className='font-semibold text-gray-900'>Best Prices & Offers</div>
                <p className='text-gray-600'>Competitive pricing with exclusive offers directly from fashion brands.</p>
              </div>
            </div>
            <div className='flex items-center gap-4 my-4 p-3 bg-gray-50 rounded-lg border border-gray-200'>
              <img
                src={image3}
                alt='Wide Assortment'
                className='w-16 h-16 lg:w-20 lg:h-20 rounded-lg'
              />
              <div className='text-sm'>
                <div className='font-semibold text-gray-900'>Wide Collection</div>
                <p className='text-gray-600'>Choose from thousands of fashion items across clothing, accessories, and lifestyle categories.</p>
              </div>
            </div>
          </div>

          {/****only mobile */}
          <div className='my-4 grid gap-3 lg:hidden'>
              <div>
                  <p className='font-semibold text-gray-900'>Description</p>
                  <p className='text-base text-gray-600'>{data.description}</p>
              </div>
              <div>
                  <p className='font-semibold text-gray-900'>Unit</p>
                  <p className='text-base text-gray-600'>{data.unit}</p>
              </div>
              {
                data?.more_details && Object.keys(data?.more_details).map((element,index)=>{
                  return(
                    <div key={`mobile-details-${element}-${index}`}>
                        <p className='font-semibold text-gray-900'>{element}</p>
                        <p className='text-base text-gray-600'>{data?.more_details[element]}</p>
                    </div>
                  )
                })
              }
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage