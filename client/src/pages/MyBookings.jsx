import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { useUser } from '@clerk/clerk-react'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const { isLoaded } = useUser()
  const { axios, getToken, user, image_base_url } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getMyBookings = async () =>{
    try {
      const {data} = await axios.get('/api/user/bookings', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
        if (data.success) {
          setBookings(data.bookings)
        }

    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (user) {
      getMyBookings()
    } else {
      setIsLoading(false)
    }
  }, [user])

  if (!isLoaded) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-14 w-14 border-2 border-t-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
        <h1 className="text-xl font-semibold text-center text-white">Sign in to view your bookings</h1>
        <p className="text-gray-400 text-sm mt-2 text-center">You need to be signed in to see your ticket bookings.</p>
      </div>
    )
  }

  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px"/>
      <div>
        <BlurCircle bottom="0px" left="600px"/>
      </div>
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-400">You have no bookings yet.</p>
      ) : (
        bookings.map((item, index) => {
          const movie = item.show?.movie
          if (!movie) return null
          const posterSrc = (image_base_url || '') + (movie.poster_path || '')
          return (
            <div key={item._id || index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'>
              <div className='flex flex-col md:flex-row'>
                <img src={posterSrc} alt="" className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded' onError={(e) => { e.target.style.display = 'none' }} />
                <div className='flex flex-col p-4'>
                  <p className='text-lg font-semibold'>{movie.title}</p>
                  <p className='text-gray-400 text-sm'>{movie.runtime != null ? timeFormat(movie.runtime) : '—'}</p>
                  <p className='text-gray-400 text-sm mt-auto'>{item.show?.showDateTime ? dateFormat(item.show.showDateTime) : '—'}</p>
                </div>
              </div>

              <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
                <div className='flex items-center gap-4'>
                  <p className='text-2xl font-semibold mb-3'>{currency}{item.amount}</p>
                  {!item.isPaid && item.paymentLink && <a href={item.paymentLink} className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'>Pay Now</a>}
                </div>
                <div className='text-sm'>
                  <p><span className='text-gray-400'>Total Tickets:</span> {item.bookedSeats?.length ?? 0}</p>
                  <p><span className='text-gray-400'>Seat Number:</span> {item.bookedSeats?.join(', ') ?? '—'}</p>
                </div>
              </div>
            </div>
          )
        })
      )}

    </div>
  ) : <Loading />
}

export default MyBookings
