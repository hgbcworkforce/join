import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaArrowRightFromBracket,
  FaUserGroup,
  FaChartBar,
  FaUserGear,
  FaUser,
  FaXmark,
  FaChurch
} from "react-icons/fa6";
import Logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const closeMobile = () => {
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const handleLogout = () => {
    closeMobile();
    logout();
    navigate("/signin");
  };

  const handleNavClick = () => {
    closeMobile();
  };

  // Helper for active styling
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: <FaChartBar /> },
    { path: '/dashboard/submissions', label: 'Submissions', icon: <FaUserGroup /> },
    { path: '/dashboard/team-members', label: 'Team Members', icon: <FaUserGear /> },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar (Drawer on mobile, collapsible on desktop) */}
      <aside
        className={`h-screen fixed top-0 left-0 bg-slate-50 border-r border-gray-200 transition-transform md:transition-all duration-300 ease-in-out z-50 flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        ${isExpanded ? 'w-[260px] p-5 sm:p-6' : 'w-[260px] md:w-[85px] p-5 sm:p-6 md:p-4'}`}
      >
        <div className='flex flex-col space-y-5 h-full flex-1'>

          {/* Branding Section & Mobile Close Button */}
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center ${isExpanded ? 'px-1' : 'md:justify-center'}`}>
              <button
                onClick={toggleSidebar}
                className="focus:outline-none cursor-pointer hidden md:block"
                title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                <img src={Logo} alt="Logo" className='w-10 md:w-12 h-10 md:h-12 object-contain' />
              </button>

              <Link to="/dashboard" onClick={closeMobile} className="md:hidden flex items-center">
                <img src={Logo} alt="Logo" className='w-10 h-10 object-contain' />
              </Link>

              <div className={`${isExpanded ? 'block' : 'block md:hidden'} ml-3`}>
                <span className='text-slate-800 text-sm font-bold tracking-tight block leading-tight'>
                  Higher Ground<br />
                  Baptist Church
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={closeMobile}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl md:hidden cursor-pointer transition-colors"
              aria-label="Close Sidebar"
            >
              <FaXmark className="text-lg" />
            </button>
          </div>

          <div className="h-[1px] w-full bg-slate-200/70"></div>

          {/* Navigation Links */}
          <nav className='flex-1 overflow-y-auto py-2'>
            <ul className='space-y-2.5 sm:space-y-3'>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={handleNavClick}
                    className={`flex items-center p-3 rounded-xl transition-all duration-200 group min-h-[44px]
                      ${isActive(item.path)
                        ? 'bg-brand-orange text-white shadow-md shadow-orange-500/20 font-bold'
                        : 'text-slate-600 hover:bg-white hover:text-brand-orange font-medium'
                      }`}
                  >
                    <div className={`text-lg sm:text-xl shrink-0 ${isExpanded ? 'mr-3.5' : 'mr-3.5 md:mx-auto'}`}>
                      {item.icon}
                    </div>
                    <span className={`text-sm whitespace-nowrap overflow-hidden transition-all ${isExpanded ? 'block' : 'block md:hidden'}`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Actions / Profile & Logout */}
          <div className='flex flex-col space-y-2.5 pt-2 border-t border-slate-200/70'>
            {/* Profile Link */}
            <Link
              to="/dashboard/profile"
              onClick={handleNavClick}
              className={`flex items-center p-3 rounded-xl transition-all duration-200 group min-h-[44px]
                ${isActive('/dashboard/profile')
                  ? 'bg-brand-orange text-white shadow-md shadow-orange-500/20 font-bold'
                  : 'text-slate-600 hover:bg-white hover:text-brand-orange font-medium'
                }`}
            >
              <div className={`text-lg sm:text-xl shrink-0 ${isExpanded ? 'mr-3.5' : 'mr-3.5 md:mx-auto'}`}>
                <FaUser />
              </div>
              <span className={`text-sm whitespace-nowrap overflow-hidden ${isExpanded ? 'block' : 'block md:hidden'}`}>
                My Profile
              </span>
            </Link>

            {/* Logout Button */}
            <div>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center p-3 rounded-xl cursor-pointer text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group min-h-[44px]
                ${!isExpanded ? 'justify-start md:justify-center' : 'justify-start'}`}
              >
                <div className={`text-lg sm:text-xl shrink-0 ${isExpanded ? 'mr-3.5' : 'mr-3.5 md:mr-0'}`}>
                  <FaArrowRightFromBracket />
                </div>
                <span className={`text-sm font-medium whitespace-nowrap overflow-hidden ${isExpanded ? 'block' : 'block md:hidden'}`}>
                  Sign Out
                </span>
              </button>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;