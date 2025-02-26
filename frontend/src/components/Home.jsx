import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/Home.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import Loader from "./Loader";
import { triggerNotification } from "../utils/NotificationUtil";
const Home = ({ setSelectedMovie, userId, setUserId }) => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movieSearch, setSearchMovie] = useState("");
  const navigate = useNavigate();

  const getUserIdFromToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/get-user-id`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log(response.data.userId);
        setUserId(response.data.userId);
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
        setMovies(movieData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setError("Unable to fetch movies from server");
      });
  }, []);

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
  const handleClick = (movie) => {
    setSelectedMovie(movie.imdbID);
    console.log(movie);
    navigate(`/about/${movie.Title}`);
    console.log(`Clicked on movie with ID: ${movie.imdbID}`);
  };
  const filteredMovies =
    movieSearch.trim() === ""
      ? movies
      : movies.filter((movie) => {
          const searchWords = movieSearch.toLowerCase().split(" ");
          return searchWords.every((word) =>
            movie.Title.toLowerCase().includes(word)
          );
        });

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {error && <div className="error-message">{error}</div>}
          <div className="flex justify-center items-center bg-gray-800 p-4 m-4 rounded-lg shadow-lg">
            <input
              type="text"
              value={movieSearch}
              onChange={(e) => setSearchMovie(e.target.value)}
              className="border-b-2 border-gray-500 h-12 focus:outline-none focus:border-blue-500 text-gray-200 placeholder-gray-400 bg-gray-700 text-lg px-4 rounded-lg w-full sm:w-[380px] mr-4"
              placeholder="Enter movie to search"
            />
            <button className="bg-blue-600 text-white rounded-lg px-6 py-3 text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300 hover:bg-blue-700 focus:outline-none">
              Search
            </button>
          </div>

          <ul className="movieList">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie, index) => (
                <li key={movie.imdbID + index} className="movie">
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
              ))
            ) : (
              <div className="no-movies-message">No such movie found</div>
            )}
          </ul>
        </>
      )}
    </>
  );
};

export default Home;
