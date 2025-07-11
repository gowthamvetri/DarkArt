import React, { useState, useEffect, useRef } from "react";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import useMobile from "../hooks/useMobile";
import { BsCartCheckFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenue from "./UserMenue";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";
import "../App.css";
import logo from "../assets/logo.png";

const FashionLogo = () => {
  return (
    <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
      <img
        src={logo}
        alt="Logo"
        className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 object-contain"
      />
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold text-black font-serif tracking-wide leading-tight truncate">
          CASUAL CLOTHINGS
        </span>
        <span className="text-[6px] xs:text-[7px] sm:text-[8px] md:text-xs lg:text-sm text-gray-500 tracking-widest uppercase truncate">
          Fashion
        </span>
      </div>
    </div>
  );
};

function Header() {
  const ismobile = useMobile();
  const location = useLocation();
  const isSearch = location.pathname === "/search";
  const navigate = useNavigate();
  const [showUserMenue, setShowUserMenue] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state?.user);
  const { totalPrice, totalQty } = useGlobalContext();
  const [openCartSection, setOpenCartSection] = useState(false);
  const userMenuRef = useRef(null);
  const userMenuButtonRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showUserMenue && 
        userMenuRef.current && 
        !userMenuRef.current.contains(event.target) &&
        userMenuButtonRef.current &&
        !userMenuButtonRef.current.contains(event.target)
      ) {
        setShowUserMenue(false);
      }
    };

    const handleRouteChange = () => {
      setShowUserMenue(false);
    };

    const handleResize = () => {
      setShowUserMenue(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [showUserMenue, location.pathname]);

  const handleUserMenu = () => {
    setShowUserMenue(false);
  };

  const handleLoginNavigate = () => {
    if (!user?._id) {
      navigate("/login");
      return;
    }
    navigate("/user-menu-mobile");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current && 
        !userMenuRef.current.contains(event.target) && 
        !event.target.closest('.account-menu-trigger')
      ) {
        setShowUserMenue(false);
      }
    };

    const handleRouteChange = () => {
      setShowUserMenue(false);
    };

    const handleResize = () => {
      setShowUserMenue(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    handleRouteChange();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname]);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        {/* Top Banner - Enhanced Responsive */}
        <div className="bg-black text-white text-center py-1 sm:py-1.5 md:py-2 text-[10px] xs:text-xs sm:text-sm font-light tracking-wide">
          <p className="px-2 sm:px-4">
            <span className="hidden sm:inline">Free shipping on orders over ₹2,499 | Easy 30-day returns</span>
            <span className="sm:hidden">Free shipping over ₹2,499</span>
          </p>
        </div>

        <div className="container mx-auto px-2 xs:px-3 sm:px-4 md:px-6">
          <div className="flex items-center justify-between py-1 xs:py-1.5 sm:py-2 md:py-3 lg:py-4">
            {/* Logo + Title - Enhanced Responsive */}
            <Link to="/" className="flex-shrink-0 min-w-0">
              <FashionLogo />
            </Link>

            {/* Desktop Search - Better Breakpoints */}
            <div className="hidden lg:block flex-1 max-w-xs lg:max-w-md xl:max-w-lg 2xl:max-w-xl mx-3 lg:mx-6 xl:mx-8">
              <Search />
            </div>

            {/* Right Actions - Enhanced Responsive */}
            <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {/* Mobile & Tablet Actions */}
              <div className="lg:hidden flex items-center gap-1 xs:gap-2 sm:gap-3">
                {/* About Link */}
                <Link
                  to="/about"
                  className="text-gray-600 text-[10px] xs:text-xs sm:text-sm hover:text-black font-medium tracking-wide transition-colors px-1 py-1 rounded"
                >
                  About
                </Link>

                {/* User Button */}
                <button
                  className="text-gray-600 cursor-pointer hover:text-black transition-colors p-1 flex items-center gap-1"
                  onClick={handleLoginNavigate}
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user?.name || "User"} 
                      className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 rounded-full object-cover border-2 border-black"
                    />
                  ) : (
                    <FaUserCircle className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" />
                  )}
                  <span className="text-[10px] xs:text-xs sm:text-sm font-medium hidden sm:inline-block max-w-[60px] md:max-w-[80px] truncate">
                    {user?.name || "Sign In"}
                  </span>
                </button>
                
                {/* Cart Button for Medium Screens */}
                <button
                  className="text-gray-600 cursor-pointer hover:text-black transition-colors p-1 md:block hidden lg:hidden"
                  onClick={() => setOpenCartSection(true)}
                >
                  <div className="relative">
                    <BsCartCheckFill className="w-5 h-5 sm:w-6 sm:h-6" />
                    {cartItem.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] xs:text-[9px] sm:text-[10px] rounded-full w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 flex items-center justify-center font-bold">
                        {cartItem.length}
                      </span>
                    )}
                  </div>
                </button>
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-3 xl:gap-6">
                {/* About Link */}
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-black transition-colors font-medium tracking-wide relative after:absolute after:w-0 after:h-0.5 after:bg-black after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap text-sm xl:text-base px-1 py-1"
                >
                  About
                </Link>

                {/* Account/Login */}
                {user?.name ? (
                  <div className="relative" ref={userMenuRef}>
                    <div
                      className="flex items-center gap-1 xl:gap-2 cursor-pointer select-none text-gray-700 hover:text-black transition-colors px-2 xl:px-3 py-1 xl:py-2 rounded-md hover:bg-gray-50 account-menu-trigger"
                      onClick={() => setShowUserMenue((prev) => !prev)}
                    >
                      <div className="flex-shrink-0">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-7 h-7 xl:w-8 xl:h-8 rounded-full object-cover border-2 border-black"
                          />
                        ) : (
                          <FaUserCircle className="w-7 h-7 xl:w-8 xl:h-8 text-gray-700" />
                        )}
                      </div>
                      <div className="flex items-center min-w-0">
                        <span className="font-medium text-sm xl:text-base whitespace-nowrap truncate max-w-[60px] xl:max-w-[100px]">
                          {user.name}
                        </span>
                        {showUserMenue ? (
                          <GoTriangleUp className="w-4 h-4 ml-1 flex-shrink-0" />
                        ) : (
                          <GoTriangleDown className="w-4 h-4 ml-1 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    {showUserMenue && (
                      <div className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-lg w-56 xl:w-64 py-2 border border-gray-100 z-50">
                        <div className="p-3 xl:p-4">
                          <UserMenue close={handleUserMenu} />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleLoginNavigate}
                    className="bg-black hover:bg-gray-800 text-white px-3 xl:px-6 py-1.5 xl:py-2 rounded-md font-medium tracking-wide transition-colors whitespace-nowrap text-sm xl:text-base"
                  >
                    Sign In
                  </button>
                )}

                {/* Cart Button */}
                <button
                  onClick={() => setOpenCartSection(true)}
                  className="relative group"
                >
                  <div className="flex items-center gap-1 xl:gap-3 bg-black hover:bg-gray-800 text-white px-2 xl:px-4 py-1.5 xl:py-3 rounded-md transition-colors group-hover:shadow-lg">
                    <div className="animate-bounce flex-shrink-0">
                      <BsCartCheckFill className="w-4 h-4 xl:w-5 xl:h-5" />
                    </div>
                    <div className="font-medium text-xs xl:text-sm min-w-0">
                      {cartItem[0] ? (
                        <div className="text-left">
                          <p className="text-[10px] xl:text-xs text-gray-300 whitespace-nowrap">
                            {totalQty} Items
                          </p>
                          <p className="font-semibold whitespace-nowrap truncate max-w-[80px] xl:max-w-[100px]">
                            {DisplayPriceInRupees(totalPrice)}
                          </p>
                        </div>
                      ) : (
                        <p className="tracking-wide whitespace-nowrap">My Cart</p>
                      )}
                    </div>
                  </div>
                  {cartItem.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] xl:text-xs rounded-full w-4 h-4 xl:w-5 xl:h-5 flex items-center justify-center font-bold">
                      {cartItem.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Search */}
          <div className="lg:hidden pb-1 xs:pb-1.5 sm:pb-2 md:pb-3 px-0">
            <Search />
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </>
  );
}

export default Header;
