import { useState, useEffect } from 'react';
import API from '../../api/axios';
import SubmissionModal from '../../components/dashboard/SubmissionModal';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

const Submissions = () => {
  const [data, setData] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Calculate pages. Default to 1 if we have data but header is missing.
  const nPages = Math.ceil(totalRecords / recordsPerPage);



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const res = await API.get(`/first-timers?page=${currentPage}&limit=${recordsPerPage}`);
        setData(res.data);

        const totalHeader = res.headers["x-total-count"] || res.headers["X-Total-Count"];
        if (totalHeader) setTotalRecords(Number(totalHeader));
      } catch (error) {
        console.error("Fetch failed", error);
      } finally {
        setLoading(false); // Stop loading regardless of success/fail
      }
    };

    fetchData();
  }, [currentPage]);





  const statusStyles = {
    Student: "bg-green-100 text-green-800",
    Professional: "bg-red-100 text-red-800",
    Other: "bg-yellow-100 text-yellow-800"
  };

  return (
    <div className=''>
      <div className='flex flex-col justify-start'>
        <h2 className='text-2xl md:text-4xl font-bold text-gray-800'>Submissions</h2>
        <p className='text-gray-600'>View key metrics and insights at a glance.</p>
      </div>

      <div className='flex flex-col space-y-6 mt-16'>
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Gender</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>DOB</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Contact Info</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Level/Field</th>
              </tr>
            </thead>

            <tbody className='bg-white divide-y divide-gray-200'>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-20">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
                      <p className="text-gray-500 font-medium animate-pulse">Fetching submissions...</p>
                    </div>
                  </td>
                </tr>
              ) : Array.isArray(data) && data.length > 0 ? (
                data.map((submission) => (
                  <tr key={submission.id} className='hover:bg-gray-50 transition-all duration-200'>
                    <td className='px-6 py-4 whitespace-nowrap hover:underline cursor-pointer' onClick={() => setSelectedSubmission(submission)}>
                      {submission?.fullName}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>{submission?.gender}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>{submission?.dateOfBirth}</td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-col'>
                        <span className='text-sm text-gray-700'>{submission?.phoneNumber}</span>
                        <span className='text-xs text-gray-400'>{submission?.email}</span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[submission?.status] || statusStyles.Other}`}>
                        {submission?.status}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-col'>
                        {submission?.studentFaculty ? (
                          <span className='text-sm text-gray-700'>{submission.studentFaculty}</span>
                        ) : (
                          <span className='text-sm text-gray-700'>{submission?.occupationField || 'N/A'}</span>
                        )}
                        <span className='text-xs text-gray-400'>{submission?.studentDepartment}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className='text-center py-10 text-gray-500'>No submissions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedSubmission && (
          <SubmissionModal data={selectedSubmission} onClose={() => setSelectedSubmission(null)} />
        )}

        {/* Pagination UI */}
        <div className="flex justify-between items-center space-x-2 mt-8">
          <span className="text-gray-600 font-medium">
            Page {data.length === 0 ? 0 : currentPage} of {Math.max(nPages, 1)}
          </span>

          <div className='flex flex-row space-x-2'>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-3 py-1 bg-white border cursor-pointer rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className='text-xl' />
            </button>

            <button
              // Button is enabled if we have exactly 10 items (meaning there might be more) 
              // or if we haven't reached the calculated nPages yet.
              disabled={data.length < recordsPerPage && currentPage >= nPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1 bg-white border cursor-pointer rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronRight className='text-xl' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submissions;