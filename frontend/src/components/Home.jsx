import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/Home.css";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import Loader from "./Loader";
const Home = ({ setSelectedMovie }) => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setuserId] = useState(null);

  const navigate = useNavigate();

  const getUserIdFromToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/get-user-id`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log(response.data.userId);
        setuserId(response.data.userId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getUserIdFromToken();
    axios
      .get(`${API_URL}/api/home`)
      .then((response) => {
        const movieData = response.data;
        setMovies(movieData.Search);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleSave = async (movie) => {
    try {
      console.log(userId);
      if (!userId) {
        alert("login first");
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
        alert("Movie added to Wishlist");
      }
    } catch (error) {
      console.log(error);
      alert(`unable to add to wishlist`, error);
    }
  };
  const handleClick = (movie) => {
    setSelectedMovie(movie.imdbID);
    navigate(`/about/${movie.Title}`);
    console.log(`Clicked on movie with ID: ${movie.imdbID}`);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <ul className="movieList">
          {movies.map((movie) => (
            <li key={movie.imdbID}>
              <img
                src={movie.Poster}
                alt=""
                onClick={() => handleClick(movie)}
              />
              <h3>
                {movie.Title}{" "}
                <button onClick={() => handleSave(movie)}>Save</button>
              </h3>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Home;
