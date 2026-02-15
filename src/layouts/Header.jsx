import React from 'react';
import { FaBell, FaUser, FaBars, FaMagnifyingGlass } from 'react-icons/fa6';

const Header = ({ isExpanded, setIsExpanded }) => {
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Side: Toggle & Breadcrumb/Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-slate-600 focus:outline-none"
          >
            <FaBars className={`text-lg transition-transform ${isExpanded ? 'rotate-90' : 'rotate-0'}`} />
          </button>
          
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Welcome back, <span className="text-indigo-600">Username</span>
            </h1>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Subtle Search Icon (Modern Dashboard Staple) */}
          <button className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
            <FaMagnifyingGlass className="text-lg" />
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
            <FaBell className="text-lg" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </button>

          {/* User Profile Dropdown Placeholder */}
          <div className="flex items-center gap-3 pl-2 ml-2 border-l border-gray-200">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-slate-700 leading-tight">Admin User</p>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Super Admin</p>
            </div>
            <button className="h-10 w-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-sm hover:shadow-md transition-shadow">
              <FaUser className="text-lg" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;