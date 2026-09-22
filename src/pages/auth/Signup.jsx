import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      return setErrorMessage("Passwords do not match!");
    }

    if (formData.password.length < 6) {
      return setErrorMessage("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      const response = await API.post('/auth/signup', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      const token = response.data?.data?.accessToken || response.data?.data?.token;
      const user = response.data?.data?.user;
      if (token) {
        login(token, user);
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setSuccessMessage("Account created! Please sign in.");
        setTimeout(() => {
          navigate('/signin');
        }, 1500);
      }
    } catch (err) {
      console.error("Signup error", err);
      setErrorMessage(err.response?.data?.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full min-h-screen bg-slate-50 flex flex-col justify-center px-3 sm:px-4 py-8 sm:py-12'>
      <form 
        onSubmit={handleSubmit}
        className='max-w-md w-full mx-auto p-5 sm:p-8 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-center space-y-5 sm:space-y-6'
      >
        <div className='flex items-center justify-center text-orange-500 w-16 h-16 sm:w-20 sm:h-20 p-3 rounded-2xl bg-orange-50 border border-orange-100 mx-auto shadow-inner'>
          <FaUser className='w-7 h-7 sm:w-8 sm:h-8' />
        </div>

        <div className="text-center">
          <h2 className='text-xl sm:text-2xl font-bold text-slate-900'>
            Create Team Account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Join the HGBC Follow-Up & Guest Care Team
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl">
            {successMessage}
          </div>
        )}

        <div className='space-y-3.5 sm:space-y-4'>
          <div className='flex flex-col space-y-1.5'>
            <label htmlFor="fullName" className='text-xs font-bold uppercase tracking-wider text-slate-500'>
              Full Name
            </label>
            <input 
              type="text" 
              name="fullName" 
              id="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
              placeholder="Pastor / Brother / Sister..."
              className='w-full h-11 rounded-xl border border-slate-200 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
            />
          </div>

          <div className='flex flex-col space-y-1.5'>
            <label htmlFor="email" className='text-xs font-bold uppercase tracking-wider text-slate-500'>
              Email Address
            </label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="name@hgbcinfluencers.org"
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
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="••••••••"
              className='w-full h-11 rounded-xl border border-slate-200 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
            />
          </div>

          <div className='flex flex-col space-y-1.5'>
            <label htmlFor="confirmPassword" className='text-xs font-bold uppercase tracking-wider text-slate-500'>
              Confirm Password
            </label>
            <input 
              type="password" 
              name="confirmPassword" 
              id="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange}  
              required 
              placeholder="••••••••"
              className='w-full h-11 rounded-xl border border-slate-200 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className='w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl cursor-pointer transition duration-200 disabled:opacity-50 shadow-md shadow-orange-600/20'
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>

        <div className='flex items-center justify-center space-x-1 text-xs text-slate-500'>
          <span>Already have an account?</span>
          <Link to="/signin" className='font-bold text-orange-600 hover:text-orange-700'>
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
