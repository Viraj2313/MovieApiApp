import axios from "axios";
import React, { useState } from "react";
import { API_URL } from "../config";

const Login = ({ setUserName }) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
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

      window.location.href = "/";
    }
    console.log("login failed", response.status);
    console.log(response.userName);
  };
  return (
    <>
      <h1>Login</h1>
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
    </>
  );
};

export default Login;
