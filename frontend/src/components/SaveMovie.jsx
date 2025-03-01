import React from "react";
import { triggerNotification } from "../utils/NotificationUtil";
import axios from "axios";
import { API_URL } from "../config";
const SaveMovie = ({ movie, userId }) => {
  const handleSave = async (movie) => {
    try {
      if (!userId) {
        triggerNotification("You need to login first", "error");
        return;
      }

      const moviesToSave = {
        userId: userId,
        movieTitle: movie.Title,
        movieId: movie.imdbID,
        moviePoster: movie.Poster,
      };
      console.log(moviesToSave);
      const response = await axios.post(
        `${API_URL}/api/add_wishlist`,
        moviesToSave,
        { withCredentials: true }
      );
      if (response.status == 200) {
        triggerNotification("Movie added to wishlist", "success");
      }
    } catch (error) {
      triggerNotification(response.data.error);
      console.log(error);
    }
  };

  return (
    <>
      <button
        className="mt-2 border-none cursor-pointer bg-[#ff5722] text-white p-1.5 px-4 rounded-md transition-colors duration-300 ease relative z-20 hover:bg-[#e64a19]"
        onClick={() => handleSave(movie)}
      >
        Save
      </button>
    </>
  );
};
export default SaveMovie;
