import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const Logout = ({ setUserName }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response.data.message);

      setUserName(null);
      navigate("/");
    } catch (error) {
      console.log("Logout failed", error.response?.data || error.message);
    }
  };

  return <button onClick={handleLogout}>Log out</button>;
};

export default Logout;
