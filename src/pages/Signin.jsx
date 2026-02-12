import React from 'react'
import { Link } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'

const Signin = () => {
  return (
    <div className='w-full min-h-screen bg-gray-100 flex flex-col px-4'>
      <form 
        method="POST" 
        className='max-w-md w-full mx-auto mt-12 md:mt-20 p-6 bg-white rounded-md shadow-md flex flex-col justify-center space-y-6'
      >
        <div className='flex items-center justify-center text-orange-400 w-24 h-24 p-3 rounded-full bg-gray-100 mx-auto'>
          <FaUser className='w-12 h-12' />
        </div>

        <h2 className='text-xl md:text-3xl text-black font-semibold text-center'>
          Log into Your Account
        </h2>

        <div className='mt-4'>
          <div className='flex flex-col space-y-1 mb-4'>
            <label htmlFor="email" className='text-gray-600 font-semibold'>
              Email
            </label>
            <input 
              type="email" 
              name="email" 
              id="email"
              className='w-full h-10 rounded-md border border-gray-300 px-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400'
            />
          </div>

          <div className='flex flex-col space-y-1 mb-4'>
            <label htmlFor="password" className='text-gray-600 font-semibold'>
              Password
            </label>
            <input 
              type="password" 
              name="password" 
              id="password"
              className='w-full h-10 rounded-md border border-gray-300 px-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400'
            />
          </div>

          <button 
            type="submit" 
            className='w-full h-10 bg-orange-500 text-white rounded-md hover:bg-orange-600 cursor-pointer transition duration-300'
          >
            Sign In
          </button>
        </div>

        <div className='flex items-center justify-center space-x-2'>
          <p className='text-sm text-gray-600'>
            Don't have an account?
          </p>
          <Link to="/signup" className='text-sm text-orange-500 cursor-pointer'>
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Signin
