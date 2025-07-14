import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi.js'
import Axios from '../utils/Axios'
import AxiosTostError from '../utils/AxiosTostError'
import { FaAngleRight, FaAngleLeft, FaRegHeart, FaHeart, FaShare, FaStar, FaArrowRight } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/productDescriptionImages/In no time-rafiki.png'
import image2 from '../assets/productDescriptionImages/Online world-amico.png'
import image3 from '../assets/productDescriptionImages/World Press Freedom Day-cuate.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton.jsx'
import { useSelector } from 'react-redux'

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
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [imageLoaded, setImageLoaded] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const imageContainer = useRef(null)
  const user = useSelector((state) => state.user.user)

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      setImageLoaded(false)
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
        fetchRelatedProducts(responseData.data.category?._id)
      }
    } catch (error) {
      AxiosTostError(error)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchRelatedProducts = async (categoryId) => {
    if (!categoryId) return;
    
    try {
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: [categoryId]
        },
      })

      const { data: responseData } = response;
      if (responseData.success) {
        // Filter out current product and limit to 4 related products
        const filtered = responseData.data.filter(p => p._id !== productId).slice(0, 4);
        setRelatedProducts(filtered);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Toast notification
    if (!isWishlisted) {
      // Add to wishlist logic would go here
    } else {
      // Remove from wishlist logic would go here
    }
  }
  
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const handleImageLoad = () => {
    setImageLoaded(true);
  }

  const scrollLeft = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }

  const scrollRight = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }

  const openImageModal = (index) => {
    setImage(index);
    setShowImageModal(true);
  }

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
      <div className="flex gap-4 mb-4 border-b border-gray-200">
        <h2 className="pb-2 px-1 font-medium text-lg text-black border-b-2 border-black">
          Product Details
        </h2>
      </div>
      
      <div className="animate-fadeIn">
        <p className='text-base text-gray-600 leading-relaxed'>{data.description}</p>
        <p className='text-sm text-gray-500 mt-2'>Unit: {data.unit}</p>
        
        {/* Key features section */}
        {data.description && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-2">Key Features</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              {data.description.split('.').filter(s => s.trim().length > 10).slice(0, 4).map((feature, i) => (
                <li key={i} className="text-sm">{feature.trim()}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Display more details if available */}
        {data?.more_details && Object.keys(data?.more_details).length > 0 && (
          <div className="mt-4 grid gap-2">
            <h3 className="font-medium text-gray-900 mb-2">Additional Details</h3>
            {Object.keys(data?.more_details).map((element, index) => (
              <div key={`details-${element}-${index}`} className="flex py-2 border-b border-gray-100">
                <p className='font-medium text-gray-900 w-1/3'>{element}</p>
                <p className='text-base text-gray-600 w-2/3'>{data?.more_details[element]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const ProductCard = ({ product }) => {
    const genderBadgeColor = {
        'Men': 'bg-blue-100 text-blue-800',
        'Women': 'bg-pink-100 text-pink-800',
        'Kids': 'bg-green-100 text-green-800'
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
                <img 
                    src={product.image[0]} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
                {product.gender && (
                    <span className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${genderBadgeColor[product.gender]}`}>
                        {product.gender}
                    </span>
                )}
                {product.discount > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        -{product.discount}%
                    </span>
                )}
            </div>
            
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                            ₹{product.discount > 0 
                                ? (product.price - (product.price * product.discount / 100)).toFixed(2)
                                : product.price.toFixed(2)
                            }
                        </span>
                        {product.discount > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                                ₹{product.price.toFixed(2)}
                            </span>
                        )}
                    </div>
                    
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                </p>
                
                <button 
                    className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.stock === 0}
                >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
};

  return (
    <section className='bg-gray-50 min-h-screen py-6'>
      <div className='container mx-auto p-4'>
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
       
          <span className="mx-2">/</span>
          <Link to={`/${data.category?.name?.toLowerCase()}-${productId}`} className="text-gray-800 font-medium truncate max-w-[200px] hover:text-black">
            {data.name}
          </Link>
        </div>
      
        <div className='grid lg:grid-cols-2 gap-6 lg:gap-10'>
          {/* Product Images Section */}
          <div className='space-y-4'>
            {/* Main Image */}
            <div 
              className='bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 relative group cursor-pointer'
              onClick={() => openImageModal(image)}
            >
              {!imageLoaded && loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {data.image && data.image.length > 0 && (
                <img
                  src={data.image[image]}
                  alt={data.name}
                  className={`w-full h-64 lg:h-[450px] object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={handleImageLoad}
                />
              )}
              
              {/* Zoom/expand overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center opacity-0 group-hover:bg-opacity-10 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-white rounded-full p-2 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              
              {/* Discount badge */}
              {data.discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {data.discount}% OFF
                </div>
              )}
              
              {/* Action buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlist();
                  }}
                  className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
                >
                  {isWishlisted ? (
                    <FaHeart className="w-5 h-5 text-red-500" />
                  ) : (
                    <FaRegHeart className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  className="bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 relative"
                >
                  <FaShare className="w-5 h-5 text-gray-600" />
                  {copied && (
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-black rounded shadow">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Thumbnail Navigation */}
            <div className='relative'>
              {canScrollLeft && (
                <button 
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors"
                >
                  <FaAngleLeft className="w-4 h-4 text-gray-700" />
                </button>
              )}
              
              <div 
                ref={imageContainer} 
                className='overflow-x-auto flex gap-3 hide-scrollbar py-2 px-1'
              >
                {data.image && data.image.map((img, index) => (
                  <div 
                    key={`thumbnail-${index}`}
                    className={`flex-shrink-0 border-2 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${index === image ? 'border-black shadow-md' : 'border-gray-200'}`}
                  >
                    <img 
                      src={img} 
                      alt={`${data.name} - thumbnail ${index + 1}`} 
                      className='w-20 h-20 object-contain cursor-pointer' 
                      onClick={() => setImage(index)}
                    />
                  </div>
                ))}
              </div>
              
              {canScrollRight && (
                <button 
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-colors"
                >
                  <FaAngleRight className="w-4 h-4 text-gray-700" />
                </button>
              )}
            </div>
            
            {/* Desktop product details */}
            <ProductDetails className="hidden lg:grid" />
          </div>

          {/* Product Info Section */}
          <div className='p-6 bg-white rounded-lg shadow-sm border border-gray-200 h-fit'>
            {/* Category badge */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className='bg-gray-100 text-gray-800 w-fit px-3 py-1 rounded-full text-sm font-medium'>
                {data.category?.name || "Fashion"}
              </span>
              <span className='bg-gray-100 text-gray-800 w-fit px-3 py-1 rounded-full text-sm font-medium'>
                Quick Delivery
              </span>
              {data.stock > 0 && data.stock < 10 && (
                <span className='bg-orange-100 text-orange-800 w-fit px-3 py-1 rounded-full text-sm font-medium'>
                  Only {data.stock} left
                </span>
              )}
            </div>
            
            {/* Product title and unit */}
            <h2 className='text-xl font-semibold lg:text-3xl text-gray-900 mb-1 leading-tight'>{data.name}</h2>  
            <p className='text-gray-600 mb-4'>{data.unit}</p> 
            
            {/* Rating overview */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`w-4 h-4 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(24 reviews)</span>
            </div>
            
            <Divider/>
            
            {/* Price section */}
            <div className="mb-6">
              <p className='text-gray-900 font-medium mb-2'>Price</p> 
              <div className='flex items-center gap-2 lg:gap-4'>
                <div className='border border-gray-200 px-4 py-2 rounded bg-gray-50 w-fit'>
                  <p className='font-semibold text-lg lg:text-2xl text-black'>
                    {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
                  </p>
                </div>
                {data.discount > 0 && (
                  <div className="flex items-center gap-2">
                    <p className='line-through text-gray-500'>{DisplayPriceInRupees(data.price)}</p>
                    <p className="font-bold text-green-600 lg:text-xl">
                      Save {DisplayPriceInRupees(data.price - pricewithDiscount(data.price, data.discount))}
                    </p>
                  </div>
                )}
              </div>
              {data.discount > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Offer ends in 2 days
                </p>
              )}
            </div>
            
            {/* Availability section */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Availability:</span>
                {data.stock === 0 ? (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                ) : (
                  <span className="text-green-600 font-medium">In Stock</span>
                )}
              </div>
              
              {data.stock > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-600 h-1.5 rounded-full" 
                      style={{ width: `${Math.min(100, data.stock > 50 ? 75 : data.stock > 20 ? 50 : 25)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Add to cart button */}
            {data.stock === 0 ? (
              <div className="mb-6">
                <p className='text-base text-red-500 font-medium'>Currently Out of Stock</p>
                <button className="mt-2 w-full bg-gray-200 text-gray-500 py-3 rounded-md font-medium cursor-not-allowed">
                  Notify Me When Available
                </button>
              </div>
            ) : (
              <div className='mb-6 transform transition-transform hover:scale-[1.02]'>
                <AddToCartButton data={data} large={true} />
              </div>
            )}
            
            {/* Delivery information */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Delivery Information</h3>
              <div className="flex items-start gap-3 mb-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p className="text-sm text-gray-600">Free shipping on orders over ₹499</p>
              </div>
              <div className="flex items-start gap-3 mb-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p className="text-sm text-gray-600">Delivery within 3-5 business days</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p className="text-sm text-gray-600">Easy returns within 7 days</p>
              </div>
            </div>
         
            {/* Why shop from Casual Clothing Section - Improved */}
            <h2 className='font-semibold text-gray-900 mb-4'>Why shop from Casual Clothing?</h2>
            <div className="space-y-3">
              <div className='flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300'>
                <img
                  src={image1}
                  alt='superfast delivery'
                  className='w-16 h-16 rounded-lg object-contain'
                />
                <div className='text-sm'>
                  <div className='font-semibold text-gray-900'>Express Delivery</div>
                  <p className='text-gray-600'>Get your fashion items delivered quickly from our nearby stores.</p>
                </div>
              </div>
              <div className='flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300'>
                <img
                  src={image2}
                  alt='Best prices offers'
                  className='w-16 h-16 rounded-lg object-contain'
                />
                <div className='text-sm'>
                  <div className='font-semibold text-gray-900'>Best Prices & Offers</div>
                  <p className='text-gray-600'>Competitive pricing with exclusive offers directly from fashion brands.</p>
                </div>
              </div>
              <div className='flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300'>
                <img
                  src={image3}
                  alt='Wide Assortment'
                  className='w-16 h-16 rounded-lg object-contain'
                />
                <div className='text-sm'>
                  <div className='font-semibold text-gray-900'>Wide Collection</div>
                  <p className='text-gray-600'>Choose from thousands of fashion items across multiple categories.</p>
                </div>
              </div>
            </div>

            {/* Mobile product details */}
            <ProductDetails className="lg:hidden mt-6" />
          </div>
        </div>
        
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Related Products</h2>
              <Link to={`/${data.category?.name?.toLowerCase()}`} className="text-black hover:text-gray-600 flex items-center gap-1 font-medium">
                See All <FaArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <Link 
                  to={`/product/${product.name.toLowerCase().replace(/ /g, '-')}-${product._id}`}
                  key={product._id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-3">
                    <div className="aspect-square rounded-md overflow-hidden bg-gray-50 mb-3">
                      <img 
                        src={product.image[0]} 
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="font-bold text-black">
                          {DisplayPriceInRupees(pricewithDiscount(product.price, product.discount))}
                        </p>
                        {product.discount > 0 && (
                          <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Image Modal */}
      {showImageModal && data.image && data.image.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setShowImageModal(false)}>
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setShowImageModal(false)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <div className="relative max-w-4xl w-full h-full flex flex-col items-center justify-center">
            <img
              src={data.image[image]}
              alt={data.name}
              className="max-h-[80vh] max-w-full object-contain"
            />
            
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 flex justify-between w-full px-4 pointer-events-none">
              <button 
                className="bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setImage((prev) => (prev === 0 ? data.image.length - 1 : prev - 1));
                }}
              >
                <FaAngleLeft className="w-6 h-6 text-black" />
              </button>
              
              <button 
                className="bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setImage((prev) => (prev === data.image.length - 1 ? 0 : prev + 1));
                }}
              >
                <FaAngleRight className="w-6 h-6 text-black" />
              </button>
            </div>
            
            <div className="mt-4 flex justify-center gap-2">
              {data.image.map((img, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full ${idx === image ? 'bg-white' : 'bg-gray-500'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(idx);
                  }}
                ></button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes addToCart {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .animate-addToCart {
          animation: addToCart 0.5s ease-in-out;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}

export default ProductDisplayPage