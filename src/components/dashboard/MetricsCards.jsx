import React from 'react'
import { FaFileImport, FaCalendarDay, FaUserCheck, FaShareNodes } from "react-icons/fa6";

const metricsData = [
    {
        id: 1,
        title: 'Total Submissions',
        value: '500',
        icon: <FaFileImport className='text-blue-600 text-4xl' />
    },
    {
        id: 2,
        title: 'Daily Submission',
        value: '25',
        icon: <FaCalendarDay className='text-green-600 text-4xl' />
    },
    {
        id: 3,
        title: 'Followed Up',
        value: '440',
        icon: <FaUserCheck className='text-purple-600 text-4xl' />
    },
    {
        id: 4,
        title: 'Discovery Source',
        value: 'Social Media',
        icon: <FaShareNodes className='text-orange-600 text-4xl' />
    },
];




const MetricsCards = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
      {metricsData.map((metric) => (
        <div 
          key={metric.id} 
          className="group flex flex-col items-start p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default"
        >
          {/* Icon Container with subtle background */}
          <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300 mb-4">
            {metric.icon}
          </div>

          <div className="space-y-1">
            <h3 className='text-gray-500 text-sm font-semibold uppercase tracking-wider'>
              {metric.title}
            </h3>
            <p className='text-gray-900 text-3xl font-extrabold tracking-tight'>
              {metric.value}
            </p>
          </div>
          
          {/* Optional: Add a small trend indicator or footer decoration */}
          <div className="mt-4 w-full h-1 bg-gray-50 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-1/3 group-hover:w-full transition-all duration-700"></div>
          </div>
        </div>
      ))}
    </div>
  )
}


export default MetricsCards