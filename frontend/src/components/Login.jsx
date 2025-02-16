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
          <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit}>
              <div className="px-10 py-5 border-2 border-black rounded-2xl color  bg-gray-50">
                <h1 className="text-center mb-25 text-3xl font-bold">
                  Login Here
                </h1>
                <div className="flex flex-col gap-5 ">
                  <input
                    placeholder="Enter your Email"
                    type="text"
                    name="email"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    className="border-2 w-60 h-10 
                    rounded-xl "
                  />
                  <input
                    placeholder="Enter your Password"
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    className="border-2 w-60 h-10 
                    rounded-xl"
                  />
                  <button type="submit" className="hover:bg-red-700">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
