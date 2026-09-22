import { useState, useEffect } from "react";
import { X, Menu, ExternalLink } from "lucide-react";
import logo from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar-container fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-black shadow-lg'
        : 'bg-transparent'
        }`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <div className="flex-shrink-0 group">
              <a
                href="https://www.hgbcinfluencers.org"
                className="flex items-center space-x-2 transition-transform duration-300 group-hover:scale-105"
              >
                <img src={logo} alt="logo" className="w-10 md:w-16" />
              </a>
            </div>

            {/* CTA Button */}
            <div className="flex items-center space-x-4">
              <a
                href='https://www.hgbcinfluencers.org'
                className="flex items-center gap-2 bg-orange-500 text-white px-3 md:px-6 py-1 md:py-2.5 font-medium text-sm transition-all duration-300 hover:bg-orange-600 cursor-pointer  text-center"
              >
                Visit main site <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default Navbar;