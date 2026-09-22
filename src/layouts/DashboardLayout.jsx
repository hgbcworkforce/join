import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../layouts/Sidebar';
import Header from '../layouts/Header';

const DashboardLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Automatically close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Sidebar with Mobile Drawer support */}
      <Sidebar 
        isExpanded={isExpanded} 
        setIsExpanded={setIsExpanded} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main App Container */}
      <div 
        className={`flex flex-col flex-1 w-full h-full min-w-0 transition-all duration-300 overflow-x-hidden ${
          isExpanded ? 'md:ml-[260px]' : 'md:ml-[85px]'
        } ml-0`}
      >
        {/* Header */}
        <Header 
          isExpanded={isExpanded} 
          setIsExpanded={setIsExpanded}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Main Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-3.5 px-4 sm:px-6 text-center shadow-sm">
          <p className="text-xs sm:text-sm text-gray-500">
            © {new Date().getFullYear()} Higher Ground Baptist Church. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
