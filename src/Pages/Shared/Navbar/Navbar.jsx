import React, { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

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
          <div className="dropdown relative" ref={dropdownRef}>
            <button
              className="btn btn-ghost lg:hidden"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <FaBars className="text-xl" />
            </button>
            {/* Mobile Menu */}
            <ul
              className={`menu menu-sm dropdown-content bg-white rounded-b-lg shadow-lg absolute z-10 mt-2 w-48 p-2 transform transition-all duration-900 ${
                isDropdownOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 hidden"
              }`}
            >
              <li>
                <Link
                  to="/"
                  onClick={() => setIsDropdownOpen(false)}
                  className="hover:bg-gray-200 p-2 block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/customers"
                  onClick={() => setIsDropdownOpen(false)}
                  className="hover:bg-gray-200 p-2 block"
                >
                  Customers
                </Link>
              </li>
              <li>
                <details className="group">
                  <summary className="hover:bg-gray-200 p-2 block cursor-pointer">
                    Services
                  </summary>
                  <ul className="pl-4">
                    <li>
                      <Link
                        to="/service1"
                        onClick={() => setIsDropdownOpen(false)}
                        className="hover:bg-gray-200 p-2 block"
                      >
                        Service 1
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/service2"
                        onClick={() => setIsDropdownOpen(false)}
                        className="hover:bg-gray-200 p-2 block"
                      >
                        Service 2
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>
          <Link to="/" className="text-xl font-bold text-gray-800">
            Hailin Trade
          </Link>
        </div>

        {/* Center - Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-4 space-x-4">
            <li>
              <Link to="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/customers" className="hover:text-blue-600">
                Customers
              </Link>
            </li>
            <li className="relative group">
              <button className="hover:text-blue-600">Services</button>
              <ul className="p-2 bg-white shadow-md rounded-lg absolute mt-1 hidden group-hover:block">
                <li>
                  <Link to="/service1" className="hover:bg-gray-200 p-2 block">
                    Service 1
                  </Link>
                </li>
                <li>
                  <Link to="/service2" className="hover:bg-gray-200 p-2 block">
                    Service 2
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Right - Action Button */}
        <div className="navbar-end">
          <Link to="/login" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
