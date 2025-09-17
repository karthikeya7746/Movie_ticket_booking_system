import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, image_base_url } = useAppContext();
  const [movie, setMovie] = useState(null);
  const [dateTime, setDateTime] = useState({});

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { data } = await axios.get(`/api/show/${id}`);
        if (data.success) {
          setMovie(data.movie);
          setDateTime(data.dateTime);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovie();
  }, [id, axios]);

  if (!movie) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-white text-2xl">Loading...</h1>
      </div>
    );
  }

  const posterUrl = getImageUrl(movie.poster_path, image_base_url);
  const backdropUrl = getImageUrl(movie.backdrop_path, image_base_url);

  return (
    <div className="text-white">
      {/* Backdrop */}
      <div className="relative w-full h-[400px] overflow-hidden">
        <img
          src={backdropUrl}
          alt={`${movie.title} backdrop`}
          className="w-full h-full object-cover opacity-50"
          onError={(e) => (e.target.src = "/coming-soon-bg.jpg")}
        />
        <div className="absolute inset-0 flex items-center px-10">
          <img
            src={posterUrl}
            alt={movie.title}
            className="h-80 rounded-lg shadow-lg"
            onError={(e) => (e.target.src = "/coming-soon.jpg")}
          />
          <div className="ml-10">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="mt-2">{movie.tagline}</p>
            <p className="mt-2 text-gray-300">{movie.overview}</p>
            <p className="mt-4">
              {movie.release_date?.split("-")[0]} • {movie.runtime}m
            </p>
          </div>
        </div>
      </div>

      {/* Showtimes */}
      <div className="px-10 my-10">
        <h2 className="text-2xl font-semibold mb-4">Available Shows</h2>
        {Object.keys(dateTime).length === 0 ? (
          <p className="text-gray-400">No shows available.</p>
        ) : (
          Object.entries(dateTime).map(([date, shows]) => (
            <div key={date} className="mb-6">
              <h3 className="text-lg font-medium mb-2">{date}</h3>
              <div className="flex flex-wrap gap-4">
                {shows.map((show, idx) => (
                  <button
                    key={idx}
                    // ✅ navigate with both id and date
                    onClick={() => navigate(`/show/${id}/${date}`)}
                    className="px-4 py-2 bg-primary hover:bg-primary-dull rounded-full text-sm font-medium"
                  >
                    {formatTime(show.time)} 
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cast Section */}
      <div className="px-10 my-10">
        <h2 className="text-2xl font-semibold mb-4">Your Favorite Cast</h2>
        <div className="flex gap-6 flex-wrap">
          {movie.casts?.map((cast, idx) => (
            <div key={idx} className="w-32 text-center">
              <img
                src={getImageUrl(cast.profile_path, image_base_url)}
                alt={cast.name}
                className="w-32 h-40 object-cover rounded-md mb-2"
                onError={(e) => (e.target.src = "/coming-soon.jpg")}
              />
              <p className="text-sm font-medium">{cast.name}</p>
              <p className="text-xs text-gray-400">{cast.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helpers
const getImageUrl = (path, image_base_url) => {
  if (!path) return "/coming-soon.jpg";

  if (path.startsWith("/")) {
    return `${image_base_url}${path}`;
  }

  if (path.endsWith(".png") || path.endsWith(".jpg")) {
    return `/${path}`;
  }

  return "/coming-soon.jpg";
};

const formatTime = (timeString) => {
  if (!timeString) return "";
  const [hour, minute] = timeString.split(":");
  let h = parseInt(hour);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${minute} ${ampm}`;
};

export default MovieDetails;
