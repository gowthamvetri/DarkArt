import React, { useState } from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { validURLConvert } from "../utils/validURLConvert";
import { Link } from "react-router-dom";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "./AddToCartButton";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";

function CardProduct({ data }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const url = `/product/${validURLConvert(data.name)}-${data._id}`;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const getStockStatus = () => {
    if (data.stock <= 0) {
      return { text: "Out of Stock", color: "text-red-600 bg-red-50 border-red-200" };
    } else if (data.stock <= 5) {
      return { text: `Only ${data.stock} left`, color: "text-orange-600 bg-orange-50 border-orange-200" };
    } else if (data.stock <= 10) {
      return { text: "Limited Stock", color: "text-yellow-600 bg-yellow-50 border-yellow-200" };
    } else {
      return { text: "In Stock", color: "text-green-600 bg-green-50 border-green-200" };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <Link
      to={url}
      className="bg-white shadow-sm hover:shadow-lg border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 group flex flex-col h-full relative"
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-300 group-hover:scale-110"
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500 w-4 h-4" />
        ) : (
          <FaRegHeart className="text-gray-600 w-4 h-4" />
        )}
      </button>

      {/* Stock Status Badge */}
      <div className="absolute top-2 left-2 z-10">
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${stockStatus.color}`}>
          {stockStatus.text}
        </span>
      </div>

      {/* Product Image Container */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 aspect-square overflow-hidden">
        <div className="w-full h-full flex items-center justify-center p-3 lg:p-4">
          <img
            src={data.image[0]}
            alt={data.name}
            className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 ${
              data.stock <= 0 ? 'grayscale opacity-60' : ''
            }`}
          />
        </div>

        {/* Overlay Effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Price and Discount Tags */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1">
          <div className="bg-black text-white px-2 py-1 w-fit text-xs rounded-full font-semibold transform transition-transform duration-300 group-hover:scale-105 shadow-sm">
            {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
          </div>
          {Boolean(data.discount) && (
            <div className="text-white bg-red-600 px-3 py-1 w-fit text-xs rounded-full font-semibold transform transition-transform duration-300 group-hover:scale-105 shadow-sm animate-pulse">
              {data.discount}% OFF
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 lg:p-4 space-y-2 relative z-10">
        {/* Brand/Category */}
        <div className="text-xs text-gray-500 uppercase tracking-wider font-medium transition-colors duration-300 group-hover:text-gray-700">
          {data.category?.[0]?.name || "Fashion"}
        </div>

        {/* Product Name */}
        <div className="font-medium text-gray-900 text-ellipsis text-sm lg:text-base line-clamp-2 leading-tight transition-colors duration-300 group-hover:text-black">
          {data.name}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={10} 
                className={`${i < 4 ? "text-yellow-400" : "text-gray-300"} transition-all duration-300`} />
            ))}
          </div>
          <span className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-700">(124)</span>
        </div>

        {/* Price and Action Section */}
        <div className="flex items-center justify-between gap-2 lg:gap-3 text-sm lg:text-base pt-2 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
          <div className="flex flex-col">
            <div className="font-bold text-gray-900 transition-all duration-300 group-hover:text-black group-hover:scale-105 origin-left">
              {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
            </div>
            {Boolean(data.discount) && (
              <div className="text-xs text-gray-500 line-through">
                {DisplayPriceInRupees(data.price)}
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <AddToCartButton data={data} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CardProduct;
