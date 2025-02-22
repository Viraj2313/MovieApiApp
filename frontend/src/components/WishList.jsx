import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/Home.css";
import { API_URL } from "../config";
import Loader from "./Loader";
import { triggerNotification } from "../utils/NotificationUtil";

const WishList = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getWishlist = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/wishlist`, {
        withCredentials: true,
      });
      alert("response: ", response.data);
      triggerNotification(`${response.data},"error`);
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
                  />
                  <h3>
                    {item.movieTitle}
                    <button onClick={() => handleRemove(item)}>Remove</button>
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
