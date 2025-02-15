import React, { useState } from "react";
import axios from "axios";
import "../assets/styles/SignUp.css";
import { API_URL } from "../config";
import { Link } from "react-router-dom";
import { triggerNotification } from "../utils/NotificationUtil";
const SignUp = ({ setUserName }) => {
  const [user, setUserState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/register`, user, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUserName(user.name);
        triggerNotification("Signed Up Successfully", "success");
        setUserState({
          name: "",
          email: "",
          password: "",
        });

        window.location.href = "/";
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit}>
        <div className="px-10 py-5 border-2 border-black rounded-2xl color  bg-gray-50">
          <h1 className="text-center mb-25 text-3xl font-bold">Sign up</h1>
          <div className="flex flex-col gap-5 ">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={user.name}
              onChange={(e) => setUserState({ ...user, name: e.target.value })}
              className="border-2 w-60 h-10 
                    rounded-xl "
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUserState({ ...user, email: e.target.value })}
              className="border-2 w-60 h-10 
                    rounded-xl "
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) =>
                setUserState({ ...user, password: e.target.value })
              }
              className="border-2 w-60 h-10 
                    rounded-xl "
            />
            <button type="submit" className="hover:bg-red-700">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
