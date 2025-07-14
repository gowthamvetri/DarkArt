import React, { useState, useEffect } from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { validURLConvert } from "../utils/validURLConvert";
import { Link, useLocation } from "react-router-dom";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "./AddToCartButton";
import { useGlobalContext } from "../provider/GlobalProvider";
import { FaHeart, FaRegHeart, FaStar, FaEye, FaShoppingCart, FaMale, FaFemale, FaChild } from "react-icons/fa";

// Component to display product name with search highlighting
const ProductNameWithHighlight = ({ name, searchTerm }) => {
  if (!searchTerm || !name) return name || '';
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = name.split(regex);
  
  return (
    <span>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 text-gray-900 font-semibold rounded px-1">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

function CardProduct({ data }) {
  // Early return if data is not available
  if (!data || !data._id) {
    return (
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden animate-pulse h-[450px] w-full mx-auto">
        <div className="h-[280px] bg-gray-200"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [processingWishlist, setProcessingWishlist] = useState(false);
  const { addToWishlist, removeFromWishlist, checkWishlistItem } = useGlobalContext();
  const location = useLocation();
  
  // Extract search term from URL params
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || '';
  
  // Safe URL generation with fallbacks
  const productName = data.name || 'product';
  const productId = data._id || '';
  const url = `/product/${validURLConvert(productName)}-${productId}`;

  // Check if product is in wishlist when component mounts
  useEffect(() => {
    const checkWishlist = async () => {
      if (productId) {
        const isInWishlist = await checkWishlistItem(productId);
        setIsWishlisted(isInWishlist);
      }
    };
    
    checkWishlist();
  }, [productId]);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (processingWishlist) return;
    
    setProcessingWishlist(true);
    
    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
        setIsWishlisted(false);
      } else {
        await addToWishlist(productId);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setProcessingWishlist(false);
    }
  };

  const getStockStatus = () => {
    const stock = data.stock || 0;
    if (stock <= 0) {
      return { text: "Out of Stock", color: "text-red-600 bg-red-50 border-red-200" };
    } else if (stock <= 5) {
      return { text: `Only ${stock} left`, color: "text-orange-600 bg-orange-50 border-orange-200" };
    } else if (stock <= 10) {
      return { text: "Limited Stock", color: "text-yellow-600 bg-yellow-50 border-yellow-200" };
    } else {
      return { text: "In Stock", color: "text-green-600 bg-green-50 border-green-200" };
    }
  };

  const getGenderIcon = () => {
    switch (data.gender) {
      case 'Men':
        return <FaMale className="w-3 h-3 text-blue-600" />;
      case 'Women':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Kids':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Quick view for:', data.name);
  };

  // Safe value extraction with fallbacks
  const stockStatus = getStockStatus();
  const price = data.price || 0;
  const discount = data.discount || 0;
  const discountedPrice = pricewithDiscount(price, discount);
  const savings = price - discountedPrice;
  const productImage = data.image?.[0] || '';
  const categoryName = data.category?.[0]?.name || 'Fashion';
  const description = data.description || '';
  const moreDetails = data.more_details || {};
  const createdAt = data.createdAt || new Date();

  return (
    <div className="w-full">
      <Link
        to={url}
        className="bg-white shadow-sm hover:shadow-lg border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 group flex flex-col h-[400px] w-full relative hover:border-gray-300"
        onMouseEnter={() => setShowQuickActions(true)}
        onMouseLeave={() => setShowQuickActions(false)}
      >
        {/* Product Image Container - Fixed Height */}
        <div className="relative bg-white h-[240px] overflow-hidden">
          {/* Top Badges */}
          <div className="absolute top-2 left-2 right-2 z-20 flex justify-between items-start">
            {/* Stock Status Badge */}
            <span className={`px-2 py-1 text-xs font-medium rounded-md border backdrop-blur-sm ${stockStatus.color}`}>
              {stockStatus.text}
            </span>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-md shadow-sm hover:bg-white transition-all duration-300 hover:scale-105"
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? (
                <FaHeart className="text-red-500 w-3.5 h-3.5" />
              ) : (
                <FaRegHeart className="text-gray-600 w-3.5 h-3.5 group-hover:text-red-500 transition-colors" />
              )}
            </button>
          </div>

          

          {/* Product Image */}
          <div className="w-full h-full flex items-center justify-center p-4">
            {productImage && !imageError ? (
              <>
                {!imageLoaded && (
                  <div className="w-full h-full bg-gray-200 animate-pulse rounded-md"></div>
                )}
                <img
                  src={productImage}
                  alt={productName}
                  className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${
                    data.stock <= 0 ? 'grayscale opacity-60' : ''
                  } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-md">
                <FaShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Quick View Overlay */}
          {/* <div className={`absolute inset-0 bg-black/10 backdrop-blur-[1px] transition-all duration-300 flex items-center justify-center ${
            showQuickActions ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <button
              onClick={handleQuickView}
              className={`bg-black text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300 hover:bg-gray-800 flex items-center gap-2 text-sm font-medium ${
                showQuickActions ? 'scale-100 translate-y-0' : 'scale-90 translate-y-2'
              }`}
              title="Quick View"
            >
              <FaEye className="w-4 h-4" />
              Quick View
            </button>
          </div> */}
        </div>

        {/* Product Info - Fixed Height */}
        <div className="p-4 flex flex-col h-[160px] justify-between">
          {/* Top Section */}
          <div className="flex-1">
            {/* Category */}
            <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">
              {categoryName}
            </div>

            {/* Product Name */}
            <div className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 h-5">
              <ProductNameWithHighlight name={productName} searchTerm={searchTerm} />
            </div>

            <div className="flex flex-row items-center gap-2 mt-1">
                <div className="font-bold text-gray-900 text-base">
                  {DisplayPriceInRupees(discountedPrice)}
                </div>
                <div>
                  {discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      {DisplayPriceInRupees(price)}
                    </span>
                  )}
                </div>
              </div>
          </div>
          <div>
            
          </div>
          </div>
          {/* Bottom Section - Price and Cart */}
          <div className="border-t border-gray-100 pt-3 mt-auto flex flex-col gap-2">
            <div className="flex items-center justify-between">
              {/* Price Section */}
              

              {/* Add to Cart Button */}
              <div className="flex-shrink-0">
                <AddToCartButton data={data} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CardProduct;
