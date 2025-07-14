import React, { useState, useEffect } from "react";
import { FaLeaf, FaShoppingCart, FaHeart, FaStar, FaSnowflake, FaSun, FaUmbrella, FaFire, FaClock, FaPercent, FaTag } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const SeasonalSale = () => {
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [sortBy, setSortBy] = useState("discount");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const seasonalProducts = [
    {
      id: 1,
      name: "Winter Wool Coat",
      season: "winter",
      originalPrice: 8999,
      salePrice: 5399,
      discount: 40,
      rating: 4.8,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop&crop=center",
      tag: "Hot Deal",
      stock: 15,
      colors: ["Black", "Navy", "Gray"],
      sizes: ["S", "M", "L", "XL"],
      features: ["Wool Blend", "Water Resistant", "Premium Quality"]
    },
    {
      id: 2,
      name: "Summer Linen Shirt",
      season: "summer",
      originalPrice: 2999,
      salePrice: 1999,
      discount: 33,
      rating: 4.6,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center",
      tag: "Bestseller",
      stock: 28,
      colors: ["White", "Blue", "Beige"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      features: ["100% Linen", "Breathable", "Easy Care"]
    },
    {
      id: 3,
      name: "Monsoon Rain Jacket",
      season: "monsoon",
      originalPrice: 4999,
      salePrice: 2999,
      discount: 40,
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=500&fit=crop&crop=center",
      tag: "Limited Edition",
      stock: 8,
      colors: ["Yellow", "Navy", "Green"],
      sizes: ["S", "M", "L", "XL"],
      features: ["Waterproof", "Lightweight", "Packable"]
    },
    {
      id: 4,
      name: "Spring Floral Dress",
      season: "spring",
      originalPrice: 3999,
      salePrice: 2399,
      discount: 40,
      rating: 4.9,
      reviews: 312,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop&crop=center",
      tag: "New Arrival",
      stock: 22,
      colors: ["Pink", "Blue", "White"],
      sizes: ["XS", "S", "M", "L"],
      features: ["Floral Print", "Comfortable Fit", "Machine Washable"]
    },
    {
      id: 5,
      name: "Autumn Leather Boots",
      season: "autumn",
      originalPrice: 6999,
      salePrice: 4199,
      discount: 40,
      rating: 4.8,
      reviews: 198,
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=500&fit=crop&crop=center",
      tag: "Premium",
      stock: 12,
      colors: ["Brown", "Black", "Tan"],
      sizes: ["7", "8", "9", "10", "11"],
      features: ["Genuine Leather", "Comfortable Sole", "Durable"]
    },
    {
      id: 6,
      name: "Winter Cashmere Scarf",
      season: "winter",
      originalPrice: 3999,
      salePrice: 1999,
      discount: 50,
      rating: 4.9,
      reviews: 267,
      image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=500&fit=crop&crop=center",
      tag: "Flash Sale",
      stock: 35,
      colors: ["Gray", "Navy", "Burgundy", "Cream"],
      sizes: ["One Size"],
      features: ["100% Cashmere", "Ultra Soft", "Luxury Feel"]
    },
    {
      id: 7,
      name: "Summer Beach Shorts",
      season: "summer",
      originalPrice: 1999,
      salePrice: 1299,
      discount: 35,
      rating: 4.5,
      reviews: 145,
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop&crop=center",
      tag: "Popular",
      stock: 42,
      colors: ["Blue", "Green", "Orange", "Red"],
      sizes: ["S", "M", "L", "XL"],
      features: ["Quick Dry", "Lightweight", "Elastic Waist"]
    },
    {
      id: 8,
      name: "Monsoon Umbrella",
      season: "monsoon",
      originalPrice: 1499,
      salePrice: 899,
      discount: 40,
      rating: 4.4,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop&crop=center",
      tag: "Essential",
      stock: 67,
      colors: ["Black", "Navy", "Red"],
      sizes: ["Standard"],
      features: ["Wind Resistant", "Compact", "Auto Open/Close"]
    },
    {
      id: 9,
      name: "Spring Cotton Blazer",
      season: "spring",
      originalPrice: 5999,
      salePrice: 3599,
      discount: 40,
      rating: 4.7,
      reviews: 201,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=center",
      tag: "Trending",
      stock: 18,
      colors: ["Navy", "Gray", "Beige"],
      sizes: ["S", "M", "L", "XL"],
      features: ["Cotton Blend", "Structured Fit", "Versatile Style"]
    }
  ];

  const seasons = [
    { id: "all", name: "All Seasons", icon: FaLeaf, color: "from-green-500 to-blue-500" },
    { id: "summer", name: "Summer", icon: FaSun, color: "from-yellow-500 to-orange-500" },
    { id: "winter", name: "Winter", icon: FaSnowflake, color: "from-blue-500 to-purple-500" },
    { id: "monsoon", name: "Monsoon", icon: FaUmbrella, color: "from-blue-600 to-indigo-600" },
    { id: "spring", name: "Spring", icon: FaLeaf, color: "from-green-400 to-emerald-500" },
    { id: "autumn", name: "Autumn", icon: FaLeaf, color: "from-orange-500 to-red-500" }
  ];

  const sortOptions = [
    { value: "discount", label: "Highest Discount" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" }
  ];

  const filteredProducts = selectedSeason === "all" 
    ? seasonalProducts 
    : seasonalProducts.filter(product => product.season === selectedSeason);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "discount":
        return b.discount - a.discount;
      case "price-low":
        return a.salePrice - b.salePrice;
      case "price-high":
        return b.salePrice - a.salePrice;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-300/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-green-300/20 rounded-full animate-pulse delay-500"></div>
        </div>

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <FaLeaf className="text-6xl md:text-8xl animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
              Seasonal Sale
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Embrace every season with style! Up to 50% off on seasonal collections
            </p>
            
            {/* Sale Timer */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-lg mx-auto border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-4">
                <FaFire className="text-orange-400 animate-pulse" />
                <p className="text-sm font-medium">🌟 Mega Sale Ends In:</p>
                <FaFire className="text-orange-400 animate-pulse" />
              </div>
              <div className="grid grid-cols-4 gap-3 text-center">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Min" },
                  { value: timeLeft.seconds, label: "Sec" }
                ].map((time, index) => (
                  <div key={index} className="bg-white/20 rounded-xl p-3 border border-white/30">
                    <div className="text-2xl md:text-3xl font-bold">{time.value}</div>
                    <div className="text-xs opacity-80">{time.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Season Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Shop by Season</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {seasons.map((season) => {
              const IconComponent = season.icon;
              return (
                <button
                  key={season.id}
                  onClick={() => setSelectedSeason(season.id)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedSeason === season.id
                      ? `bg-gradient-to-r ${season.color} text-white shadow-xl scale-105`
                      : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {season.name}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Sort and Stats */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">
              {sortedProducts.length} items found
            </span>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              Up to 50% OFF
            </span>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {sortedProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                layout
                initial="hidden"
                animate="visible"
                exit="hidden"
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredProduct(product.id)}
                onHoverEnd={() => setHoveredProduct(null)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative group"
              >
                {/* Product Image */}
                <div className="relative h-80 bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                      product.tag === "Hot Deal" ? "bg-red-500" :
                      product.tag === "Bestseller" ? "bg-green-500" :
                      product.tag === "Limited Edition" ? "bg-purple-500" :
                      product.tag === "New Arrival" ? "bg-blue-500" :
                      product.tag === "Premium" ? "bg-yellow-500" :
                      product.tag === "Flash Sale" ? "bg-orange-500" :
                      product.tag === "Popular" ? "bg-pink-500" :
                      product.tag === "Essential" ? "bg-indigo-500" :
                      "bg-gray-500"
                    }`}>
                      {product.tag}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {product.discount}% OFF
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-300 group opacity-0 group-hover:opacity-100">
                    <FaHeart className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                  </button>

                  {/* Stock Badge */}
                  {product.stock < 20 && (
                    <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      Only {product.stock} left
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Colors */}
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-xs text-gray-500 mr-2">Colors:</span>
                    {product.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className={`w-4 h-4 rounded-full border-2 border-gray-300 ${
                          color.toLowerCase() === "black" ? "bg-black" :
                          color.toLowerCase() === "white" ? "bg-white" :
                          color.toLowerCase() === "navy" ? "bg-navy-600" :
                          color.toLowerCase() === "gray" ? "bg-gray-400" :
                          color.toLowerCase() === "blue" ? "bg-blue-500" :
                          color.toLowerCase() === "red" ? "bg-red-500" :
                          color.toLowerCase() === "green" ? "bg-green-500" :
                          color.toLowerCase() === "yellow" ? "bg-yellow-400" :
                          color.toLowerCase() === "orange" ? "bg-orange-500" :
                          color.toLowerCase() === "brown" ? "bg-amber-700" :
                          "bg-gray-300"
                        }`}
                        title={color}
                      ></div>
                    ))}
                    {product.colors.length > 3 && (
                      <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-800">
                        ₹{product.salePrice.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-green-600 font-bold text-sm">
                      Save ₹{(product.originalPrice - product.salePrice).toLocaleString()}
                    </div>
                  </div>

                  {/* Features (shown on hover) */}
                  {hoveredProduct === product.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4"
                    >
                      <div className="flex flex-wrap gap-1">
                        {product.features.map((feature, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 group">
                    <FaShoppingCart className="w-4 h-4 group-hover:animate-bounce" />
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FaLeaf className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try selecting a different season or check back later for new arrivals!</p>
          </motion.div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated with Seasonal Sales!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Be the first to know about new seasonal collections and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-gray-800 to-black text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Don't Miss These Seasonal Deals!</h3>
          <p className="text-lg mb-6">Limited time offers on your favorite seasonal styles</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-full font-bold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
          >
            <FaShoppingCart />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SeasonalSale;
