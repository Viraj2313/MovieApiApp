import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../config";
import Loader from "./Loader";
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

  return (
    <div>
      {loading ? (
        <Loader />
      ) : movieDetails ? (
        <>
          <h1>About Movie</h1>
          <div className="movie-container">
            <h2 id="movie-title">{movieDetails.Title}</h2>
            <img
              id="movie-poster"
              src={movieDetails.Poster}
              alt={movieDetails.Title}
            />
            <h3>{movieDetails.Plot}</h3>
          </div>
        </>
      ) : (
        <div>No movie selected or no details available.</div>
      )}
    </div>
  );
};

export default AboutMovie;
