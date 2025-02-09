import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/Home.css";
import { API_URL } from "../config";

const WishList = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
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
    getWishlist();
  }, []);

  //handle remove a movie
  const handleRemove = async (movie) => {
    try {
      const userId = sessionStorage.getItem("User Id");
      const movieToDel = {
        userId: userId,
        movieId: movie.movieId,
      };
      const response = await axios.delete(
        `${API_URL}/api/add_wishlist`,
        { data: movieToDel },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Movie removed from wishlist");
      }
    } catch (error) {
      alert("Unable to remove the movie from wishlist");
      console.log(error);
    }
  };

  if (loading) {
    return <>Loading...</>;
  }
  if (error) {
    return <>Error: {error}</>;
  }
  return (
    <>
      <div>WishList</div>
      <ul className="movieList">
        {wishlist ? (
          wishlist.map((item) => (
            <li key={item.id}>
              <img src={item.moviePoster}></img>
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
  );
};

export default WishList;
