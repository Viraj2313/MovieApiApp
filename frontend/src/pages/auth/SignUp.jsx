import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { triggerNotification } from "../../utils/NotificationUtil";
import { toast } from "react-toastify";
const SignUp = ({ setUserName }) => {
  const navigate = useNavigate();
  const [user, setUserState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      navigate("/loading");
      const response = await axios.post(`/api/register`, user, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUserName(user.name);
        toast.success("Signed Up Successfully");
        setUserState({ name: "", email: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      triggerNotification("Signup failed", "error");
      toast.error("Signup failed");
      navigate("/signup");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={user.name}
            onChange={(e) => setUserState({ ...user, name: e.target.value })}
            className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={user.email}
            onChange={(e) => setUserState({ ...user, email: e.target.value })}
            className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) =>
              setUserState({ ...user, password: e.target.value })
            }
            className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
