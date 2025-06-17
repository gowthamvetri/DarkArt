import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { FaArrowLeft } from "react-icons/fa";
import useMobile from "../hooks/useMobile";

function Search() {
  const navigate = useNavigate();
  const locate = useLocation();
  const [isSearch, setIsSearch] = useState(false);
  const handleScreen = useMobile();
  const location = useLocation();
  const inputText = location.search.slice(3);

  useEffect(() => {
    const search = locate.pathname === "/search";
    setIsSearch(search);
  }, [locate]);

  console.log("isSearch", isSearch);

  const handleSearch = () => {
    navigate("/search");
  };

  const handleOnchange = (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      navigate("/search?q=" + value);
    } else {
      navigate("/search");
    }
  };

  return (
    <div
      className={`min-w-[300px] h-10 lg:h-12 rounded-md border border-gray-300 bg-gray-50 flex items-center overflow-hidden transition-all duration-300 ease-in-out focus-within:shadow-lg focus-within:border-black focus-within:bg-white ${
        isSearch ? "lg:w-[520px]" : "lg:w-[420px]"
      }`}
    >
      <div>
        {isSearch && handleScreen ? (
          <Link
            to={"/"}
            className="flex items-center justify-center h-full p-4 text-gray-600 hover:text-black transition-colors"
          >
            <FaArrowLeft size={20} />
          </Link>
        ) : (
          <button className="flex items-center justify-center h-full p-4 text-gray-600 hover:text-black transition-colors">
            <IoSearch size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 h-full w-full">
        {isSearch ? (
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Search fashion items, brands, styles..."
              className="w-full h-full outline-none px-2 bg-transparent text-gray-900 placeholder-gray-500"
              autoFocus={true}
              defaultValue={inputText}
              onChange={handleOnchange}
            />
          </div>
        ) : (
          <div
            onClick={handleSearch}
            className="flex-1 h-full lg:py-3 py-2 cursor-text px-2 flex items-center"
          >
            <TypeAnimation
              sequence={[
                'Search "Dresses"',
                1000,
                'Search "Shirts"',
                1000,
                'Search "Jeans"',
                1000,
                'Search "Jackets"',
                1000,
                'Search "Shoes"',
                1000,
                'Search "Accessories"',
                1000,
                'Search "Bags"',
                1000,
                'Search "Jewelry"',
                1000,
              ]}
              speed={50}
              repeat={Infinity}
              className="text-gray-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
