import React from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
  const navigate = useNavigate()

  return (
    <div className='relative flex items-center justify-center bg-[url("/backgroundImage.png")] bg-cover bg-center h-screen'>
      
      {/* Explore Movies Button anchored near bottom */}
      <div className="absolute bottom-20 flex justify-center w-full">
        <button
          onClick={() => navigate('/movies')}
          className='flex items-center gap-2 px-8 py-4 text-lg bg-black text-white rounded-full font-semibold cursor-pointer active:scale-95
                     animate-pulse-glow shadow-[0_0_20px_5px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_10px_rgba(0,0,0,1)] transition-all'
        >
          Explore Movies
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default HeroSection
