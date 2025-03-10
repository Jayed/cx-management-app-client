import React, { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaHome, FaHistory, FaUsers } from "react-icons/fa"; // Import the icons

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md mb-6">
      <div className="navbar container mx-auto px-4">
        {/* Left - Logo & Mobile Menu */}
        <div className="navbar-start">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Hailin Trade
          </Link>
        </div>

        {/* Center - Desktop Menu */}
        <div className="navbar-center">
          <ul className="menu menu-horizontal px-4 space-x-4">
            {/* Home  */}
            <li>
              <Link to="/" className="hover:text-blue-600">
                <FaHome className="font-bold text-lg text-blue-400" />
                <span className="text-cyan-900">Home</span>
              </Link>
            </li>
            {/* Customer  */}
            <li>
              <Link
                to="/manage-customers"
                className="hover:text-blue-600 flex items-center"
              >
                <FaUsers className="font-bold text-lg text-blue-400" />
                <span className="text-cyan-900">Customers</span>
              </Link>
            </li>
            {/* Services  */}
            {/* <li className="relative group">
              <button className="hover:text-blue-600">
                <FaHistory className="font-bold text-md text-blue-400" />
                Services
              </button>
              <ul className="p-2 bg-white shadow-md rounded-lg absolute mt-1 hidden group-hover:block">
                <li>
                  <Link to="/service1" className="hover:bg-gray-200 p-2 block">
                    Export
                  </Link>
                </li>
                <li>
                  <Link to="/service2" className="hover:bg-gray-200 p-2 block">
                    Import
                  </Link>
                </li>
              </ul>
            </li> */}
          </ul>
        </div>

        {/* Right - Action Button */}
        {/* <div className="navbar-end">
          <Link to="/login" className="btn btn-primary">
            Get Started
          </Link>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
