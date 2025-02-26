import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/Home.css";
import { API_URL } from "../config";
import Loader from "./Loader";
import { triggerNotification } from "../utils/NotificationUtil";
import { Navigate, useNavigate } from "react-router-dom";
const WishList = ({ setSelectedMovie }) => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const getWishlist = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/wishlist`, {
        withCredentials: true,
      });
      setWishlist(response.data);
      console.log(wishlist);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getWishlist();
  }, []);

  //handle remove a movie
  const handleRemove = async (movie) => {
    try {
      const movieToDel = {
        movieId: movie.movieId,
      };
      const response = await axios.delete(`${API_URL}/api/remove`, {
        data: movieToDel,
        withCredentials: true,
      });

      if (response.status === 200) {
        triggerNotification("Movie removed from wishlist", "success");
        getWishlist();
      }
    } catch (error) {
      triggerNotification(`Unable to remove movie from wishlist`, "error");
      console.log(error);
    }
  };
  const handleClick = (movie) => {
    setSelectedMovie(movie.movieId);
    console.log(movie);
    navigate(`/about/${movie.movieTitle}`);
    console.log(`Clicked on movie: ${movie.movieTitle}`);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>WishList</div>
          <ul className="movieList">
            {wishlist && wishlist.length > 0 ? (
              wishlist.map((item) => (
                <li key={item.id}>
                  <img
                    src={item.moviePoster}
                    alt={`${item.movieTitle} Poster`}
                    onClick={() => handleClick(item)}
                  />
                  <h3>
                    {item.movieTitle}
                    <button
                      onClick={() => handleRemove(item)}
                      style={{ backgroundColor: "#ff5722" }}
                      className="bg-blue-600 text-white rounded-lg px-6 py-3 text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300 hover:bg-blue-700 focus:outline-none cursor-pointer"
                    >
                      Remove
                    </button>
                  </h3>
                </li>
              ))
            ) : (
              <p>No movies in wishlist</p>
            )}
          </ul>
        </>
      )}
    </>
  );
};

export default WishList;
