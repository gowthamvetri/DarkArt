import React, { useState } from "react";
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
import logo from "../assets/shopping-cart.png";
import darkrt from "../assets/logo.jpeg"
import "../App.css";

// Animated SVG Logo Component
const AnimatedLogo = () => {
  return (
    <svg viewBox="0 0 300 120" width="220" height="80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#87CEEB">
            <animate 
              attributeName="stop-color" 
              values="#87CEEB; #A7D8FF; #87CEEB" 
              dur="8s" 
              repeatCount="indefinite" 
            />
          </stop>
          <stop offset="50%" stopColor="#A7D8FF">
            <animate 
              attributeName="stop-color" 
              values="#A7D8FF; #B0E4FF; #A7D8FF" 
              dur="8s" 
              repeatCount="indefinite" 
            />
          </stop>
          <stop offset="100%" stopColor="#B0E4FF">
            <animate 
              attributeName="stop-color" 
              values="#B0E4FF; #D1F3FF; #B0E4FF" 
              dur="8s" 
              repeatCount="indefinite" 
            />
          </stop>
        </linearGradient>

        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    
      <rect width="300" height="120" fill="transparent" />
      
      <circle cx="70" cy="60" r="15" fill="url(#logoGradient)" opacity="0.2">
        <animate attributeName="r" values="15;22;15" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="230" cy="60" r="12" fill="url(#logoGradient)" opacity="0.15">
        <animate attributeName="r" values="12;18;12" dur="5s" repeatCount="indefinite" />
      </circle>
      
      <text x="150" y="70" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="bold" textAnchor="middle" fill="url(#logoGradient)" filter="url(#glow)">DARKCART</text>
      
      <line x1="45" y1="85" x2="255" y2="85" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="x1" values="150;45;45" dur="2s" begin="0s" fill="freeze" />
        <animate attributeName="x2" values="150;255;255" dur="2s" begin="0s" fill="freeze" />
        <animate attributeName="stroke-width" values="0;3;3" dur="2s" begin="0s" fill="freeze" />
        <animate attributeName="opacity" values="0;0.7;1" dur="3s" begin="0s" fill="freeze" />
      </line>
    </svg>
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
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCartSection, setOpenCartSection] = useState(false);
  
  // Adjust header height to accommodate larger logo
  const headerHeight = "h-36 lg:h-25";

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

  return (
    <>
      <header className={`${headerHeight} lg:shadow-md sticky top-0 z-40 flex items-center justify-center flex-col lg:flex-row p-4 bg-white`}>
        {!(isSearch && ismobile) && (
          <div className="container mx-auto flex justify-between items-center h-full px-4">
            {/* Header with Animated Logo */}
            <div className="h-full flex items-center">
              <Link
                to={"/"}
                className="flex items-center gap-2 h-full"
              >
                {/* Responsive Logo */}
                {/* <img src={logo} width={80} alt="Logo" className="hidden lg:block" /> */}
                <img src={darkrt} alt="" width={100} />
                {/* Animated Logo */}
                {/* <AnimatedLogo /> */}

              </Link>
            </div>

            {/* Search bar */}
            <div className="hidden lg:block">
              <Search />
            </div>

            {/* Login/myCart */}
            <div className="flex gap-3">
              {/* Login mobile icon */}
              <button
                className="text-neutral-600 lg:hidden cursor-pointer"
                onClick={handleLoginNavigate}
              >
                <FaUserCircle size={30} />
              </button>
              {/* Login desktop */}
              <div className="hidden lg:flex items-center gap-9">
                {user?.name ? (
                  <div className="relative">
                    <div
                      className="flex items-center gap-2 cursor-pointer select-none"
                      onClick={() => setShowUserMenue((prev) => !prev)}
                    >
                      <p>Account</p>
                      {showUserMenue ? (
                        <GoTriangleUp size={20} />
                      ) : (
                        <GoTriangleDown size={20} />
                      )}
                    </div>
                    {showUserMenue && (
                      <div className="absolute top-14 right-[-1rem] bg-white lg:shadow-md w-56 py-2 rounded-md">
                        <div className="p-4">
                          <UserMenue close={handleUserMenu} />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleLoginNavigate}
                    className="bg-green-800 hover:bg-green-700 text-white px-4 py-3 rounded-sm cursor-pointer"
                  >
                    <p className="font-medium">Login</p>
                  </button>
                )}
                <button onClick={() => setOpenCartSection(true)}>
                  <Link
                    className="flex items-center gap-2 bg-green-800 hover:bg-green-700 text-white px-3 py-3 rounded-sm"
                  >
                    <div className="animate-bounce">
                      <BsCartCheckFill size={25} />
                    </div>
                    <div className="font-semibold text-sm">
                      {cartItem[0] ? (
                        <div>
                          <p>{totalQty} Items</p>
                          <p>{DisplayPriceInRupees(totalPrice)}</p>
                        </div>
                      ) : (
                        <p>My Cart</p>
                      )}
                    </div>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="lg:hidden container mx-auto px-5">
          <Search />
        </div>
        {openCartSection && (
          <DisplayCartItem close={() => setOpenCartSection(false)} />
        )}
      </header>
    </>
  );
}

export default Header;
