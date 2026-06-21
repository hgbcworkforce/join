import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FaFileImport, FaCalendarDay, FaUserCheck, FaShareNodes } from "react-icons/fa6";


const MetricsCards = () => {

  const [data, setData] = useState([]);
  const [topDiscoverySource, setTopDiscoverySource] = useState(null);
  const [topDiscoveryCount, setTopDiscoveryCount] = useState(0);
  const [dailySubmission, setDailySubmission] = useState(0)

  const getTopDiscoverySource = (submissions) => {
    const sourceCounts = {};

    // Count each discovery source
    submissions.forEach(submission => {
      const source = submission.howDidYouHear;
      if (source) {
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      }
    });

    // Find the source with the highest count
    let topSource = null;
    let maxCount = 0;

    Object.entries(sourceCounts).forEach(([source, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topSource = source;
      }
    });

    return { source: topSource, count: maxCount };
  };

const getDailySubmissions = (submissions) => {
  const today = new Date().toISOString().split('T')[0]; // Gets "YYYY-MM-DD"
  return submissions.filter(sub => 
    sub.createdAt?.split('T')[0] === today
  ).length;
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/first-timers");
        setData(res.data.data);

        // Get top discovery source
        const { source, count } = getTopDiscoverySource(res.data.data);
        setTopDiscoverySource(source);
        setTopDiscoveryCount(count);

        // Get daily submissions
        setDailySubmission(getDailySubmissions(res.data.data));

      } catch (error) {
        console.error("Fetch failed", error);
      }
    };

    fetchData();
  }, []);




  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
         <div  className="group flex flex-col items-start p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default">

          <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300 mb-4">
            <FaFileImport className='text-blue-600 text-4xl' />
          </div>

          <div className="space-y-1">
            <h3 className='text-gray-500 text-sm font-semibold uppercase tracking-wider'>
              Total Submissions
            </h3>
            <p className='text-gray-900 text-3xl font-extrabold tracking-tight'>
              {data.length}
            </p>
          </div>
          </div>

               <div  className="group flex flex-col items-start p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default">

          <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300 mb-4">
            <FaCalendarDay className='text-green-600 text-4xl' />
          </div>

          <div className="space-y-1">
            <h3 className='text-gray-500 text-sm font-semibold uppercase tracking-wider'>
              Daily Submission
            </h3>
            <p className='text-gray-900 text-3xl font-extrabold tracking-tight'>
             {dailySubmission}
            </p>
          </div>
          </div>

                         <div  className="group flex flex-col items-start p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default">

          <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300 mb-4">
            <FaUserCheck className='text-purple-600 text-4xl' />
          </div>

          <div className="space-y-1">
            <h3 className='text-gray-500 text-sm font-semibold uppercase tracking-wider'>
              Followed Up
            </h3>
            <p className='text-gray-900 text-3xl font-extrabold tracking-tight'>
              {data.length}
            </p>
          </div>
          </div>
 
                                <div  className="group flex flex-col items-start p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default">

          <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-300 mb-4">
            <FaShareNodes className='text-orange-600 text-4xl' />
          </div>

          <div className="space-y-1">
            <h3 className='text-gray-500 text-sm font-semibold uppercase tracking-wider'>
              Discovery Sources
            </h3>
            <div className='flex space-x-1 items-center justify-center'>
               <p className='text-gray-900 text-2xl font-semibold'>
              {topDiscoverySource || 'No data'}:
            </p>
            <p className='text-gray-900 text-3xl font-extrabold tracking-tight'>
              {topDiscoveryCount}
            </p>
            </div>
           
          </div>
          </div>

    </div>
  )
}


export default MetricsCards