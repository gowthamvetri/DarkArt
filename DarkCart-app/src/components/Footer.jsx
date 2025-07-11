import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaShieldAlt, FaTruck, FaUndoAlt, FaHeadset } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-xl rounded-lg shadow-md">
                D
              </div>
              <span className="text-xl font-bold tracking-wide text-gray-900">DarkArtX</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Elevating your style with premium fashion collections. Discover the latest trends and timeless classics.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-black hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200">
                <FaFacebook className="text-sm" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-black hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200">
                <FaInstagram className="text-sm" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-black hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200">
                <FaTwitter className="text-sm" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-black hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200">
                <FaLinkedin className="text-sm" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 hover:bg-black hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200">
                <FaYoutube className="text-sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-black pb-2 inline-block">
              Shop & Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/search" className="text-gray-600 hover:text-black hover:pl-2 transition-all duration-300">
                  Shop Now
                </Link>
              </li>
              <li>
                <Link to="/lookbook" className="text-gray-600 hover:text-black hover:pl-2 transition-all duration-300">
                  Lookbook
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-black hover:pl-2 transition-all duration-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-gray-600 hover:text-black hover:pl-2 transition-all duration-300">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-black pb-2 inline-block">
              Customer Service
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-black hover:pl-2 transition-all duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="text-gray-600 hover:text-black hover:pl-2 transition-all duration-300">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/dashboard/myorders" className="text-gray-600 hover:text-black hover:pl-2 transition-all duration-300">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/dashboard/profile" className="text-gray-600 hover:text-black hover:pl-2 transition-all duration-300">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b-2 border-black pb-2 inline-block">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <FaMapMarkerAlt className="text-black" />
                <span className="text-sm">123 Fashion Street, Style City, SC 12345</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <FaPhone className="text-black" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <FaEnvelope className="text-black" />
                <span className="text-sm">support@darkartx.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-sm text-gray-500">
              © {currentYear} DarkArtX. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <Link to="/about" className="hover:text-black transition-colors">About Us</Link>
              <Link to="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</Link>
              <Link to="/terms-conditions" className="hover:text-black transition-colors">Terms of Service</Link>
              <Link to="/sustainability" className="hover:text-black transition-colors">Sustainability</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
