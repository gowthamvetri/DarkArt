import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      {/* Newsletter Section */}
      <div className="bg-black py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4 font-serif">Stay in Style</h3>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            Subscribe to our newsletter for exclusive fashion updates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white text-black rounded-none focus:outline-none"
            />
            <button className="bg-white text-black px-8 py-3 font-semibold hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-6">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-xl">
              D
            </div>
            <span className="text-2xl font-bold tracking-wider font-serif">Casual Clothing Fashion</span>
          </div>
          <p className="text-gray-400 text-sm">© All copyrights from 2024</p>
          <p className="text-gray-400 text-sm">Elevating Fashion Since 2024</p>
        </div>
        
        <div className="flex justify-center gap-6 text-2xl">
          <a href="" className="hover:text-gray-300 transition-colors">
            <FaFacebook />
          </a>
          <a href="" className="hover:text-gray-300 transition-colors">
            <FaInstagram />
          </a>
          <a href="" className="hover:text-gray-300 transition-colors">
            <FaLinkedin />
          </a>
          <a href="" className="hover:text-gray-300 transition-colors">
            <FaTwitter />
          </a>
          <a href="" className="hover:text-gray-300 transition-colors">
            <FaYoutube />
          </a>
        </div>  
        
      </div>
    </footer>
  );
}

export default Footer;
