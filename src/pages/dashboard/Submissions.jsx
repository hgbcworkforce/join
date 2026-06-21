import { useState, useEffect } from 'react';
import API from '../../api/axios';
import SubmissionModal from '../../components/dashboard/SubmissionModal';
import { FaChevronLeft, FaChevronRight, FaFileExport, FaFilter, FaMagnifyingGlass } from 'react-icons/fa6';

const Submissions = () => {
  const [data, setData] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Track search query
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const nPages = Math.ceil(totalRecords / recordsPerPage);

  const getStatusBadge = (status) => {
    const styles = {
      student: "bg-blue-50 text-blue-700 border-blue-100",
      professional: "bg-purple-50 text-purple-700 border-purple-100",
      other: "bg-slate-50 text-slate-700 border-slate-100"
    };
    return styles[status?.toLowerCase()] || styles.other;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

// Fetch Logic
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Added search parameter to API call
        const res = await API.get(`/first-timers`, {
          params: {
            page: currentPage,
            limit: recordsPerPage,
            search: searchTerm // Assuming your backend handles 'search' query
          }
        });
        
        setData(res.data.data);
        const totalHeader = res.headers["x-total-count"] || res.headers["X-Total-Count"];
        if (totalHeader) setTotalRecords(Number(totalHeader));
      } catch (error) {
        console.error("Fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce Logic: Wait 500ms after user stops typing to fetch
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Submissions</h2>
          <p className="text-slate-500 mt-1">Manage and review all incoming influencer applications.</p>
        </div>
      </div>

{/* Polished Search Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaMagnifyingGlass className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name, email or status..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
            <FaFilter className="text-xs" /> Filter
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
            <FaFileExport className="text-xs" /> Export CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Gender</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-nowrap">DOB</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Contact Info</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Level/Field</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-4"><div className="h-8 bg-slate-100 rounded-lg w-full" /></td>
                  </tr>
                ))
              ) : data.length > 0 ? (
                data.map((submission) => (
                  <tr 
                    key={submission.id} 
                    className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors uppercase text-sm">
                        {submission?.fullName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{submission?.gender}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono tracking-tighter text-nowrap">{submission?.dateOfBirth}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{submission?.phoneNumber}</span>
                        <span className="text-xs text-slate-400">{submission?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full border ${getStatusBadge(submission?.status)}`}>
                        {submission?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700 truncate max-w-[150px]">
                          {submission?.studentFaculty || submission?.occupationField || '---'}
                        </span>
                        <span className="text-[11px] text-slate-400 italic">
                          {submission?.studentDepartment}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-slate-400 font-medium">No records available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="text-slate-900">{data.length > 0 ? (currentPage - 1) * recordsPerPage + 1 : 0}</span> to <span className="text-slate-900">{Math.min(currentPage * recordsPerPage, totalRecords)}</span> of <span className="text-slate-900">{totalRecords}</span> results
          </p>
          
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => prev - 1); }}
              className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            
            <div className="flex items-center gap-1">
               <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm shadow-indigo-200">
                {currentPage}
               </span>
               <span className="text-slate-400 px-1 text-sm font-medium">of</span>
               <span className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold">
                {Math.max(nPages, 1)}
               </span>
            </div>

            <button
              disabled={currentPage >= nPages}
              onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => prev + 1); }}
              className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>

      {selectedSubmission && (
        <SubmissionModal data={selectedSubmission} onClose={() => setSelectedSubmission(null)} />
      )}
    </div>
  );
};

export default Submissions;