import axios from "axios";
import React, { useState } from "react";
import { API_URL } from "../config";
import "../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";
const Login = ({ setUserName }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/login`, user, {
        withCredentials: true,
      });
      if (response.status == 200) {
        setUserName(response.data.userName);

        console.log("login success");
        setUser({
          email: "",
          password: "",
        });
        navigate("/");
      }
      console.log(response.data.userName);
    } catch (error) {
      console.error("Login failed with error:", error);
    }
  };
  return (
    <>
      <h1>Login</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default Login;
