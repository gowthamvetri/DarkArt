import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AxiosTostError from "../utils/AxiosTostError";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

function CategoryWiseProductDisplay({ id, name }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const loadingCardNumber = new Array(6).fill(null);
  const containerRef = useRef();

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: [id],
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosTostError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryWiseProduct();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const updateScrollInfo = () => {
        const container = containerRef.current;
        setScrollPosition(container.scrollLeft);
        setMaxScroll(container.scrollWidth - container.clientWidth);
      };

      updateScrollInfo();
      // Update scroll metrics when window resizes
      window.addEventListener("resize", updateScrollInfo);
      // Update scroll position when scrolling
      containerRef.current.addEventListener("scroll", updateScrollInfo);

      return () => {
        window.removeEventListener("resize", updateScrollInfo);
        if (containerRef.current) {
          containerRef.current.removeEventListener("scroll", updateScrollInfo);
        }
      };
    }
  }, [data]);

  const handleScrollRight = () => {
    containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleScrollLeft = () => {
    containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  return (
    <div className="relative bg-white py-6 overflow-hidden">
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-bold text-xl md:text-2xl text-gray-900 font-serif relative group">
          {name}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
        </h3>
        <Link
          to={`/category/${id}`}
          className="text-black hover:text-gray-600 font-medium tracking-wide transition-all duration-300 relative group"
        >
          See All
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>

      {/* Scrollable Product Cards */}
      <div className="relative">
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 container mx-auto px-4 overflow-x-auto scroll-smooth no-scrollbar py-4"
          ref={containerRef}
          style={{ scrollBehavior: "smooth" }}
        >
          {loading &&
            loadingCardNumber.map((_, index) => (
              <div
                key={"CategorywiseProductDisplay123" + index}
                className="flex-shrink-0 transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="w-48 h-80 sm:w-52 sm:h-84 md:w-56 md:h-88 lg:w-64 lg:h-96">
                  <CardLoading />
                </div>
              </div>
            ))}

          {/* Make sure data is valid before rendering */}
          {data.map((product, index) =>
            product && product._id ? (
              <div key={product._id + "CategorywiseProductDisplay" + index}>
                <CardProduct data={product} />
              </div>
            ) : null
          )}
        </div>

        {/* Scroll Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
          <button
            onClick={handleScrollLeft}
            disabled={scrollPosition <= 0}
            className={`z-10 bg-white hover:bg-gray-100 shadow-lg text-gray-700 hover:text-black p-3 rounded-full pointer-events-auto hidden lg:block border border-gray-200 transition-all duration-300 ${
              scrollPosition <= 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-xl hover:scale-105"
            }`}
            aria-label="Scroll left"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleScrollRight}
            disabled={scrollPosition >= maxScroll}
            className={`z-10 bg-white hover:bg-gray-100 shadow-lg text-gray-700 hover:text-black p-3 rounded-full pointer-events-auto hidden lg:block border border-gray-200 transition-all duration-300 ${
              scrollPosition >= maxScroll
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-xl hover:scale-105"
            }`}
            aria-label="Scroll right"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>

      {/* Add CSS animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default CategoryWiseProductDisplay;
