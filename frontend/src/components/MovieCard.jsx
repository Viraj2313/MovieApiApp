import React from "react";
import { useNavigate } from "react-router-dom";
import { triggerNotification } from "../utils/NotificationUtil";
import axios from "axios";
import { API_URL } from "../config";

const MovieCard = ({
  movie,
  setSelectedMovie,
  showRemoveButton,
  getWishlist,
}) => {
  const navigate = useNavigate();

  const handleClick = (movie) => {
    setSelectedMovie(movie.imdbID);
    navigate(`/about/${movie.Title}`);
  };

  const handleSave = async (movie) => {
    try {
      const movieToSave = {
        movieId: movie.imdbID,
        movieTitle: movie.Title,
        moviePoster: movie.Poster,
      };
      const response = await axios.post(
        `${API_URL}/api/wishlist`,
        movieToSave,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        triggerNotification("Movie added to wishlist", "success");
      }
    } catch (error) {
      triggerNotification("Failed to save movie", "error");
      console.log(error);
    }
  };

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
        getWishlist(); // Refresh Wishlist
      }
    } catch (error) {
      triggerNotification("Unable to remove movie", "error");
      console.log(error);
    }
  };

  return (
    <li
      key={movie.imdbID}
      className="list-none flex flex-col text-center justify-start movie relative cursor-pointer overflow-hidden shadow-[0px_1px_11px_5px_rgba(0,0,0,0.4)] after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-[rgba(0,0,0,0.7)] after:z-10 after:pointer-events-none"
    >
      <img
        src={movie.Poster}
        alt={`${movie.Title} Poster`}
        className="w-[100%] h-auto transition-transform duration-300 ease hover:scale-110 hover:z-10"
        onClick={() => handleClick(movie)}
      />
      <h3 className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 z-20 text-white p-1.5 px-4 rounded-md text-lg shadow-[1px_1px_5px_rgba(0,0,0,0.8)] w-64">
        {movie.Title}
        {showRemoveButton ? (
          <button
            className="mt-2 border-none cursor-pointer bg-[#ff5722] text-white p-1.5 px-4 rounded-md transition-colors duration-300 ease relative z-20 hover:bg-[#e64a19]"
            onClick={() => handleRemove(movie)}
          >
            Remove
          </button>
        ) : (
          <button
            className="mt-2 border-none cursor-pointer bg-[#ff5722] text-white p-1.5 px-4 rounded-md transition-colors duration-300 ease relative z-20 hover:bg-[#e64a19]"
            onClick={() => handleSave(movie)}
          >
            Save
          </button>
        )}
      </h3>
    </li>
  );
};

export default MovieCard;
