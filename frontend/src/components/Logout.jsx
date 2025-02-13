import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const Logout = ({ handleLogout }) => {
  const navigate = useNavigate();

  return <button onClick={handleLogout}>Log out</button>;
};

export default Logout;
