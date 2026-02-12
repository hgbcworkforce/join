import React, { useState } from 'react'
import Sidebar from '../layouts/Sidebar'
import Header from '../layouts/Header'
import Overview from '../pages/dashboard/Overview'

const DashboardLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className='flex h-screen overflow-hidden bg-gray-100'>
      {/* Sidebar */}
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      <div className={`flex flex-col flex-1 transition-all duration-300 overflow-x-auto ${isExpanded ? 'ml-[280px]' : 'ml-[80px]'}`}>

        {/* Header  */}
        <Header isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

          {/* Main Content */}
          <main className='flex-1 overflow-y-auto p-6 md:p-8 flex-1'>
            <Overview />
          </main>

        {/* Footer */}
        <footer className='bg-white border-t border-gray-200 py-4 px-6 text-center rounded-t-3xl shadow-sm'>
          <p className='text-sm text-gray-500'>
            © {new Date().getFullYear()} Higher Ground Baptist Church. All rights reserved.
          </p>
        </footer>


      </div>
    </div>
  )
}


export default DashboardLayout
