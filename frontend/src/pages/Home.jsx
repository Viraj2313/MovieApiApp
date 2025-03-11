import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/Home.css";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import SaveMovie from "../components/SaveMovie";
import { useUser } from "../context/UserContext";
import LoadingPage from "../components/LoadingPage";
const Home = ({ setSelectedMovie }) => {
  const { userId, setUserId } = useUser();
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movieSearch, setSearchMovie] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();

  const getUserIdFromToken = async () => {
    try {
      const response = await axios.get("/api/get-user-id", {
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
      .get("/api/home")
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
  useEffect(() => {
    if (movieSearch.trim() === "") {
      setSearchResults(movies);
      return;
    }
    setSearchLoading(true);
    const searchWords = movieSearch.toLowerCase().split(" ");
    const filteredLocalMovies = movies.filter((movie) =>
      searchWords.every((word) => movie.Title.toLowerCase().includes(word))
    );

    if (filteredLocalMovies.length > 0) {
      setSearchResults(filteredLocalMovies);
      setSearchLoading(false);
    } else {
      const respone = axios
        .get(`/api/home/search-movie/${movieSearch}`)
        .then((response) => {
          setSearchResults(response.data.Search || []);
          setSearchLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setsearchLoading(false);
        });
    }
  }, [movieSearch, movies]);

  const handleClick = (movie) => {
    setSelectedMovie(movie.imdbID);
    console.log(movie);
    navigate(`/about/${movie.Title}/${movie.imdbID}`);
    console.log(`Clicked on movie with ID: ${movie.imdbID}`);
  };

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
            <button
              className="bg-blue-600 text-white rounded-lg px-6 py-3 text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300 hover:bg-blue-700 focus:outline-none"
              onClick={() => setSearchMovie(movieSearch)}
            >
              Search
            </button>
          </div>

          {searchLoading ? (
            <div className="flex items-center justify-center w-full h-40">
              <LoadingPage />
            </div>
          ) : (
            <ul className="movie-list grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5 p-5">
              {searchResults.length > 0 ? (
                searchResults.map((movie, index) => (
                  <li
                    key={movie.imdbID + index}
                    className="list-none flex flex-col text-center justify-start movie relative cursor-pointer overflow-hidden shadow-[0px_1px_11px_5px_rgba(0,0,0,0.4)] after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-[rgba(0,0,0,0.7)] after:z-10 after:pointer-events-none"
                  >
                    <img
                      src={movie.Poster}
                      alt=""
                      className="w-[100%] h-auto transition-transform duration-300 ease hover:scale-110 hover:z-10"
                      onClick={() => handleClick(movie)}
                    />
                    <h3 className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 z-20 text-white p-1.5 px-4 rounded-md text-lg shadow-[1px_1px_5px_rgba(0,0,0,0.8)] w-64">
                      {movie.Title}
                      <SaveMovie movie={movie} userId={userId} />
                    </h3>
                  </li>
                ))
              ) : (
                <div className="no-movies-message">No such movie found</div>
              )}
            </ul>
          )}
        </>
      )}
    </>
  );
};

export default Home;
