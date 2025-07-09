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
import "../App.css";

// Fashion Logo Component
const FashionLogo = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-xl tracking-wider rounded-sm">
        CC
      </div>
      <div className="flex flex-col">
        <span className="text-xl md:text-2xl font-bold text-black tracking-wider font-serif">
          CASUAL CLOTHINGS
        </span>
        <span className="text-xs text-gray-500 tracking-widest uppercase">
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
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        {/* Top Banner */}
        <div className="bg-black text-white text-center py-2 text-sm font-light tracking-wide">
          <p>Free shipping on orders over ₹2,499 | Easy 30-day returns</p>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4 md:py-6">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <FashionLogo />
            </Link>

            {/* Desktop Search - Always visible */}
            <div className="hidden lg:block flex-1 max-w-lg mx-8">
              <Search />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 md:gap-6">
              {/* Mobile About & User Icon */}
              <div className="lg:hidden flex items-center gap-3">
                <Link
                  to="/about"
                  className="text-gray-600 text-sm hover:text-black font-medium tracking-wide transition-colors"
                >
                  About
                </Link>

                <button
                  className="text-gray-600 cursor-pointer hover:text-black transition-colors p-1"
                  onClick={handleLoginNavigate}
                >
                  <FaUserCircle size={24} />
                </button>
              </div>

              {/* Desktop User Menu + About + Cart */}
              <div className="hidden lg:flex items-center gap-8">
                {/* About Nav Item */}
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-black transition-colors font-medium tracking-wide relative after:absolute after:w-0 after:h-0.5 after:bg-black after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
                >
                  About
                </Link>

                {/* Account/Login */}
                {user?.name ? (
                  <div className="relative">
                    <div
                      className="flex items-center gap-2 cursor-pointer select-none text-gray-700 hover:text-black transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                      onClick={() => setShowUserMenue((prev) => !prev)}
                    >
                      <p className="font-medium tracking-wide">Account</p>
                      {showUserMenue ? (
                        <GoTriangleUp size={16} />
                      ) : (
                        <GoTriangleDown size={16} />
                      )}
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
                    className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md font-medium tracking-wide transition-colors"
                  >
                    Sign In
                  </button>
                )}

                {/* Cart Button */}
                <button
                  onClick={() => setOpenCartSection(true)}
                  className="relative group"
                >
                  <div className="flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-4 py-3 rounded-md transition-colors group-hover:shadow-lg">
                    <div className="animate-bounce">
                      <BsCartCheckFill size={20} />
                    </div>
                    <div className="font-medium text-sm">
                      {cartItem[0] ? (
                        <div className="text-left">
                          <p className="text-xs text-gray-300">{totalQty} Items</p>
                          <p className="font-semibold">
                            {DisplayPriceInRupees(totalPrice)}
                          </p>
                        </div>
                      ) : (
                        <p className="tracking-wide">My Cart</p>
                      )}
                    </div>
                  </div>
                  {/* Cart item count badge */}
                  {cartItem.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartItem.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Cart Button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setOpenCartSection(true)}
                  className="relative"
                >
                  {/* <div className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-md transition-colors">
                    <BsCartCheckFill size={18} />
                    <span className="text-sm font-medium">
                      {cartItem[0] ? `₹${totalPrice}` : "Cart"}
                    </span>
                  </div> */}
                  {/* {cartItem.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartItem.length}
                    </span>
                  )} */}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search - Always visible */}
          <div className="lg:hidden pb-4">
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
