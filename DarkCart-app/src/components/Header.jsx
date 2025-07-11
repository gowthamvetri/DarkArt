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
    <div className="flex items-center gap-1 sm:gap-3">
      <img
        src={logo}
        alt="Logo"
        className="w-7 sm:w-10 md:w-14 lg:w-16 xl:w-20 h-auto object-contain"
      />
      <div className="flex flex-col">
        <span className="text-xs sm:text-base md:text-xl lg:text-2xl font-bold text-black font-serif tracking-wide leading-tight header-logo-text">
          CASUAL CLOTHINGS
        </span>
        <span className="text-[8px] sm:text-xs lg:text-sm text-gray-500 tracking-widest uppercase header-logo-subtitle">
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

    // Close dropdown when route changes
    const handleRouteChange = () => {
      setShowUserMenue(false);
    };

    // Close dropdown when switching from mobile to desktop
    const handleResize = () => {
      setShowUserMenue(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    
    // Cleanup event listeners
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

  // Close user menu when clicking outside, navigating, or changing window size
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

    // Close menu when route changes
    const handleRouteChange = () => {
      setShowUserMenue(false);
    };

    // Close menu when window size changes (responsive handling)
    const handleResize = () => {
      setShowUserMenue(false);
    };

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    // Run route change handler when location changes
    handleRouteChange();

    // Clean up event listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname]);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        {/* Top Banner */}
        <div className="bg-black text-white text-center py-1 sm:py-2 text-xs sm:text-sm font-light tracking-wide">
          <p className="px-1">Free shipping on orders over ₹2,499 | Easy 30-day returns</p>
        </div>

        <div className="container mx-auto px-4 header-container">
          <div className="flex items-center justify-between py-1 sm:py-2 md:py-4">
            {/* Logo + Title */}
            <Link to="/" className="flex-shrink-0">
              <FashionLogo />
            </Link>

            {/* Desktop Search */}
            <div className="hidden xl:block flex-1 max-w-md xl:max-w-lg mx-2 xl:mx-8">
              <Search />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-4 md:gap-6 mobile-header-spacing mid-desktop-spacing">
              {/* Mobile & Mid-Desktop About & User Icon */}
              <div className="xl:hidden flex items-center gap-2 sm:gap-3 mobile-header-icons">
                <Link
                  to="/about"
                  className="text-gray-600 text-xs sm:text-sm hover:text-black font-medium tracking-wide transition-colors"
                >
                  About
                </Link>

                <button
                  className="text-gray-600 cursor-pointer hover:text-black transition-colors p-1 flex items-center gap-1"
                  onClick={handleLoginNavigate}
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user?.name || "User"} 
                      className="w-7 h-7 rounded-full object-cover border-2 border-black"
                    />
                  ) : (
                    <FaUserCircle size={22} />
                  )}
                  <span className="text-xs font-medium hidden sm:inline-block mobile-username text-ellipsis overflow-hidden whitespace-nowrap">{user?.name || "Sign In"}</span>
                </button>
                
                {/* Mid-Desktop Cart Button */}
                <button
                  className="text-gray-600 cursor-pointer hover:text-black transition-colors p-1 lg:block hidden xl:hidden"
                  onClick={() => setOpenCartSection(true)}
                >
                  <div className="relative">
                    <BsCartCheckFill size={22} />
                    {cartItem.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                        {cartItem.length}
                      </span>
                    )}
                  </div>
                </button>
              </div>

              {/* Desktop User Menu + About + Cart */}
              <div className="hidden xl:flex items-center gap-2 xl:gap-6 header-actions mid-desktop-hide">
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-black transition-colors font-medium tracking-wide relative after:absolute after:w-0 after:h-0.5 after:bg-black after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap text-sm lg:text-base px-1"
                >
                  About
                </Link>

                {/* Account/Login */}
                {user?.name ? (
                  <div className="relative" ref={userMenuRef}>
                    <div
                      className="flex items-center gap-1 lg:gap-2 cursor-pointer select-none text-gray-700 hover:text-black transition-colors px-2 lg:px-3 py-1 lg:py-2 rounded-md hover:bg-gray-50 account-menu-trigger"
                      onClick={() => setShowUserMenue((prev) => !prev)}
                    >
                      <div className="flex-shrink-0">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-8 h-8 rounded-full object-cover border-2 border-black"
                          />
                        ) : (
                          <FaUserCircle size={24} className="text-gray-700" />
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-sm hidden md:inline-block whitespace-nowrap text-ellipsis overflow-hidden max-w-[80px] lg:max-w-[100px] user-name-display">{user.name}</span>
                        {showUserMenue ? (
                          <GoTriangleUp size={16} className="ml-1 flex-shrink-0" />
                        ) : (
                          <GoTriangleDown size={16} className="ml-1 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    {showUserMenue && (
                      <div className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-lg w-64 py-2 border border-gray-100 z-50">
                        <div className="p-4">
                          <UserMenue close={handleUserMenu} />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleLoginNavigate}
                    className="bg-black hover:bg-gray-800 text-white px-4 lg:px-6 py-2 rounded-md font-medium tracking-wide transition-colors whitespace-nowrap"
                  >
                    Sign In
                  </button>
                )}

                {/* Cart Button */}
                <button
                  onClick={() => setOpenCartSection(true)}
                  className="relative group"
                >
                  <div className="flex items-center gap-1 lg:gap-2 xl:gap-3 bg-black hover:bg-gray-800 text-white px-2 lg:px-3 xl:px-4 py-2 lg:py-3 rounded-md transition-colors group-hover:shadow-lg cart-button">
                    <div className="animate-bounce flex-shrink-0">
                      <BsCartCheckFill size={18} />
                    </div>
                    <div className="font-medium text-xs lg:text-sm">
                      {cartItem[0] ? (
                        <div className="text-left">
                          <p className="text-[10px] lg:text-xs text-gray-300 whitespace-nowrap">{totalQty} Items</p>
                          <p className="font-semibold whitespace-nowrap">
                            {DisplayPriceInRupees(totalPrice)}
                          </p>
                        </div>
                      ) : (
                        <p className="tracking-wide whitespace-nowrap">My Cart</p>
                      )}
                    </div>
                  </div>
                  {cartItem.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartItem.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search (also for mid-desktop breakpoint) */}
          <div className="xl:hidden pb-2 sm:pb-3 px-0 sm:px-1">
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
