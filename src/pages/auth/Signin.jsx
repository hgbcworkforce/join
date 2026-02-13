import { Link, useNavigate } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import { useState } from 'react';
import axios from 'axios';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    console.log("Hitting URL:", `${API_URL}/auth/signin`);
    const response = await axios.post(`${API_URL}/auth/signin`, { email, password });
    
    // The change is here: response.data is the whole JSON, 
    // so we need response.data.data.accessToken
    const token = response.data.data?.accessToken;

    if (token) {
      localStorage.setItem("token", token);
      navigate('/dashboard'); 
    } else {
      console.error("Token missing in response structure:", response.data);
    }
  } catch (error) {
    alert(error.response?.data?.message || "Login failed.");
  }
};

  return (
    <div className='w-full min-h-screen bg-gray-100 flex flex-col px-4'>
      <form 
        method="POST" 
        onSubmit={handleLogin}
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
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
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
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
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
