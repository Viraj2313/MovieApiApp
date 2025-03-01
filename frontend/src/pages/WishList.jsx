import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/Home.css";
import { API_URL } from "../config";
import Loader from "../components/Loader";
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
    navigate(`/about/${movie.movieTitle}/${movie.movieId}`);
    console.log(`Clicked on movie with ID: ${movie.imdbID}`);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>WishList</div>
          <ul className="movie-list grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5 p-5">
            {wishlist && wishlist.length > 0 ? (
              wishlist.map((item) => (
                <li
                  key={item.id}
                  className="list-none flex flex-col text-center justify-start movie relative cursor-pointer overflow-hidden shadow-[0px_1px_11px_5px_rgba(0,0,0,0.4)] after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-[rgba(0,0,0,0.7)] after:z-10 after:pointer-events-none"
                >
                  <img
                    src={item.moviePoster}
                    alt={`${item.movieTitle} Poster`}
                    onClick={() => handleClick(item)}
                    className="w-[100%] h-auto transition-transform duration-300 ease hover:scale-110 hover:z-10"
                  />
                  <h3 className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 z-20 text-white p-1.5 px-4 rounded-md text-lg shadow-[1px_1px_5px_rgba(0,0,0,0.8)] w-64">
                    <span className="break-words mr-4 text-xl">
                      {item.movieTitle}
                    </span>
                    <button
                      onClick={() => handleRemove(item)}
                      style={{ backgroundColor: "#ff5722" }}
                      className="mt-2 border-none cursor-pointer bg-[#ff5722] text-white p-1.5 px-4 rounded-md transition-colors duration-300 ease relative z-20 hover:bg-[#e64a19]"
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
