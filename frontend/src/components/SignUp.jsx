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
    <div className="form-box">
      <form className="form" onSubmit={handleSubmit}>
        <span className="title">Sign up</span>
        <span className="subtitle">Create a free account with your email.</span>
        <div className="form-container">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={user.name}
            onChange={(e) => setUserState({ ...user, name: e.target.value })}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUserState({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) =>
              setUserState({ ...user, password: e.target.value })
            }
          />
        </div>
        <button type="submit">Sign up</button>
      </form>
      <div className="form-section">
        <p>
          Have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
