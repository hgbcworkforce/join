import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowRightFromBracket, FaUserGroup, FaChartBar, FaUserGear, FaUser } from "react-icons/fa6";
import Logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Used to track active link
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  // Helper for active styling
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: <FaChartBar /> },
    { path: '/dashboard/submissions', label: 'Submissions', icon: <FaUserGroup /> },
    { path: '/dashboard/team-members', label: 'Team Members', icon: <FaUserGear /> },
  ];

  return (
    <aside
      className={`h-screen fixed top-0 left-0 bg-slate-50 border-r border-gray-200 transition-all duration-300 ease-in-out z-50 
      ${isExpanded ? 'w-[260px] p-6' : 'w-[85px] p-4'}`}
    >
      <div className='flex flex-col space-y-5 h-full'>

        {/* Branding Section */}
        <div className={`flex items-top mb-10 ${isExpanded ? 'px-2' : 'justify-center'}`}>
          <button
            onClick={toggleSidebar}
            className="focus:outline-none cursor-pointer"
          >
            <img src={Logo} alt="Logo" className='w-10 md:w-14 h-10 md:h-14 object-contain' />
          </button>

          {isExpanded && (
            <span className='ml-3 text-slate-800 text-sm md:text-lg font-bold tracking-tight whitespace-nowrap overflow-hidden'>
              Higher Ground <br />Baptist Church
            </span>
          )}
        </div>

        <div className="h-1 w-full bg-slate-100"></div>

        {/* Navigation Links */}
        <nav className='flex-1'>
          <ul className='space-y-4'>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-xl transition-all duration-200 group
                    ${isActive(item.path)
                      ? 'bg-brand-orange text-white shadow-md'
                      : 'text-slate-500 hover:bg-white hover:text-brand-orange'
                    }`}
                >
                  <div className={`text-xl ${isExpanded ? 'mr-4' : 'mx-auto'}`}>
                    {item.icon}
                  </div>
                  {isExpanded && (
                    <span className="font-medium whitespace-nowrap overflow-hidden">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Actions / Profile & Logout */}
        <div className='flex flex-col space-y-3'>
          {/* Profile */}
          <Link
            to="/dashboard/profile"
            className={`flex items-center p-3 rounded-xl transition-all duration-200 group
              ${isActive('/dashboard/profile')
                ? 'bg-brand-orange text-white shadow-md'
                : 'text-slate-500 hover:bg-white hover:text-brand-orange'
              }`}
          >
            <div className={`text-xl ${isExpanded ? 'mr-4' : 'mx-auto'}`}>
              <FaUser />
            </div>
            {isExpanded && (
              <span className="font-medium whitespace-nowrap overflow-hidden">
                My Profile
              </span>
            )}
          </Link>


          {/* Logout */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center p-3 rounded-xl cursor-pointer text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group
              ${!isExpanded && 'justify-center'}`}
            >
              <div className={`text-xl ${isExpanded ? 'mr-4' : ''}`}>
                <FaArrowRightFromBracket />
              </div>
              {isExpanded && (
                <span className="font-medium whitespace-nowrap overflow-hidden">
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;