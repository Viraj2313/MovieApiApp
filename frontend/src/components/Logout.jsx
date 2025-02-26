import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const Logout = ({ handleLogout }) => {
  const navigate = useNavigate();

  return (
    <button
      style={{ backgroundColor: "#ff5722" }}
      className="h-10 my-4 rounded-xs text-white w-15"
      onClick={handleLogout}
    >
      Log out
    </button>
  );
};

export default Logout;
