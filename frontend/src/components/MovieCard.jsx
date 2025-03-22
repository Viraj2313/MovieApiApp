import { useInView } from "react-intersection-observer";
import SaveMovie from "./SaveMovie";
const MovieCard = ({ movie, onClick }) => {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <li
      ref={ref}
      className={`relative cursor-pointer overflow-hidden shadow-lg dark:shadow-md rounded-lg transition-all transform hover:scale-105 ${
        inView ? "visible animate-fadeIn" : "invisible opacity-0"
      }`}
      onClick={() => onClick(movie)}
    >
      <img
        src={movie.Poster}
        alt={movie.Title}
        className="w-full h-auto rounded-lg object-cover transition-transform duration-300 ease-in-out hover:scale-110"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-3 text-white text-center">
        <h3 className="text-lg font-semibold">{movie.Title}</h3>
        <SaveMovie movie={movie} />
      </div>
    </li>
  );
};

export default MovieCard;
