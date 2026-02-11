import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='w-full h-screen bg-gray-100 flex flex-col items-center justify-center'>
      <h1 className='text-3xl md:text-5xl font-bold text-orange-500'>Welcome to First Timer</h1>
      <p className='text-lg text-gray-600 mt-4'>Your journey to becoming a developer starts here</p>
      <Link to="/signup" className='mt-6 bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition duration-300'>Get Started</Link>
    </div>
  )
}

export default Hero