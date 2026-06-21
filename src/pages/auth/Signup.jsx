import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import API from '../../api/axios'

const Signup = () => {

  const [formData, setFormData] = useState({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// A single function to update all fields
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

// const API_URL = import.meta.env.VITE_API_BASE_URL; 

const handleSubmit = async (e) => {
  e.preventDefault(); // Stops the page from reloading
  
  if (formData.password !== formData.confirmPassword) {
    return alert("Passwords do not match!");
  }

  try {
    const response = await API.post('/auth/signup', {
      // name: formData.fullName,
      email: formData.email,
      password: formData.password
      // Note: Your backend doc only mentioned email/password, 
      // check if it needs 'name' too!
    });
    console.log("Success!", response.data);
    showConfirmation();
    // Redirect to login after successful signup
  } catch (err) {
    console.error("Signup error", err.response?.data);
  }
};


// Confirmation Message

function showConfirmation() {
  const message = document.getElementById('confirmMessage');
  message.classList.remove('hidden');
  setTimeout(() => {
    message.classList.add('hidden');
  }, 3000);
}




  return (
    <div className='w-full min-h-screen bg-gray-100 flex flex-col px-4'>
        <form 
          onSubmit={handleSubmit}
          className='max-w-md w-full mx-auto mt-12 md:mt-20 p-6 bg-white rounded-md shadow-md flex flex-col justify-center space-y-6'
        >
            <div className='flex items-center justify-center text-orange-400 w-24 h-24 p-3 rounded-full bg-gray-100 mx-auto'>
                <FaUser className='w-12 h-12' />
            </div>

            <h2 className='text-xl md:text-3xl text-black font-semibold text-center'>
              Create an Account
            </h2>

            <div className='mt-4'>
                <div className='flex flex-col space-y-1 mb-4'>
                    <label htmlFor="fullName" className='text-gray-600 font-semibold'>Full Name</label>
                    <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} required 
                      className='w-full h-10 rounded-md border border-gray-300 px-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400'
                    />
                </div>

                <div className='flex flex-col space-y-1 mb-4'>
                    <label htmlFor="email" className='text-gray-600 font-semibold'>Email</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required 
                      className='w-full h-10 rounded-md border border-gray-300 px-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400'
                    />
                </div>

                <div className='flex flex-col space-y-1 mb-4'>
                    <label htmlFor="password" className='text-gray-600 font-semibold'>Password</label>
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required 
                      className='w-full h-10 rounded-md border border-gray-300 px-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400'
                    />
                </div>

                <div className='flex flex-col space-y-1 mb-4'>
                    <label htmlFor="confirmPassword" className='text-gray-600 font-semibold'>Confirm Password</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange}  required 
                      className='w-full h-10 rounded-md border border-gray-300 px-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400'
                    />
                </div>

                <button 
                  type="submit" 
                  className='w-full h-10 bg-orange-500 text-white rounded-md hover:bg-orange-600 cursor-pointer transition duration-300'
                >
                  Sign Up
                </button>
            </div>

            <div className='flex items-center justify-center space-x-2'>
                <p className='text-sm text-gray-600'>Already have an account?</p>
                <Link to="/signin" className='text-sm text-orange-500 cursor-pointer'>
                  Sign In
                </Link>
            </div>
        </form>


        {/* Confirmation message */}
        <div id='confirmMessage' className='hidden absolute top-5 justify-center items-center bg-white text-green-500 px-6 py-3 rounded-lg mx-auto shadow-md'>
            <span>Account Created Successfully!</span>
        </div>
    </div>
  )
}

export default Signup
