import React from "react";
import "../assets/styles/NavBar.css";
import { Link } from "react-router-dom";

const NavBar = ({ user, handleLogout }) => {
  return (
    <nav>
      <div className="tabs">
        <Link to={"/"}>
          <h2>Movies</h2>
        </Link>
        <Link to={"/wishlist"}>
          <h2>Watch List</h2>
        </Link>
      </div>

      <div className="nav-btns">
        {user ? (
          <>
            <strong className="wlc">Welcome, {user}!</strong>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to={"/login"}>
              <button>Login</button>
            </Link>

            <Link to={"/signup"}>
              <button>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
