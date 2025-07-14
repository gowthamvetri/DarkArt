import React, { useState } from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { validURLConvert } from "../utils/validURLConvert";
import { Link, useLocation } from "react-router-dom";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "./AddToCartButton";
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
          <mark key={index} className="bg-yellow-200 text-gray-900 font-semibold">
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
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden animate-pulse">
        <div className="aspect-square bg-gray-200"></div>
        <div className="p-3 lg:p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const location = useLocation();
  
  // Extract search term from URL params
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || '';
  
  // Safe URL generation with fallbacks
  const productName = data.name || 'product';
  const productId = data._id || '';
  const url = `/product/${validURLConvert(productName)}-${productId}`;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
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
        return <FaFemale className="w-3 h-3 text-pink-600" />;
      case 'Kids':
        return <FaChild className="w-3 h-3 text-green-600" />;
      default:
        return null;
    }
  };

  const getGenderBadgeColor = () => {
    switch (data.gender) {
      case 'Men':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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
    <Link
      to={url}
      className="bg-white shadow-sm hover:shadow-xl border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 group flex flex-col h-full relative transform hover:-translate-y-1"
    >
      {/* Top Badges Container */}
      <div className="absolute top-2 left-2 right-2 z-20 flex justify-between items-start">
        {/* Stock Status Badge */}
        <span className={`px-2 py-1 text-xs font-medium rounded-full border backdrop-blur-sm ${stockStatus.color}`}>
          {stockStatus.text}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-300 group-hover:scale-110 hover:shadow-md"
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisted ? (
            <FaHeart className="text-red-500 w-4 h-4 animate-pulse" />
          ) : (
            <FaRegHeart className="text-gray-600 w-4 h-4 group-hover:text-red-500 transition-colors" />
          )}
        </button>
      </div>

      {/* Gender Badge */}
      {data.gender && (
        <div className="absolute top-12 left-2 z-20">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border backdrop-blur-sm flex items-center gap-1 ${getGenderBadgeColor()}`}>
            {getGenderIcon()}
            {data.gender}
          </span>
        </div>
      )}

      {/* Product Image Container */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 aspect-square overflow-hidden group-hover:bg-gradient-to-br group-hover:from-gray-100 group-hover:to-gray-200 transition-all duration-300">
        <div className="w-full h-full flex items-center justify-center p-3 lg:p-4">
          {productImage && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg"></div>
              )}
              <img
                src={productImage}
                alt={productName}
                className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-110 ${
                  data.stock <= 0 ? 'grayscale opacity-60' : ''
                } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
              <FaShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Hover Overlay with Quick Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <button
            onClick={handleQuickView}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-all duration-300 hover:bg-white"
            title="Quick View"
          >
            <FaEye className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Price and Discount Tags */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1">
          <div className="bg-black/90 backdrop-blur-sm text-white px-3 py-1.5 w-fit text-xs rounded-full font-semibold transform transition-all duration-300 group-hover:scale-105 shadow-lg">
            {DisplayPriceInRupees(discountedPrice)}
          </div>
          {Boolean(discount) && (
            <div className="text-white bg-gradient-to-r from-red-500 to-red-600 px-3 py-1 w-fit text-xs rounded-full font-semibold transform transition-all duration-300 group-hover:scale-105 shadow-lg">
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Savings Badge */}
        {Boolean(discount) && (
          <div className="absolute bottom-2 right-2">
            <div className="bg-green-500 text-white px-2 py-1 text-xs rounded-full font-medium shadow-lg">
              Save {DisplayPriceInRupees(savings)}
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 lg:p-4 space-y-3 relative z-10 flex-grow">
        {/* Brand/Category */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium transition-colors duration-300 group-hover:text-gray-700">
            {categoryName}
          </div>
          {discount > 0 && (
            <div className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
              SALE
            </div>
          )}
        </div>

        {/* Product Name with Search Highlighting */}
        <div className="font-medium text-gray-900 text-sm lg:text-base line-clamp-2 leading-tight transition-colors duration-300 group-hover:text-black">
          <ProductNameWithHighlight name={productName} searchTerm={searchTerm} />
        </div>

        {/* Product Description (if available) */}
        {description && (
          <div className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {description}
          </div>
        )}

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={10} 
                  className={`${i < 4 ? "text-yellow-400" : "text-gray-300"} transition-all duration-300`} />
              ))}
            </div>
            <span className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-700">(124)</span>
          </div>
          
          {/* Stock Quantity for Low Stock */}
          {data.stock > 0 && data.stock <= 10 && (
            <div className="text-xs text-orange-600 font-medium">
              {data.stock} left
            </div>
          )}
        </div>

        {/* Price and Action Section */}
        <div className="flex items-center justify-between gap-2 lg:gap-3 text-sm lg:text-base pt-3 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300 mt-auto">
          <div className="flex flex-col">
            <div className="font-bold text-gray-900 transition-all duration-300 group-hover:text-black group-hover:scale-105 origin-left">
              {DisplayPriceInRupees(discountedPrice)}
            </div>
            {Boolean(discount) && (
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500 line-through">
                  {DisplayPriceInRupees(price)}
                </div>
                <div className="text-xs text-green-600 font-medium">
                  You save {DisplayPriceInRupees(savings)}
                </div>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <AddToCartButton data={data} />
          </div>
        </div>

        {/* Additional Product Features */}
        {Object.keys(moreDetails).length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {Object.entries(moreDetails).slice(0, 2).map(([key, value]) => (
              <span key={key} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {key}: {value}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* New Badge for Recently Added Products */}
      {new Date() - new Date(createdAt) < 7 * 24 * 60 * 60 * 1000 && (
        <div className="absolute top-2 right-12 z-20">
          <span className="bg-blue-500 text-white px-2 py-1 text-xs font-bold rounded-full animate-pulse">
            NEW
          </span>
        </div>
      )}
    </Link>
  );
}

export default CardProduct;
