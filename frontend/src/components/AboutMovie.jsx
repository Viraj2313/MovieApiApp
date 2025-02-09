import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../config";

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
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <>Loading...</>;
  }
  if (!movieDetails) {
    return <div>no movie details</div>;
  }

  return (
    <div>
      <h1>About Movie</h1>
      <h2>{movieDetails.Title}</h2>
      <h3>{movieDetails.Plot}</h3>
      <img src={movieDetails.Poster} alt={movieDetails.Title} />
    </div>
  );
};

export default AboutMovie;
