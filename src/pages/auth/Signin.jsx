import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { useState } from 'react';
import API from '../../api/axios';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await API.post('/auth/signin', { email, password });
      const token = response.data?.data?.accessToken || response.data?.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        navigate('/dashboard'); 
      } else {
        setErrorMessage("Authentication token was not returned by server.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full min-h-screen bg-slate-50 flex flex-col justify-center px-4 py-12'>
      <form 
        method="POST" 
        onSubmit={handleLogin}
        className='max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center space-y-6'
      >
        <div className='flex items-center justify-center text-orange-500 w-20 h-20 p-3 rounded-2xl bg-orange-50 border border-orange-100 mx-auto'>
          <FaUser className='w-8 h-8' />
        </div>

        <div className="text-center">
          <h2 className='text-2xl font-bold text-slate-900'>
            Team Portal Sign In
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            HGBC Influencers — First Timer Management
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
            {errorMessage}
          </div>
        )}

        <div className='space-y-4'>
          <div className='flex flex-col space-y-1.5'>
            <label htmlFor="email" className='text-xs font-bold uppercase tracking-wider text-slate-500'>
              Email Address
            </label>
            <input 
              type="email" 
              name="email" 
              id="email"
              required
              placeholder="team@hgbcinfluencers.org"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className='w-full h-11 rounded-xl border border-slate-200 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
            />
          </div>

          <div className='flex flex-col space-y-1.5'>
            <label htmlFor="password" className='text-xs font-bold uppercase tracking-wider text-slate-500'>
              Password
            </label>
            <input 
              type="password" 
              name="password" 
              id="password"
              required
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className='w-full h-11 rounded-xl border border-slate-200 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className='w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl cursor-pointer transition duration-200 disabled:opacity-50 shadow-md shadow-orange-600/20'
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <div className='flex items-center justify-center space-x-1 text-xs text-slate-500'>
          <span>Don't have an account?</span>
          <Link to="/signup" className='font-bold text-orange-600 hover:text-orange-700'>
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signin;
