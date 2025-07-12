import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Tag, Sparkles, Clock } from 'lucide-react';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const banner1 = "/HomeBanner/banner1.jpg";
const banner2 = "/HomeBanner/banner2.jpg"; 
const banner3 = "/HomeBanner/banner3.jpg";
const banner4 = "/HomeBanner/banner4.jpg";

// Simple performance optimization hook
const usePerformanceOptimization = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  
  useEffect(() => {
    // Simple performance detection based on device memory and connection
    const checkPerformance = () => {
      const deviceMemory = navigator.deviceMemory || 4;
      const connection = navigator.connection;
      const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
      
      setIsLowPerformance(deviceMemory < 4 || isSlowConnection);
    };
    
    checkPerformance();
  }, []);
  
  return { isLowPerformance };
};

// Simple debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const HomeBannerCarousel = React.memo(() => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const carouselWrapperRef = useRef(null);
  const horizontalContainerRef = useRef(null);
  
  // Performance monitoring
  const { isLowPerformance } = usePerformanceOptimization();
  
  // Memoized banner images data to prevent recreation on every render
  const bannerImages = useMemo(() => [
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
  ], []);

  // Debounced callbacks for better performance
  const debouncedSetScrollProgress = useCallback(
    debounce((progress) => setScrollProgress(progress), 16), // ~60fps
    []
  );

  const debouncedUpdateIndex = useCallback(
    debounce((newIndex) => {
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }, 50), // Less frequent index updates
    [currentIndex]
  );

  // GSAP ScrollTrigger for horizontal scrolling
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (horizontalContainerRef.current && carouselWrapperRef.current) {
        const totalWidth = bannerImages.length * 100; // Each banner takes 100vw
        
        // Create horizontal scroll animation with better performance
        gsap.to(horizontalContainerRef.current, {
          x: () => -(totalWidth - 100) + "vw",
          ease: "none",
          scrollTrigger: {
            trigger: carouselWrapperRef.current,
            start: "top top",
            end: () => "+=" + (window.innerHeight * bannerImages.length * (isLowPerformance ? 0.6 : 0.8)),
            scrub: isLowPerformance ? 0.1 : 0.5, // Faster scrub for low-performance devices
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            onUpdate: (self) => {
              const progress = self.progress;
              debouncedSetScrollProgress(progress);
              
              // Throttle index updates to reduce re-renders
              const newIndex = Math.floor(progress * bannerImages.length);
              const clampedIndex = Math.min(newIndex, bannerImages.length - 1);
              
              debouncedUpdateIndex(clampedIndex);
            }
          }
        });

        // Pre-load and optimize banner content animations
        bannerImages.forEach((_, index) => {
          const banner = horizontalContainerRef.current?.children[index];
          if (banner) {
            const content = banner.querySelector('.banner-content');
            const image = banner.querySelector('img');
            
            if (content && image) {
              // Ensure images are loaded and optimized
              gsap.set(image, { 
                force3D: true,
                transformOrigin: "center center"
              });
              
              gsap.set(content, { 
                force3D: true,
                transformOrigin: "center center"
              });

              // Simplified content animation with better performance
              gsap.fromTo(content, 
                {
                  opacity: 0.2,
                  scale: 0.95,
                  y: isLowPerformance ? 10 : 20
                },
                {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  duration: isLowPerformance ? 0.3 : 0.6,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: carouselWrapperRef.current,
                    start: `${index * 20}% top`,
                    end: `${(index + 1) * 20}% top`,
                    toggleActions: "play reverse play reverse",
                    scrub: isLowPerformance ? 0.1 : 0.3,
                    fastScrollEnd: true
                  }
                }
              );
            }
          }
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
      // Clean up any remaining animations
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === carouselWrapperRef.current) {
          trigger.kill();
        }
      });
    };
  }, [bannerImages.length, isLowPerformance, debouncedSetScrollProgress, debouncedUpdateIndex]);

  // Debounced resize handler for better performance
  useEffect(() => {
    let resizeTimeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Carousel Wrapper - This gets pinned during scroll */}
      <div ref={carouselWrapperRef} className="relative h-screen overflow-hidden">
        {/* Progress Bar - Optimized */}
        <div 
          className="absolute top-0 left-0 h-1 bg-white z-30 transition-all duration-100 ease-out"
          style={{ 
            width: `${scrollProgress * 100}%`,
            transform: 'translateZ(0)' // Force GPU acceleration
          }}
        />

        {/* Horizontal Scrolling Container - Optimized for performance */}
        <div 
          ref={horizontalContainerRef}
          className="flex h-full horizontal-carousel"
          style={{ 
            width: `${bannerImages.length * 100}vw`,
            willChange: 'transform',
            transform: 'translateZ(0)' // Force GPU acceleration
          }}
        >
          {bannerImages.map((banner, index) => (
            <div
              key={banner.id}
              className="relative flex-shrink-0 w-screen h-full"
              style={{ willChange: 'transform' }}
            >
              {/* Banner Image - Optimized */}
              <div className="absolute inset-0" style={{ willChange: 'transform' }}>
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  style={{ 
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                    imageRendering: 'high-quality'
                  }}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                {/* Overlay - Optimized */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" 
                  style={{ willChange: 'opacity' }}
                />
              </div>

              {/* Banner Content - Optimized for smooth animations */}
              <div 
                className={`banner-content absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 z-10 transition-all duration-500 ${
                  index === currentIndex ? 'active' : 'inactive'
                }`}
                style={{
                  opacity: index === currentIndex ? 1 : 0.3,
                  transform: `scale(${index === currentIndex ? 1 : 0.95}) translateZ(0)`,
                  willChange: 'opacity, transform'
                }}
              >
                {/* Badge - Bright when active */}
                <div 
                  className={`badge backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 mb-6 shadow-lg transition-all duration-300 hover:scale-105 ${
                    index === currentIndex 
                      ? 'bg-white/98 text-black' 
                      : 'bg-white/75 text-gray-700'
                  }`}
                  style={{ willChange: 'transform' }}
                >
                  {banner.icon}
                  <span className="font-semibold text-sm md:text-base">
                    {banner.highlight}
                  </span>
                </div>
                
                {/* Title - Bright and bold when active */}
                <h2 
                  className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 transition-all duration-300"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {banner.title}
                </h2>
                
                {/* Divider - Bright when active */}
                <div 
                  className={`w-16 h-1 rounded-full mb-4 transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white' 
                      : 'bg-gray-400 opacity-60'
                  }`}
                  style={{ willChange: 'transform' }}
                />
                
                {/* Subtitle - Clear and readable when active */}
                <p 
                  className="text-lg md:text-xl max-w-2xl leading-relaxed transition-all duration-300"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {banner.subtitle}
                </p>
                
                {/* Feature dots - Bright when active */}
                <div className="flex gap-2 mt-8">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-white' 
                          : 'bg-white/40'
                      }`}
                      style={{ willChange: 'transform' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Pagination Dots - Optimized */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {bannerImages.map((_, index) => (
            <div
              key={index}
              className="relative h-2 w-8 rounded-full bg-white/30 overflow-hidden transition-transform duration-200"
              style={{ 
                transform: currentIndex === index ? 'scale(1.2)' : 'scale(1)',
                willChange: 'transform'
              }}
            >
              <div 
                className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                style={{ 
                  width: currentIndex === index ? '100%' : '30%',
                  opacity: currentIndex === index ? 1 : 0.5,
                  willChange: 'width, opacity'
                }}
              />
            </div>
          ))}
        </div>

        {/* Scroll Indicator - Simplified animation */}
        <div className="absolute bottom-8 right-8 text-white text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 z-20">
          <span>Scroll to explore</span>
          <span className="animate-bounce">↓</span>
        </div>
      </div>
    </div>
  );
});

HomeBannerCarousel.displayName = 'HomeBannerCarousel';

export default HomeBannerCarousel;