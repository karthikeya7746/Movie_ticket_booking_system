import React from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'

const Movies = () => {

  const { shows, showsFetchError, fetchShows } = useAppContext()

  if (showsFetchError) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[70vh] px-6 text-center'>
        <h1 className='text-2xl font-bold text-red-400 mb-2'>Could not load movies</h1>
        <p className='text-gray-400 text-sm max-w-md mb-4'>{showsFetchError}</p>
        <p className='text-gray-500 text-xs max-w-md mb-4'>
          On Vercel: set VITE_BASE_URL to your backend URL (e.g. https://movie-ticket-booking-system-gules.vercel.app), then redeploy the frontend. Backend must allow this site in CORS.
        </p>
        <button onClick={fetchShows} className='px-4 py-2 bg-primary rounded text-sm'>Try again</button>
      </div>
    )
  }

  return shows.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>

      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>

      <h1 className='text-lg font-medium my-4'>Now Showing</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {shows.map((movie)=> (
          <MovieCard movie={movie} key={movie._id}/>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center min-h-[70vh] px-6 text-center'>
      <h1 className='text-2xl font-bold text-center'>No movies available</h1>
      <p className='text-gray-400 text-sm mt-2 max-w-md'>
        The database has no movies yet. Run <code className='bg-black/30 px-1 rounded'>npm run update-shows</code> or <code className='bg-black/30 px-1 rounded'>npm run seed</code> in the server folder (with MONGODB_URI pointing to your Atlas movie_booking DB).
      </p>
    </div>
  )
}

export default Movies
