import React from 'react'
import { FaBell, FaUser, FaBars } from 'react-icons/fa6'


const Header = ({ isExpanded, setIsExpanded }) => {

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className='w-full bg-white shadow-lg flex items-center px-6 py-4 justify-between z-10'>
      <div className='items-center mr-4'>
         {isExpanded ?
        <FaBars onClick={toggleSidebar} className='text-gray-900 text-sm cursor-pointer' />
        : <FaBars onClick={toggleSidebar} className='text-gray-900 text-sm cursor-pointer' />}
      </div>
     
      <div className='flex flex-row justify-between items-center mx-auto w-full'>
        <h1 className='text-gray-800 text-xl md:text-2xl font-bold'>Welcome, Username</h1>
        <div className='hidden md:flex flex-row space-x-4 justify-end items-center'>
          {/* <div>
            <FaBell className='text-gray-700 text-2xl' />
          </div>

          <div className='bg-gray-100 flex justify-center p-3 h-12 w-12 rounded-full'>
            <FaUser className='text-gray-700 text-2xl' />
          </div> */}

        </div>
      </div>
    </div>
  )
}

export default Header