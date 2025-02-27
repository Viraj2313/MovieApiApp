import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import Loader from "./Loader"; // Assuming you have a Loader component
import "../assets/styles/AboutMovie.css";

const AboutMovie = ({ selectedMovie }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (selectedMovie) {
      fetchMovieDetails();
    }
  }, [selectedMovie]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/movie_details?imdbID=${selectedMovie}`
      );
      setMovieDetails(response.data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToTrailer = async (movieTitle) => {
    const text = `Just give a url for the youtube trailer of this movie ${movieTitle}`;
    try {
      const response = await axios.post(`${API_URL}/api/gemini/ask`, {
        prompt: text,
      });
      console.log(response.data);
      const youtubeUrl = response.data;
      if (youtubeUrl) {
        window.open(youtubeUrl, "_blank");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const goToImdb = async (movieTitle) => {
    const text = `Just give a url for imdb page of this movie${movieTitle} dont give any other text with it `;
    try {
      const response = await axios.post(`${API_URL}/api/gemini/ask`, {
        prompt: text,
      });
      console.log(response.data);
      const youtubeUrl = response.data;
      if (youtubeUrl) {
        window.open(youtubeUrl, "_blank");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-screen-lg mx-auto p-4">
      {loading ? (
        <div className="flex justify-center items-center h-vw">
          {" "}
          {/* Centering container */}
          <Loader />
        </div>
      ) : movieDetails ? (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            About Movie
          </h1>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 ">
              {movieDetails.Title}
            </h2>
            <div className="flex justify-center mb-4">
              <img
                className="rounded-lg shadow-md max-w-xs"
                src={movieDetails.Poster}
                alt={movieDetails.Title}
              />
            </div>
            <div className="flex justify-center mb-2 gap-3">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition cursor-pointer"
                onClick={() => goToTrailer(movieDetails.Title)}
              >
                See trailer on youtube
              </button>
              <button
                type="submit"
                className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition cursor-pointer"
                onClick={() => goToImdb(movieDetails.Title)}
              >
                See Details on Imdb
              </button>
            </div>
            <p className="text-lg text-gray-700">{movieDetails.Plot}</p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600">
          No movie selected or no details available.
        </div>
      )}
    </div>
  );
};

export default AboutMovie;
