import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { API_URL } from "../config";
import Loader from "../components/Loader";
import "../assets/styles/AboutMovie.css";
import { useOpenLink } from "../hooks/useOpenLink";
import { useNavigate, useParams } from "react-router-dom";
import SaveMovie from "../components/SaveMovie";
import ShareMovieButton from "../components/ShareMovieButton";
const AboutMovie = () => {
  const { imdbID } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [watchPlatforms, setWatchPlatforms] = useState([]);

  useEffect(() => {
    if (imdbID) {
      fetchMovieDetails();
    }
  }, [imdbID]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/movie_details?imdbID=${imdbID}`
      );
      setMovieDetails(response.data);
      await whereToWatch(response.data.Title);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToTrailer = async (movieTitle) => {
    const openLink = useOpenLink();

    const newTab = openLink(`/loading`, "_blank");

    try {
      const response = await axios.post(`${API_URL}/api/get-trailer-url`, {
        movieTitle: movieTitle,
      });
      const youtubeUrl = response.data;

      if (youtubeUrl && newTab) {
        newTab.location.href = youtubeUrl;
      }
    } catch (error) {
      console.log(error);
      newTab.close();
    }
  };

  const goToImdb = async (movieTitle) => {
    const openLink = useOpenLink();
    const newTab = openLink("/loading", "_blank");
    try {
      const response = await axios.post(`${API_URL}/api/get-imdb-url`, {
        movieTitle: movieTitle,
      });
      const imdbUrl = response.data;
      if (imdbUrl && newTab) {
        newTab.location.href = imdbUrl;
      }
    } catch (error) {
      console.log(error);
      newTab.close();
    }
  };

  const whereToWatch = async (movieTitle) => {
    try {
      const response = await axios.post(`${API_URL}/api/where-to-watch`, {
        movieTitle: movieTitle,
      });

      if (Array.isArray(response.data)) {
        setWatchPlatforms(response.data);
      } else {
        setWatchPlatforms([]); // Set empty array if the response is not an array
      }
    } catch (error) {
      console.log(error);
      setWatchPlatforms([]);
    }
  };

  const goToWiki = async (movieTitle) => {
    const openLink = useOpenLink();
    const newTab = openLink("/loading", "_blank");
    try {
      const response = await axios.post(`${API_URL}/api/get-wiki-url`, {
        movieTitle: movieTitle,
      });
      console.log(response.data);
      const wikiUrl = response.data;

      if (wikiUrl && newTab) {
        console.log(wikiUrl);
        newTab.location.href = wikiUrl;
      }
    } catch (error) {
      newTab.close();
      console.log(error);
    }
  };

  const getReviews = async (movieTitle) => {
    const openLink = useOpenLink();
    const newTab = openLink("/loading", "_blank");

    try {
      const response = await axios.post(`${API_URL}/api/get-reviews-url`, {
        movieTitle: movieTitle,
      });
      console.log(response.data);
      const reviewUrl = response.data;

      if (reviewUrl && newTab) {
        console.log(reviewUrl);
        newTab.location.href = reviewUrl;
      }
    } catch (error) {
      newTab.close();
      console.error("Failed to get Rotten Tomatoes URL:", error);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      {loading ? (
        <div className="flex justify-center items-center h-vw">
          <Loader />
        </div>
      ) : movieDetails ? (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            About Movie
          </h1>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {movieDetails.Title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-center">
                <img
                  className="rounded-lg shadow-md max-w-xs"
                  src={movieDetails.Poster}
                  alt={movieDetails.Title}
                />
              </div>
              <div className="space-y-4">
                {Array.isArray(watchPlatforms) && watchPlatforms.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center tracking-wide">
                      Where to Watch
                    </h3>
                    <ul className="flex flex-wrap justify-center gap-3">
                      {watchPlatforms.map((platform, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-200 transition"
                        >
                          {platform}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 mb-4 md:flex md:justify-center md:gap-3">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition cursor-pointer"
                onClick={() => goToTrailer(movieDetails.Title)}
              >
                See Trailer on YouTube
              </button>
              <button
                className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition cursor-pointer"
                onClick={() => goToImdb(movieDetails.Title)}
              >
                See Details on IMDb
              </button>
              <button
                className="bg-zinc-300 text-black px-4 py-2 rounded-md hover:bg-zinc-600 transition cursor-pointer"
                onClick={() => goToWiki(movieDetails.Title)}
              >
                Know more on Wikipedia
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition cursor-pointer"
                onClick={() => getReviews(movieDetails.Title)}
              >
                Read Reviews (Rotten Tomatoes)
              </button>
              <ShareMovieButton
                className="min-h-full"
                movieTitle={movieDetails.Title}
              />
              <SaveMovie />
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
