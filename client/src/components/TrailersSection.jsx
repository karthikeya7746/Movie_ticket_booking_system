import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player'
import BlurCircle from './BlurCircle'
import { PlayCircleIcon } from 'lucide-react'

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
      {/* Trailers Heading */}
     <h2 className="text-base md:text-5xl font-black mb-8 text-white tracking-wide">
  Trailers
</h2>


      <div className='relative mt-6'>
        <BlurCircle top='-100px' right='-100px'/>
        <ReactPlayer 
          url={currentTrailer.videoUrl} 
          controls={true} 
          className="mx-auto max-w-full rounded-lg shadow-lg" 
          width="960px" 
          height="540px"
        />
      </div>

      <div className='group grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10 max-w-5xl mx-auto'>
        {dummyTrailers.map((trailer) => (
          <div 
            key={trailer.image} 
            className='relative hover:scale-105 hover:shadow-xl duration-300 transition cursor-pointer'
            onClick={() => setCurrentTrailer(trailer)}
          >
            <img 
              src={trailer.image} 
              alt={trailer.title} 
              className='rounded-lg w-full h-40 object-cover brightness-75'
            />
            <PlayCircleIcon 
              strokeWidth={1.6} 
              className="absolute top-1/2 left-1/2 w-10 h-10 transform -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-lg"
            />
            <p className='mt-2 text-center text-sm font-semibold text-gray-200'>
              {trailer.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrailersSection
