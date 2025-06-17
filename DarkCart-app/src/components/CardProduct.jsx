import React, { useState } from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { validURLConvert } from "../utils/validURLConvert";
import { Link } from "react-router-dom";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddToCartButton from "./AddToCartButton";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";

function CardProduct({ data }) {
  const url = `/product/${validURLConvert(data.name)}-${data._id}`;
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group relative">
      <Link
        to={url}
        className="border border-gray-200 p-4 lg:p-4 grid gap-2 lg:gap-3 min-w-36 lg:min-w-52 rounded-lg cursor-pointer bg-white hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        {/* Product Image Container */}
        <div className="relative min-h-32 w-full max-h-40 lg:max-h-48 rounded-md overflow-hidden bg-gray-50">
          <img
            src={data.image[0]}
            alt={data.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-100"
          >
            {isWishlisted ? (
              <FaHeart size={14} className="text-red-500" />
            ) : (
              <FaRegHeart size={14} className="text-gray-600" />
            )}
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <div className="rounded-full text-xs w-fit px-3 py-1 text-white bg-black font-medium">
              NEW
            </div>
            {Boolean(data.discount) && (
              <div className="text-white bg-red-600 px-3 py-1 w-fit text-xs rounded-full font-semibold">
                {data.discount}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {/* Brand/Category */}
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            {data.category?.name || "Fashion"}
          </div>

          {/* Product Name */}
          <div className="font-medium text-gray-900 text-ellipsis text-sm lg:text-base line-clamp-2 leading-tight">
            {data.name}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={10} className={i < 4 ? "text-yellow-400" : "text-gray-300"} />
              ))}
            </div>
            <span className="text-xs text-gray-500">(124)</span>
          </div>

          {/* Unit/Size Info */}
          <div className="text-xs text-gray-600 font-medium">
            {data.unit}
          </div>
        </div>

        {/* Price and Action Section */}
        <div className="flex items-center justify-between gap-2 lg:gap-3 text-sm lg:text-base pt-2 border-t border-gray-100">
          <div className="flex flex-col">
            <div className="font-bold text-gray-900">
              {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
            </div>
            {Boolean(data.discount) && (
              <div className="text-xs text-gray-500 line-through">
                {DisplayPriceInRupees(data.price)}
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            {data.stock == 0 ? (
              <div className="text-red-600 text-xs text-center font-medium bg-red-50 px-3 py-2 rounded-md">
                Out of Stock
              </div>
            ) : (
              <AddToCartButton data={data} />
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CardProduct;
