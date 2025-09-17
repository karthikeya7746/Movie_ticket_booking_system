import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
        {/* About Section */}
        <div className="md:max-w-96">
         
          <p className="mt-6 text-sm leading-relaxed">
            Welcome to <span className="font-semibold">Kar’s Movies</span> — your destination for Telugu, Bollywood, and Hollywood blockbusters. 
            Discover the latest releases, watch trailers, book tickets, and enjoy an immersive movie experience with us.
          </p>
        </div>

        {/* Quick Links + Contact */}
        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5">Quick Links</h2>
            <ul className="text-sm space-y-2">
              <li><a href="/">Home</a></li>
              <li><a href="/movies">Movies</a></li>
              <li><a href="/theaters">Theaters</a></li>
              <li><a href="/releases">Upcoming Releases</a></li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-5">Contact</h2>
            <div className="text-sm space-y-2">
              <p>📞 +1 (919)-521-3775</p>
              <p>📧 karthikeya.7746@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="pt-4 text-center text-sm pb-5">
        Copyright {new Date().getFullYear()} © Kar’s Movies. All Rights Reserved.
      </p>
    </footer>
  )
}

export default Footer
