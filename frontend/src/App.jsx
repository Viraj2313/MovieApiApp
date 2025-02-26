import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import SignUp from "./components/SignUp";
import AboutMovie from "./components/AboutMovie";
import Login from "./components/Login";
import WishList from "./components/WishList";
import axios from "axios";
import { API_URL } from "./config";
import { triggerNotification } from "./utils/NotificationUtil";
import Friends from "./components/Friends";
import Chat from "./components/Chat";
function App() {
  const navigate = useNavigate();
  const [user, setUserName] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user`, {
          withCredentials: true,
        });

        if (response.data.userName) {
          setUserName(response.data.userName);
        }
      } catch (error) {
        console.log("User not logged in or session expired.");
      }
    };

    fetchUser();

    const sessionInterval = setInterval(checkSessionExpiration, 1800000); // 30 min

    return () => clearInterval(sessionInterval); // Cleanup interval on unmount
  }, []);

  const checkSessionExpiration = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/check-session`, {
        withCredentials: true,
      });

      if (response.status === 200 && response.data.userId) {
        console.log("Session Active:", response.data.userId);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Session expired or invalid:", error);
      handleLogout();
    }
  };
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      triggerNotification("Logout success", "error");
      setUserId(null);
      setUserName(null);
      navigate("/");
    } catch (error) {
      triggerNotification("Logout failed, please try again", "error");
      console.log("Logout failed", error.response?.data || error.message);
    }
  };
  return (
    <>
      <NavBar
        user={user}
        setUserName={setUserName}
        setUserId={setUserId}
        handleLogout={handleLogout}
        userId={userId}
      />
      <Routes>
        <Route
          path="/wishlist"
          element={<WishList setSelectedMovie={setSelectedMovie} />}
        ></Route>
        <Route
          path="/"
          element={
            <Home
              setSelectedMovie={setSelectedMovie}
              setUserId={setUserId}
              userId={userId}
            />
          }
        />
        <Route path="/signup" element={<SignUp setUserName={setUserName} />} />
        <Route
          path="/about/:movieName"
          element={<AboutMovie selectedMovie={selectedMovie} />}
        />
        setUserId={setUserId}
        <Route
          path="/login"
          element={<Login setUserName={setUserName} setUserId={setUserId} />}
        />
        <Route
          path="/friends"
          element={
            <Friends user={user} userId={userId} setUserId={setUserId} />
          }
        />
        <Route path="/chatHub" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;
