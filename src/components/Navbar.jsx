import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import logo from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "../data";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleNavbar = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.navbar-container')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar-container fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo - Fixed to use Link instead of anchor */}
            <div className="flex-shrink-0 group">
              <a 
                href="https://www.hgbcinfluencers.org" 
                className="flex items-center space-x-2 transition-transform duration-300 group-hover:scale-105"
              >
                <img src={logo} alt="logo" className="w-10 md:w-16" />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 uppercase ${
                    location.pathname === item.path
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-1 bg-orange-600 "></div>
                  )}
                </a>
              ))}
            </div>

            {/* CTA Button - Fixed nested Link issue */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link 
                to='/give'
                className="bg-orange-500 text-white px-6 py-2.5 font-medium text-sm transition-all duration-300 hover:bg-orange-600 cursor-pointer inline-block text-center"
              >
                Give
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden ">
              <button
                onClick={toggleNavbar}
                className="p-2 rounded-lg  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle navigation menu"
              >
                <div className="relative w-6 h-6">
                  <Menu 
                    className={`absolute inset-0 w-6 h-6 text-white transition-all duration-300 ${
                      mobileMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                    }`} 
                  />
                  <X 
                    className={`absolute inset-0 w-6 h-6 text-white transition-all duration-300 ${
                      mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                    }`} 
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        {/* Mobile Menu */}
        <div 
          className={`absolute top-0 right-0 h-full w-full max-w-[85vw] bg-black backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Links */}
            <div className="flex-1 px-6 py-8 mt-16 space-y-2">
              {navLinks.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? ' text-orange-600'
                      : 'text-gray-200  hover:text-white'
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Footer - Fixed nested Link issue */}
            <div className="p-6 border-t border-gray-200/20">
              <Link
                to='/give'
                onClick={handleLinkClick}
                className="block w-full bg-orange-500 text-white px-6 py-3 rounded-xl font-medium text-lg hover:shadow-lg transition-all duration-300 hover:bg-orange-600 cursor-pointer text-center"
              >
                Give
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default Navbar;