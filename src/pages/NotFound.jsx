import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaHouse } from 'react-icons/fa6';
import logo from '../assets/logo.png';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200 flex flex-col items-center space-y-6">
        <img src={logo} alt="HGBC Logo" className="w-16 h-16 object-contain" />

        <div className="space-y-2">
          <span className="text-5xl sm:text-6xl font-black text-orange-600 tracking-tight">
            404
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer min-h-[44px]"
          >
            <FaHouse className="text-xs" />
            <span>Home</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-600/20 cursor-pointer min-h-[44px]"
          >
            <FaArrowLeft className="text-xs" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;