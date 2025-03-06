import React from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";

const NavBar = ({ user, setUserName, setUserId, handleLogout, userId }) => {
  return (
    <nav className="flex flex-nowrap justify-between items-center bg-gray-800 p-2 gap-4 min-h-20 sm:h-20">
      {/* Links Section */}
      <div className="flex gap-4 sm:gap-9">
        <Link to={"/"}>
          <h2 className="text-white text-md sm:text-2xl font-bold hover:text-orange-500 transition-colors">
            Movies
          </h2>
        </Link>
        <Link to={"/wishlist"}>
          <h2 className="text-white text-md sm:text-2xl font-bold hover:text-orange-500 transition-colors">
            WatchList
          </h2>
        </Link>
        <Link to={"/friends"}>
          <h2 className="text-white text-md sm:text-2xl font-bold hover:text-orange-500 transition-colors">
            Friends
          </h2>
        </Link>
      </div>

      {/* User/Authentication Section */}
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <strong className="font-light text-white text-sm sm:text-base">
              Welcome, {user}!
            </strong>
            <Logout handleLogout={handleLogout}></Logout>
          </>
        ) : (
          <div className="flex gap-2">
            <Link to={"/login"}>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-sm font-medium rounded-md shadow-md hover:from-orange-500 hover:to-orange-700 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                Login
              </button>
            </Link>
            <Link to={"/signup"}>
              <button className="px-2 sm:px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-sm font-medium  sm:max-w-21 rounded-md shadow-md hover:from-orange-500 hover:to-orange-700 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer  max-h-[36px] max-w-[70px]">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
