import React from 'react';
import CardSwap, { Card } from '../components/CardSwap';

// Import banner images
const banner1 = "/HomeBanner/banner1.jpg";
const banner2 = "/HomeBanner/banner2.jpg"; 
const banner3 = "/HomeBanner/banner3.jpg";
const banner4 = "/HomeBanner/banner4.jpg";

const HomeBannerCarousel = () => {
  const bannerData = [
    {
      image: banner1,
      title: "Summer Collection",
      description: "Discover our latest summer styles with breathable fabrics and vibrant designs perfect for the season."
    },
    {
      image: banner2,
      title: "Casual Essentials", 
      description: "Everyday comfort wear that combines style and functionality for your daily adventures."
    },
    {
      image: banner3,
      title: "Urban Style",
      description: "Modern street fashion that makes a statement with contemporary cuts and bold designs."
    },
    {
      image: banner4,
      title: "Premium Fabrics",
      description: "Experience luxury with our premium fabric collection designed for lasting quality and comfort."
    }
  ];

  return (
    <div className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 card-carousel-container">
      {/* Background content */}
      <div className="absolute inset-0 flex items-start md:items-center justify-start px-4 md:px-8 lg:px-16 xl:px-20 pt-8 md:pt-0">
        <div className="max-w-sm sm:max-w-md lg:max-w-xl xl:max-w-2xl banner-text-fade">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 mb-3 md:mb-4 leading-tight">
            Fashion That 
            <span className="block text-black">Defines You</span>
          </h1>
          <p className="z-100 text-gray-600 text-base sm:text-lg md:text-xl lg:text-2xl mb-4 md:mb-6 leading-relaxed w-100 bg-white/10 backdrop-blur-md border border-white/30 rounded-lg shadow-lg p-6">
            Explore our curated collection of premium clothing designed for the modern lifestyle.
          </p>
          <button className="bg-black text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-10 lg:py-5 rounded-none hover:bg-gray-800 transition-all duration-300 font-medium tracking-wide text-xs sm:text-sm md:text-base lg:text-lg transform hover:scale-105">
            Shop Collection
          </button>
        </div>
      </div>

      {/* CardSwap component with responsive settings */}
      <CardSwap
        width={420}
        height={340}
        cardDistance={55}
        verticalDistance={65}
        delay={4000}
        pauseOnHover={true}
        responsive={true}
        easing="elastic"
        onCardClick={(index) => console.log(`Card ${index + 1} clicked`)}
      >
        {bannerData.map((banner, index) => (
          <Card 
            key={index}
            title={banner.title}
            description={banner.description}
            role="img"
            aria-label={`${banner.title}: ${banner.description}`}
            tabIndex={0}
          >
            <img 
              src={banner.image} 
              alt={banner.title}
              className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
              loading={index === 0 ? 'eager' : 'lazy'}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDQwMCAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTYwQzIwNyAxNjAgMjEzIDEwNCAyMjAgMTA0VjIxNkMxOTMgMjE2IDE4MCAyMDMgMTgwIDE2MEMxODAgMTM3IDE5MyAxMjQgMjAwIDEyNFYxNjBaIiBmaWxsPSIjOUI5QjlCIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI5QjlCIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=';
              }}
            />
          </Card>
        ))}
      </CardSwap>
    </div>
  );
};
export default HomeBannerCarousel;