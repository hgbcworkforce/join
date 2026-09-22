import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaUser,
  FaBars,
  FaMagnifyingGlass,
  FaArrowRightFromBracket,
  FaRotate,
  FaShieldHalved,
  FaEnvelope,
  FaCalendarDays,
  FaChevronDown
} from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const Header = ({ isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen }) => {
  const { user, loading, logout, refreshUser } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshUser();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/signin');
  };

  // Formatter helpers
  const fullName = user?.fullName || user?.full_name || user?.name || 'Team Member';
  const firstName = fullName.split(' ')[0] || 'User';
  const email = user?.email || 'No email associated';

  const formatRole = (role) => {
    if (!role) return 'Team Member';
    const clean = role.toLowerCase().replace(/_/g, ' ');
    if (clean === 'super admin') return 'Super Admin';
    if (clean === 'admin') return 'Administrator';
    if (clean === 'team member') return 'Team Member';
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  const formattedRole = formatRole(user?.role);

  // Initials generator
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(fullName);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    : null;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 px-3 sm:px-6 py-2.5 sm:py-3">
      <div className="flex items-center justify-between gap-2 sm:gap-4">

        {/* Left Side: Mobile Hamburger Button & Title */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setIsMobileOpen && setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl md:hidden transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            <FaBars className="text-lg" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 tracking-tight truncate max-w-[180px] sm:max-w-none">
              Welcome{firstName ? `, ${firstName}` : ''}!
            </h1>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-1 sm:gap-3">

          {/* Search Icon */}
          <button
            aria-label="Search"
            className="p-2 sm:p-2.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all"
          >
            <FaMagnifyingGlass className="text-base sm:text-lg" />
          </button>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative p-2 sm:p-2.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all"
          >
            <FaBell className="text-base sm:text-lg" />
            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2.5 w-2 h-2 bg-orange-500 border-2 border-white rounded-full"></span>
          </button>

          {/* Real User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 sm:gap-3 pl-1.5 sm:pl-2 ml-1 sm:ml-2 border-l border-gray-200 group focus:outline-none cursor-pointer"
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
            >
              <div className="hidden md:block text-right">
                {loading && !user ? (
                  <div className="space-y-1">
                    <div className="h-3.5 w-24 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-2.5 w-16 bg-slate-100 rounded animate-pulse ml-auto"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors leading-tight truncate max-w-[150px]">
                      {fullName}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                      {formattedRole}
                    </p>
                  </>
                )}
              </div>

              {/* Avatar Circle with initials */}
              <div className="relative">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-sm group-hover:shadow-md group-hover:ring-2 group-hover:ring-orange-500/30 transition-all">
                  {initials}
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>

              <FaChevronDown
                className={`text-[10px] text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] max-w-xs sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">

                {/* Header Profile Summary */}
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm">
                      {initials}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-slate-900 leading-tight truncate">
                        {fullName}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
                        <FaEnvelope className="text-[10px] shrink-0 text-slate-400" />
                        <span className="truncate">{email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200">
                      <FaShieldHalved className="text-[9px]" />
                      {formattedRole}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Active Session
                    </span>
                  </div>
                </div>

                {/* Info & Metadata */}
                {formattedDate && (
                  <div className="px-4 py-2 border-b border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
                    <FaCalendarDays className="text-slate-400 text-xs" />
                    <span>Member since {formattedDate}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/dashboard/profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors cursor-pointer text-left min-h-[40px]"
                  >
                    <FaUser className="text-xs text-slate-400" />
                    <span>My Profile & Settings</span>
                  </button>

                  <button
                    onClick={handleManualRefresh}
                    disabled={isRefreshing}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer min-h-[40px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <FaRotate className={`text-slate-400 text-xs ${isRefreshing ? 'animate-spin text-orange-600' : ''}`} />
                      {isRefreshing ? 'Refreshing data...' : 'Refresh Profile'}
                    </span>
                    {isRefreshing && <span className="text-[10px] text-orange-600 font-medium">Updating...</span>}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer min-h-[40px]"
                  >
                    <FaArrowRightFromBracket className="text-xs" />
                    <span>Sign Out</span>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
