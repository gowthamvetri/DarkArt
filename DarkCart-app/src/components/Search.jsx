// import React, { useEffect, useState } from "react";
// import { IoSearch } from "react-icons/io5";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { TypeAnimation } from "react-type-animation";
// import { FaArrowLeft } from "react-icons/fa";
// import useMobile from "../hooks/useMobile";

// function Search() {
//   const navigate = useNavigate();
//   const locate = useLocation();
//   const [isSearch, setIsSearch] = useState(false);
//   const handleScreen = useMobile();
//   const location = useLocation();
//   const inputText = location.search.slice(3);

//   useEffect(() => {
//     const search = locate.pathname === "/search" ? true : false;
//     setIsSearch(search);
//   }, [locate]);

//   const handleSearch = () => {
//     navigate("/search");
//   };

//   const handleOnchange = (e) => {
//     const value = e.target.value;
//     if (value.length > 0) {
//       navigate("/search?q=" + value);
//     } else {
//       navigate("/search");
//     }
//   }

//   return (
//     <div className=" min-w-[300px] lg:min-w-[420px] h-10 lg:h-12 rounded-lg border border-gray-300 flex items-center overflow-hidden text-neutral-500 focus-within:border-yellow-500 group">
//       <div>
//         {
//             (isSearch&&handleScreen) ? (
//                 <Link to={"/"} className="flex items-center justify-center h-full p-4 group-focus-within:text-yellow-500 rounded-full shadow mr-2">
//                     <FaArrowLeft size={20} />  
//                 </Link>
//             ):
//             (<button className="flex items-center justify-center h-full p-4 group-focus-within:text-yellow-500">
//                 <IoSearch size={20} />
//               </button>)
//         }
//       </div>
//       <div className="flex-1 h-full w-full">
//         {isSearch ? (
//           <div className="w-full h-full">
//             <input
//               type="text"
//               placeholder="Search with the grocery items"
//               className="w-full h-full outline-none "
//               autoFocus={true}
//               defaultValue={inputText}
//               onChange={handleOnchange}
//             />
//           </div>
//         ) : (
//           <div onClick={handleSearch} className="flex-1 h-full lg:py-3 py-2">
//             <TypeAnimation
//               sequence={[
//                 'Search "Milk"',
//                 1000,
//                 'Search "Eggs"',
//                 1000,
//                 'Search "Bread"',
//                 1000,
//                 'Search "Butter"',
//                 1000,
//                 'Search "Chocolate"',
//                 1000,
//                 'Search "Rice"',
//                 1000,
//                 'Search "Aata"',
//                 1000,
//                 'Search "Sugar"',
//                 1000,
//               ]}
//               speed={50}
//               repeat={Infinity}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Search;
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
      className={`min-w-[300px] h-10 lg:h-12 rounded-full border border-blue-300 flex items-center overflow-hidden transition-all duration-300 ease-in-out focus-within:shadow-lg focus-within:border-blue-500 bg-blue-50 ${
        isSearch ? "lg:w-[520px]" : "lg:w-[420px]"
      }`}
    >
      <div>
        {isSearch && handleScreen ? (
          <Link
            to={"/"}
            className="flex items-center justify-center h-full p-4 hover:text-blue-600 transition-all"
          >
            <FaArrowLeft size={20} />
          </Link>
        ) : (
          <button className="flex items-center justify-center h-full p-4  transition-all">
            <IoSearch size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 h-full w-full">
        {isSearch ? (
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="Search grocery items..."
              className="w-full h-full outline-none  px-2"
              autoFocus={true}
              defaultValue={inputText}
              onChange={handleOnchange}
            />
          </div>
        ) : (
          <div
            onClick={handleSearch}
            className="flex-1 h-full lg:py-3 py-2 cursor-text px-2"
          >
            <TypeAnimation
              sequence={[
                'Search "Milk"',
                1000,
                'Search "Eggs"',
                1000,
                'Search "Bread"',
                1000,
                'Search "Butter"',
                1000,
                'Search "Chocolate"',
                1000,
                'Search "Rice"',
                1000,
                'Search "Aata"',
                1000,
                'Search "Sugar"',
                1000,
              ]}
              speed={50}
              repeat={Infinity}
              className="text-blue-400"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
