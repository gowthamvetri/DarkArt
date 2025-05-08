import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi.js'
import Axios from '../utils/Axios'
import AxiosTostError from '../utils/AxiosTostError'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/logo.jpeg'
import image2 from '../assets/logo.jpeg'
import image3 from '../assets/logo.jpeg'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { AddCategoryController } from '../../../server/controllers/category.controller.js'
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
        <p className='font-semibold'>Description</p>
        <p className='text-base'>{data.description}</p>
      </div>
      <div>
        <p className='font-semibold'>Unit</p>
        <p className='text-base'>{data.unit}</p>
      </div>
      {
        data?.more_details && Object.keys(data?.more_details).map((element, index) => {
          return(
            <div key={`details-${element}-${index}`}>
              <p className='font-semibold'>{element}</p>
              <p className='text-base'>{data?.more_details[element]}</p>
            </div>
          )
        })
      }
    </div>
  )

  return (
    <section className='container mx-auto p-4 grid lg:grid-cols-2'>
      <div className=''>
        <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
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
                  className={`w-3 h-3 lg:w-5 lg:h-5 rounded-full cursor-pointer transition-colors ${index === image ? "bg-green-500" : "bg-slate-200"}`}
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
                    className={`flex-shrink-0 border-2 rounded overflow-hidden ${index === image ? 'border-green-500' : 'border-transparent'}`}
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

      <div className='p-4 lg:pl-7 text-base lg:text-lg'>
        <p className='bg-green-300 w-fit px-2 rounded-full'>10 Min</p>
        <h2 className='text-lg font-semibold lg:text-3xl'>{data.name}</h2>  
        <p className=''>{data.unit}</p> 
        <Divider/>
        <div>
          <p className=''>Price</p> 
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='border border-green-600 px-4 py-2 rounded bg-green-50 w-fit'>
              <p className='font-semibold text-lg lg:text-xl'>
                {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
              </p>
            </div>
            {
              data.discount && (
                <p className='line-through'>{DisplayPriceInRupees(data.price)}</p>
              )
            }
            {
              data.discount && (
                <p className="font-bold text-green-600 lg:text-2xl">
                  {data.discount}% <span className='text-base text-neutral-500'>Discount</span>
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
       
        <h2 className='font-semibold'>Why shop from DarkCart? </h2>
        <div>
          <div className='flex items-center gap-4 my-4'>
            <img
              src={image1}
              alt='superfast delivery'
              className='w-20 h-20'
            />
            <div className='text-sm'>
              <div className='font-semibold'>Superfast Delivery</div>
              <p>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
            </div>
          </div>
          <div className='flex items-center gap-4 my-4'>
            <img
              src={image2}
              alt='Best prices offers'
              className='w-20 h-20'
            />
            <div className='text-sm'>
              <div className='font-semibold'>Best Prices & Offers</div>
              <p>Best price destination with offers directly from the manufacturers.</p>
            </div>
          </div>
          <div className='flex items-center gap-4 my-4'>
            <img
              src={image3}
              alt='Wide Assortment'
              className='w-20 h-20'
            />
            <div className='text-sm'>
              <div className='font-semibold'>Wide Assortment</div>
              <p>Choose from 5000+ products across food personal care, household & other categories.</p>
            </div>
          </div>
        </div>

            {/****only mobile */}
            <div className='my-4 grid gap-3 '>
                <div>
                    <p className='font-semibold'>Description</p>
                    <p className='text-base'>{data.description}</p>
                </div>
                <div>
                    <p className='font-semibold'>Unit</p>
                    <p className='text-base'>{data.unit}</p>
                </div>
                {
  data?.more_details && Object.keys(data?.more_details).map((element,index)=>{
    return(
      <div key={`mobile-details-${element}-${index}`}>
          <p className='font-semibold'>{element}</p>
          <p className='text-base'>{data?.more_details[element]}</p>
      </div>
    )
  })
}

            </div>
        </div>
       
    </section>
  )
}

export default ProductDisplayPage