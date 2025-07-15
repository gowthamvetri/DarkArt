import React, { useState, useEffect } from "react";
import { FaGift, FaShoppingCart, FaHeart, FaStar, FaFire, FaClock, FaPercent } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import useCart from "../hooks/useCart";
import { useSelector } from "react-redux";

const BundleOffers = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredBundle, setHoveredBundle] = useState(null);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 15,
    minutes: 30,
    seconds: 45
  });

  // Cart hook and user state
  const { addBundleToCart, loading: cartLoading } = useCart();
  const user = useSelector(state => state?.user);

  // Fetch bundles from API
  const fetchBundles = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(SummaryApi.getBundles.url);
      
      if (response.data.success) {
        const bundleData = Array.isArray(response.data.data) ? response.data.data : [];
        setBundles(bundleData.filter(bundle => bundle.isActive)); // Only show active bundles
      }
    } catch (error) {
      console.error("Error fetching bundles:", error);
      toast.error("Failed to load bundles");
    } finally {
      setLoading(false);
    }
  };

  // Load bundles on component mount
  useEffect(() => {
    fetchBundles();
  }, []);

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

  const categories = [
    { id: "all", name: "All Bundles", icon: FaGift },
    { id: "summer", name: "Summer", icon: FaFire },
    { id: "winter", name: "Winter", icon: FaClock },
    { id: "formal", name: "Formal", icon: FaStar },
    { id: "casual", name: "Casual", icon: FaHeart },
    { id: "sports", name: "Sports", icon: FaPercent },
    { id: "ethnic", name: "Ethnic", icon: FaHeart }
  ];

  const filteredBundles = selectedCategory === "all" 
    ? bundles 
    : bundles.filter(bundle => bundle.category === selectedCategory);

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

  // Handle adding bundle to cart
  const handleAddToCart = async (bundleId) => {
    if (!user?._id) {
      toast.error('Please login to add items to cart');
      return;
    }

    const result = await addBundleToCart(bundleId);
    if (result.success) {
      // Optional: You can add any additional success handling here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <FaGift className="text-6xl md:text-8xl animate-bounce" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Bundle Offers
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Get more for less! Mix and match your favorite items with our exclusive bundle deals
            </p>
            
            {/* Countdown Timer */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-sm mb-4 font-medium">⚡ Limited Time Offer Ends In:</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-2xl font-bold">{timeLeft.days}</div>
                  <div className="text-xs">Days</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-2xl font-bold">{timeLeft.hours}</div>
                  <div className="text-xs">Hours</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                  <div className="text-xs">Minutes</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                  <div className="text-xs">Seconds</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </motion.div>

        {/* Bundle Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {loading ? (
              // Loading skeletons
              [...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              filteredBundles.map((bundle) => (
                <motion.div
                  key={bundle._id}
                  variants={itemVariants}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover={{ y: -10 }}
                  onHoverStart={() => setHoveredBundle(bundle._id)}
                  onHoverEnd={() => setHoveredBundle(null)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative group"
                >
                  {/* Tag */}
                  {bundle.tag && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                        bundle.tag === "Popular" ? "bg-red-500" :
                        bundle.tag === "Limited" ? "bg-orange-500" :
                        bundle.tag === "Bestseller" ? "bg-green-500" :
                        bundle.tag === "New" ? "bg-blue-500" :
                        bundle.tag === "Trending" ? "bg-purple-500" :
                        "bg-pink-500"
                      }`}>
                        {bundle.tag}
                      </span>
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors group">
                    <FaHeart className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                  </button>

                  {/* Product Images */}
                  <div className="relative h-64 bg-gray-100">
                    {bundle.images && bundle.images.length > 0 ? (
                      <img
                        src={bundle.images[0]}
                        alt={bundle.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : bundle.items && bundle.items.length > 0 ? (
                      <div className="absolute inset-0 grid grid-cols-2 gap-1 p-4">
                        {bundle.items.slice(0, 4).map((item, index) => (
                          <div key={index} className="relative overflow-hidden rounded-lg">
                            <img
                              src={item.image || '/placeholder.jpg'}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            {index === 3 && bundle.items.length > 4 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white font-bold">+{bundle.items.length - 3}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <FaGift className="text-6xl text-gray-400" />
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    <div className="absolute bottom-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                      {bundle.discount || 0}% OFF
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{bundle.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{bundle.description || 'Complete bundle package with great savings!'}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(bundle.rating || 0)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {(bundle.rating || 0).toFixed(1)} ({bundle.reviews || 0} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">
                          ₹{bundle.bundlePrice?.toLocaleString()}
                        </span>
                        <span className="text-lg text-gray-500 line-through ml-2">
                          ₹{bundle.originalPrice?.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-green-600 font-bold">
                        Save ₹{((bundle.originalPrice || 0) - (bundle.bundlePrice || 0)).toLocaleString()}
                      </div>
                    </div>

                    {/* Items List */}
                    {hoveredBundle === bundle._id && bundle.items && bundle.items.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4"
                      >
                        <h4 className="font-semibold text-gray-800 mb-2">Bundle includes:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {bundle.items.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              {item.name}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {/* Action Button */}
                    <button 
                      onClick={() => handleAddToCart(bundle._id)}
                      disabled={cartLoading || (bundle.stock && bundle.stock <= 0)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaShoppingCart className={`w-4 h-4 ${cartLoading ? 'animate-spin' : 'group-hover:animate-bounce'}`} />
                      {cartLoading ? 'Adding...' : bundle.stock && bundle.stock <= 0 ? 'Out of Stock' : 'Add Bundle to Cart'}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {!loading && filteredBundles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FaGift className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No bundles found</h3>
            <p className="text-gray-500">Try selecting a different category or check back later for new offers!</p>
          </motion.div>
        )}
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don't Miss Out on These Amazing Deals!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Bundle up and save big on your favorite fashion items. Limited time offers!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            <FaShoppingCart />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BundleOffers;
