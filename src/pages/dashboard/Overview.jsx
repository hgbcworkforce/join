import { useState, useEffect } from 'react';
import API from '../../api/axios';
import MetricsCards from '../../components/dashboard/MetricsCards'



const Overview = () => {
    const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


    useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const res = await API.get('/first-timers?page=1&limit=5');
        setData(res.data.data);

      } catch (error) {
        console.error("Fetch failed", error);
      } finally {
        setLoading(false); // Stop loading regardless of success/fail
      }
    };

    fetchData();
  });



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
                  <th className='px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100'>Gender</th>
                  <th className='px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100'>Contact Info</th>
                  <th className='px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100'>Status</th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-100'>

                {data.map((data) => (
                  <tr key={data.id} className='hover:bg-blue-50/30 transition-all duration-200 group'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center'>
                        <div className='h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mr-3'>
                          {data.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className='font-medium text-gray-900'>{data.fullName}</span>
                      </div>
                    </td>
                        <td className='px-6 py-4'>
                      <span className='text-xs font-medium text-gray-900'>
                        {data.gender}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-col'>
                        <span className='text-sm text-gray-700'>{data.email}</span>
                        <span className='text-xs text-gray-400'>{data.phoneNumber}</span>
                      </div>
                    </td>
                                        <td className='px-6 py-4'>
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        {data.status}
                      </span>
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