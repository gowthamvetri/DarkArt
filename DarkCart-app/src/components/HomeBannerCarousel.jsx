import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Tag, Sparkles, Clock } from 'lucide-react';
import banner1 from "../assets/Homebanner/banner1.jpg";
import banner2 from "../assets/Homebanner/banner2.jpg";
import banner3 from "../assets/Homebanner/banner3.jpg";
import banner4 from "../assets/Homebanner/banner4.jpg";

const HomeBannerCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Enhanced banner images data
  const bannerImages = [
    {
      id: 1,
      image: banner1,
      title: "Summer Collection",
      subtitle: "Light & Comfortable Styles",
      highlight: "New Arrival",
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      id: 2,
      image: banner2,
      title: "Casual Essentials",
      subtitle: "Everyday Comfort Wear",
      highlight: "20% Off",
      icon: <Tag className="w-4 h-4" />
    },
    {
      id: 3,
      image: banner3,
      title: "Urban Style",
      subtitle: "Modern Street Fashion",
      highlight: "Limited Edition",
      icon: <Clock className="w-4 h-4" />
    },
    {
      id: 4,
      image: banner4,
      title: "Premium Fabrics",
      subtitle: "Quality That Lasts",
      highlight: "Best Seller",
      icon: <Sparkles className="w-4 h-4" />
    }
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev === bannerImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));
  };

  // Reset transitioning state after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800); // Slightly longer for smoother transitions
    return () => clearTimeout(timer);
  }, [activeIndex]);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000); // Slightly longer to give more time to view each slide
    return () => clearInterval(interval);
  }, []);

  // Handle swipe gestures
  const handleDragEnd = (e, { offset, velocity }) => {
    if (isTransitioning) return;
    
    const swipe = offset.x;
    
    if (Math.abs(velocity.x) > 0.5) {
      if (swipe < -50) {
        nextSlide();
      } else if (swipe > 50) {
        prevSlide();
      }
    }
  };

  return (
    <div className="w-full mx-auto relative overflow-hidden">
      {/* Progress Bar */}
      <motion.div 
        className="absolute top-0 left-0 h-1 bg-white z-20"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ 
          duration: 6,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }}
      />

      {/* Carousel Container */}
      <motion.div 
        className="relative overflow-hidden"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        onDragEnd={handleDragEnd}
      >
        {/* Navigation Arrows - Enhanced with animations */}
        <motion.button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2.5 md:p-3.5 rounded-full shadow-lg border border-gray-100 disabled:opacity-50"
          whileHover={{ scale: 1.1, backgroundColor: "#ffffff" }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
        </motion.button>
        
        <motion.button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-2.5 md:p-3.5 rounded-full shadow-lg border border-gray-100 disabled:opacity-50"
          whileHover={{ scale: 1.1, backgroundColor: "#ffffff" }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
        </motion.button>

        {/* Improved Crossfade Carousel */}
        <div className="relative h-[320px] md:h-[450px] lg:h-[580px] w-full">
          {bannerImages.map((banner, index) => (
            <AnimatePresence key={banner.id}>
              {index === activeIndex && (
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <div className="h-full w-full relative">
                    {/* Banner Image with improved handling */}
                    <motion.div 
                      className="absolute inset-0 overflow-hidden"
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover object-center"
                      />
                      {/* Enhanced overlay with gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                    </motion.div>

                    {/* Banner content - enhanced animations */}
                    <motion.div 
                      className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.7 }}
                    >
                      {/* Badge - replaces Shop Now button */}
                      <motion.div 
                        className="bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-full flex items-center gap-2 mb-6 shadow-lg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        whileHover={{ scale: 1.05, backgroundColor: "#ffffff" }}
                      >
                        {banner.icon}
                        <span className="font-semibold">{banner.highlight}</span>
                      </motion.div>
                      
                      <motion.h2 
                        className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                      >
                        {banner.title}
                      </motion.h2>
                      
                      <motion.div
                        className="w-16 h-1 bg-white rounded-full mb-3"
                        initial={{ width: 0 }}
                        animate={{ width: "4rem" }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      />
                      
                      <motion.p 
                        className="text-sm md:text-lg text-gray-100 max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                      >
                        {banner.subtitle}
                      </motion.p>
                      
                      {/* Feature dots - visual enhancement */}
                      <motion.div 
                        className="flex gap-2 mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                      >
                        {[...Array(3)].map((_, i) => (
                          <motion.div 
                            key={i}
                            className="w-2 h-2 rounded-full bg-white/70"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.1 + (i * 0.15) }}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Pagination Dots */}
      <div className="flex justify-center gap-3 mt-4 mb-2">
        {bannerImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setActiveIndex(index)}
            className="relative h-2.5 rounded-full transition-all"
            animate={activeIndex === index ? { scale: 1.2 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-full h-full bg-white rounded-full" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default HomeBannerCarousel;