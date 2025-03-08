import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { PY_API_URL } from "@/config";
import LoadingPage from "@/components/LoadingSpinner";
import SaveMovie from "../components/SaveMovie";
import { useNavigate } from "react-router-dom";
const Recommendations = ({ setSelectedMovie }) => {
  const { userId } = useUser();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) return;

    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`${PY_API_URL}/recommend/${userId}`);
        setRecommendations(response.data.Recommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  const handleClick = (movie) => {
    setSelectedMovie(movie.imdbID);
    console.log(movie);
    navigate(`/about/${movie.title}/${movie.imdbID}`);
    console.log(`Clicked on movie with ID: ${movie.imdbID}`);
  };
  if (!userId) {
    return <p className="text-center text-xl">No user found</p>;
  }

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="text-xl font-bold text-center sm:text-2xl m-4">
      Recommendations
      <div>
        <ul className="movie-list grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5 p-5">
          {recommendations.map((item) => (
            <li
              key={item.imdbID}
              className="list-none flex flex-col text-center justify-start movie relative cursor-pointer overflow-hidden shadow-[0px_1px_11px_5px_rgba(0,0,0,0.4)] after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-[rgba(0,0,0,0.7)] after:z-10 after:pointer-events-none"
            >
              <img
                src={item.poster}
                alt={`${item.title} Poster`}
                onClick={() => handleClick(item)}
                className="w-[100%] h-auto transition-transform duration-300 ease hover:scale-110 hover:z-10"
              />
              <h3 className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 z-20 text-white p-1.5 px-4 rounded-md text-lg shadow-[1px_1px_5px_rgba(0,0,0,0.8)] w-64">
                <span className="break-words mr-4 text-xl">{item.title}</span>
                <SaveMovie
                  movie={{
                    imdbID: item.imdbID,
                    Title: item.title,
                    Poster: item.poster,
                  }}
                  userId={userId}
                />
              </h3>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Recommendations;
