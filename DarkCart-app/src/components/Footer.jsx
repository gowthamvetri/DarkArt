import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800 mt-20">
      {/* Newsletter Section */}
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
