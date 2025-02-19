import axios from "axios";
import React, { useState } from "react";
import { API_URL } from "../config";
import "../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { triggerNotification } from "../utils/NotificationUtil";
const Login = ({ setUserName, setUserId }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/login`, user, {
        withCredentials: true,
      });
      if (response.status == 200) {
        setLoading(false);
        triggerNotification("Login success", "success");
        setUserName(response.data.userName);
        setUserId(response.data.userId);
        console.log("login success");
        setUser({
          email: "",
          password: "",
        });
        navigate("/");
      }
      console.log(response.data.userName);
    } catch (error) {
      setLoading(false);
      console.error("Login failed with error:", error);
    }
  };
  return (
    <>
      <h1>Login</h1>
      <div>
        {loading ? (
          <>
            <h1>Logging, please wait</h1>
            <Loader />
          </>
        ) : (
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
        )}
      </div>
    </>
  );
};

export default Login;
