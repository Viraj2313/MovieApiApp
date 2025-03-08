import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { Menu, X } from "lucide-react";

const NavBar = ({ user, handleLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="flex flex-nowrap justify-between items-center bg-gray-800 p-2 gap-4 min-h-20 sm:h-20 relative">
      {/* Left-aligned Navigation Links with Menu Button */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          className="text-white md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? (
            <X
              size={24}
              className="cursor-pointer text-white  hover:text-orange-500"
            />
          ) : (
            <Menu size={24} className="cursor-pointer hover:text-orange-500" />
          )}
        </button>
        <Link to={"/"}>
          <h2 className="text-white text-2xl sm:text-xl font-bold hover:text-orange-500 transition-colors">
            Movies
          </h2>
        </Link>
        <Link
          to={"/wishlist"}
          className="hidden md:block text-white text-md sm:text-xl font-bold hover:text-orange-500 transition-colors"
        >
          WatchList
        </Link>
        <Link
          to={"/friends"}
          className="hidden md:block text-white text-md sm:text-xl font-bold hover:text-orange-500 transition-colors"
        >
          Friends
        </Link>
        <Link
          to={"/recommendations"}
          className="hidden md:block text-white text-md sm:text-xl font-bold hover:text-orange-500 transition-colors"
        >
          Recommendations
        </Link>
      </div>

      {/* User Section (Always Visible) */}
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <strong className="font-light text-white text-sm sm:text-base">
              Welcome, {user}!
            </strong>
            <Logout handleLogout={handleLogout} />
          </>
        ) : (
          <div className="flex gap-2">
            <Link to={"/login"}>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-sm font-medium rounded-md shadow-md hover:from-orange-500 hover:to-orange-700 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                Login
              </button>
            </Link>
            <Link to={"/signup"}>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-sm font-medium rounded-md shadow-md hover:from-orange-500 hover:to-orange-700 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-20 left-0 bg-gray-800 w-full sm:hidden flex flex-col items-center shadow-md">
          <Link
            to={"/wishlist"}
            className="text-white text-md font-bold hover:text-orange-500 py-2"
            onClick={toggleMenu}
          >
            WatchList
          </Link>
          <Link
            to={"/friends"}
            className="text-white text-md font-bold hover:text-orange-500 py-2"
            onClick={toggleMenu}
          >
            Friends
          </Link>
          <Link
            to={"/recommendations"}
            className="text-white text-md font-bold hover:text-orange-500 py-2"
            onClick={toggleMenu}
          >
            Recommendations
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
