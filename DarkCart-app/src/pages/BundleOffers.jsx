import React, { useState, useEffect } from "react";
import { FaGift, FaShoppingCart, FaHeart, FaStar, FaFire, FaClock, FaPercent } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const BundleOffers = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hoveredBundle, setHoveredBundle] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 15,
    minutes: 30,
    seconds: 45
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

  const bundleOffers = [
    {
      id: 1,
      title: "Summer Fashion Combo",
      category: "summer",
      originalPrice: 4999,
      bundlePrice: 3499,
      discount: 30,
      rating: 4.8,
      reviews: 245,
      items: [
        { name: "Cotton T-Shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&crop=center" },
        { name: "Denim Shorts", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=300&fit=crop&crop=center" },
        { name: "Summer Cap", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=300&fit=crop&crop=center" }
      ],
      tag: "Popular",
      description: "Perfect summer outfit combo for casual outings"
    },
    {
      id: 2,
      title: "Winter Warmth Bundle",
      category: "winter",
      originalPrice: 7999,
      bundlePrice: 5999,
      discount: 25,
      rating: 4.9,
      reviews: 189,
      items: [
        { name: "Wool Sweater", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop&crop=center" },
        { name: "Winter Jacket", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop&crop=center" },
        { name: "Warm Scarf", image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=300&h=300&fit=crop&crop=center" }
      ],
      tag: "Limited",
      description: "Stay cozy with this complete winter collection"
    },
    {
      id: 3,
      title: "Office Professional Set",
      category: "formal",
      originalPrice: 8999,
      bundlePrice: 6999,
      discount: 22,
      rating: 4.7,
      reviews: 312,
      items: [
        { name: "Formal Shirt", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=300&fit=crop&crop=center" },
        { name: "Dress Pants", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop&crop=center" },
        { name: "Leather Belt", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center" },
        { name: "Tie", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center" }
      ],
      tag: "Bestseller",
      description: "Complete professional wardrobe for the modern workplace"
    },
    {
      id: 4,
      title: "Casual Weekend Vibes",
      category: "casual",
      originalPrice: 3999,
      bundlePrice: 2999,
      discount: 25,
      rating: 4.6,
      reviews: 198,
      items: [
        { name: "Casual Shirt", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop&crop=center" },
        { name: "Casual Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop&crop=center" },
        { name: "Sneakers", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center" }
      ],
      tag: "New",
      description: "Relaxed style for your weekend adventures"
    },
    {
      id: 5,
      title: "Athleisure Active Set",
      category: "sports",
      originalPrice: 5999,
      bundlePrice: 4499,
      discount: 25,
      rating: 4.8,
      reviews: 267,
      items: [
        { name: "Athletic Top", image: "https://images.unsplash.com/photo-1506629905607-bb5920e81893?w=300&h=300&fit=crop&crop=center" },
        { name: "Workout Pants", image: "https://images.unsplash.com/photo-1506629905607-bb5920e81893?w=300&h=300&fit=crop&crop=center" },
        { name: "Running Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&crop=center" }
      ],
      tag: "Trending",
      description: "Perfect for workouts and casual wear"
    },
    {
      id: 6,
      title: "Date Night Elegance",
      category: "formal",
      originalPrice: 9999,
      bundlePrice: 7499,
      discount: 25,
      rating: 4.9,
      reviews: 156,
      items: [
        { name: "Dress Shirt", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=300&fit=crop&crop=center" },
        { name: "Blazer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center" },
        { name: "Dress Shoes", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop&crop=center" },
        { name: "Watch", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&h=300&fit=crop&crop=center" }
      ],
      tag: "Premium",
      description: "Sophisticated style for special occasions"
    }
  ];

  const categories = [
    { id: "all", name: "All Bundles", icon: FaGift },
    { id: "summer", name: "Summer", icon: FaFire },
    { id: "winter", name: "Winter", icon: FaClock },
    { id: "formal", name: "Formal", icon: FaStar },
    { id: "casual", name: "Casual", icon: FaHeart },
    { id: "sports", name: "Sports", icon: FaPercent }
  ];

  const filteredBundles = selectedCategory === "all" 
    ? bundleOffers 
    : bundleOffers.filter(bundle => bundle.category === selectedCategory);

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
            {filteredBundles.map((bundle) => (
              <motion.div
                key={bundle.id}
                variants={itemVariants}
                layout
                initial="hidden"
                animate="visible"
                exit="hidden"
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredBundle(bundle.id)}
                onHoverEnd={() => setHoveredBundle(null)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 relative group"
              >
                {/* Tag */}
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

                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors group">
                  <FaHeart className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                </button>

                {/* Product Images */}
                <div className="relative h-64 bg-gray-100">
                  <div className="absolute inset-0 grid grid-cols-2 gap-1 p-4">
                    {bundle.items.slice(0, 4).map((item, index) => (
                      <div key={index} className="relative overflow-hidden rounded-lg">
                        <img
                          src={item.image}
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
                  
                  {/* Discount Badge */}
                  <div className="absolute bottom-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                    {bundle.discount}% OFF
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{bundle.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{bundle.description}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(bundle.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {bundle.rating} ({bundle.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-2xl font-bold text-gray-800">
                        ₹{bundle.bundlePrice.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-500 line-through ml-2">
                        ₹{bundle.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-green-600 font-bold">
                      Save ₹{(bundle.originalPrice - bundle.bundlePrice).toLocaleString()}
                    </div>
                  </div>

                  {/* Items List */}
                  {hoveredBundle === bundle.id && (
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
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 group">
                    <FaShoppingCart className="w-4 h-4 group-hover:animate-bounce" />
                    Add Bundle to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredBundles.length === 0 && (
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
