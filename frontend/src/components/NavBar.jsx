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
              <button className="px-4 py-2 bg-orange-500 text-white text-sm  rounded-md hover:bg-orange-700 transition-colors max-w-20">
                Login
              </button>
            </Link>
            <Link to={"/signup"}>
              <button className="px-4 py-2 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-700 transition-colors max-w-21">
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
