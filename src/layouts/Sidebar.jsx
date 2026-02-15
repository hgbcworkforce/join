import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowRightFromBracket, FaUserGroup, FaChartBar } from "react-icons/fa6";
import Logo from '../assets/logo.png';

const Sidebar = ({ isExpanded }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Used to track active link

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  // Helper for active styling
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: <FaChartBar /> },
    { path: '/dashboard/submissions', label: 'Submissions', icon: <FaUserGroup /> },
  ];

  return (
    <aside 
      className={`h-screen fixed top-0 left-0 bg-slate-50 border-r border-gray-200 transition-all duration-300 ease-in-out z-50 
      ${isExpanded ? 'w-[260px] p-6' : 'w-[85px] p-4'}`}
    >
      <div className='flex flex-col h-full'>
        
        {/* Branding Section */}
        <div className={`flex items-center mb-10 ${isExpanded ? 'px-2' : 'justify-center'}`}>
          <img src={Logo} alt="Logo" className='w-10 h-10 object-contain' />
          {isExpanded && (
            <span className='ml-3 text-slate-800 text-lg font-bold tracking-tight whitespace-nowrap overflow-hidden'>
              Hgbc Influencers
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className='flex-1'>
          <ul className='space-y-2'>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-xl transition-all duration-200 group
                    ${isActive(item.path) 
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-200' 
                      : 'text-slate-500 hover:bg-white hover:text-orange-600 hover:shadow-sm'
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

        {/* Bottom Actions / Logout */}
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
    </aside>
  );
};

export default Sidebar;