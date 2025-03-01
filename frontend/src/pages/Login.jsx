import axios from "axios";
import React, { useState } from "react";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { triggerNotification } from "../utils/NotificationUtil";

const Login = ({ setUserName, setUserId }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/login`, user, {
        withCredentials: true,
      });
      if (response.status === 200) {
        triggerNotification("Login success", "success");
        setUserName(response.data.userName);
        setUserId(response.data.userId);
        setUser({ email: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      triggerNotification("Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-gray-500">Logging in, please wait...</p>
            <Loader />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Enter your Email"
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your Password"
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
