import React from 'react'
import MetricsCards from '../../components/dashboard/MetricsCards'


const RecentSubmissions = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '+1 234 567 8901', date: 'Jan 15, 2023', role: 'Student' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1 234 567 8902', date: 'Jan 16, 2023', role: 'Student' },
  { id: 3, name: 'Michael Johnson', email: 'michael.johnson@example.com', phone: '+1 234 567 8903', date: 'Jan 17, 2023', role: 'Graduate' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', phone: '+1 234 567 8904', date: 'Jan 18, 2023', role: 'Student' },
  { id: 5, name: 'David Wilson', email: 'david.wilson@example.com', phone: '+1 234 567 8905', date: 'Jan 19, 2023', role: 'Engineer' },
  { id: 6, name: 'Sarah Brown', email: 'sarah.brown@example.com', phone: '+1 234 567 8906', date: 'Jan 20, 2023', role: 'Student' },
  { id: 7, name: 'Chris Lee', email: 'chris.lee@example.com', phone: '+1 234 567 8907', date: 'Jan 21, 2023', role: 'Pastor' },
]



const Overview = () => {
  return (
    <div className=''>
      <div className='flex flex-col justify-start'>
        <h2 className='text-2xl md:text-4xl font-bold text-gray-800'>Overview</h2>
        <p className='text-gray-600'>View key metrics and insights at a glance.</p>

      </div>
      <div className='flex flex-col space-y-8 mt-16'>
        <MetricsCards />

        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto'>
          {/* Header Section */}
          <div className='p-6 border-b border-gray-50 flex justify-between items-center'>
            <h2 className='text-xl font-bold text-gray-800 tracking-tight'>Recent Submissions</h2>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left border-separate border-spacing-0'>
              <thead>
                <tr className='bg-gray-50/50'>
                  <th className='px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100'>Name</th>
                  <th className='px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100'>Contact Info</th>
                  <th className='px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100'>Submission Date</th>
                  <th className='px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100'>Role/Status</th>
                  <th className='px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100'></th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-100'>

                {RecentSubmissions.map((submission) => (
                  <tr key={submission.id} className='hover:bg-blue-50/30 transition-all duration-200 group'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center'>
                        <div className='h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mr-3'>
                          {submission.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className='font-medium text-gray-900'>{submission.name}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-col'>
                        <span className='text-sm text-gray-700'>{submission.email}</span>
                        <span className='text-xs text-gray-400'>{submission.phone}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600'>{submission.date}</td>
                    <td className='px-6 py-4'>
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        {submission.role}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <button className='text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

  )
}

export default Overview