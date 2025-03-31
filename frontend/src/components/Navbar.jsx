import React from "react";
import { Sun } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md py-4 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center shadow-md 
          transition-all duration-300 hover:shadow-orange-500/60 hover:scale-105">
            <Sun className="text-white" size={28} />
          </div>
          <span className="text-2xl md:text-3xl font-bold text-gray-900 transition-all duration-300 hover:text-orange-600">
            Solar Health
          </span>
        </div>

        {/* Call-to-Action Button with Brightness Effect */}
        <button className="hidden md:block bg-orange-500 text-white px-5 py-2 rounded-full text-lg font-medium 
        shadow-md hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/60 transition-all duration-300">
          Learn More
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
