import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRightFromBracket, FaUserGroup, FaChartBar } from "react-icons/fa6";
import Logo from '../assets/logo.png'

const Sidebar = ({ isExpanded, setIsExpanded }) => {


  return (
    <aside className={`h-screen fixed top-0 left-0 bg-white p-8 shadow-lg transition-width duration-300 ${isExpanded ? 'w-[280px]' : 'w-[80px]'}`}>
      <div className='w-full flex flex-col space-y-8 justify-between h-full'>
        <div className='flex flex-col justify-between items-start space-y-16'>


          <div className='flex flex-row items-center space-x-2'>
            <img src={Logo} alt="Logo" className='w-12' />
            {isExpanded && <span className='text-gray-700 text-xl font-medium'>Hgbc Influencers</span>}
          </div>
          <ul className='flex flex-col space-y-6 justify-center items-start mt-8 md:mt-16'>

            <li className='cursor-pointer'>
              <a href="#" className='flex flex-row items-center space-x-2'>
                <FaChartBar className='text-gray-700 text-xl mr-8' />
                {isExpanded && <span className='text-gray-700 text-xl font-medium'>Overview</span>}
              </a>
            </li>


            <li className='cursor-pointer'>
              <a href="#" className='flex flex-row items-center space-x-2'>
                <FaUserGroup className='text-gray-700 text-xl mr-8' />
                {isExpanded && <span className='text-gray-700 text-xl font-medium'>Submissions</span>}
              </a>
            </li>

          </ul>
        </div>

        <div className='flex items-start space-x-2 text-red-500 hover:text-red-600 cursor-pointer'>
          <Link to="/" className='flex flex-row items-center cursor-pointer'>
            <FaArrowRightFromBracket className='text-xl mr-8' />
            {isExpanded && <span className='text-xl font-medium'>Logout</span>}
          </Link>
        </div>

      </div>
    </aside>
  )
}

export default Sidebar