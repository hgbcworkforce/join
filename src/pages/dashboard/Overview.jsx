import { useState, useEffect } from 'react';
import API from '../../api/axios';
import MetricsCards from '../../components/dashboard/MetricsCards';
import { FaChevronRight } from 'react-icons/fa6';

const Overview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Updated API call within useEffect
        const res = await API.get('/first-timers?page=1&limit=7'); // Changed limit to 7
        setData(res.data.data);
      } catch (error) {
        console.error("Fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Added missing dependency array

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h2>
          <p className="text-slate-500 mt-1">Real-time performance and recent influencer activity.</p>
        </div>
      </div>

      {/* Metrics Section */}
      <MetricsCards />

      {/* Recent Submissions Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Table Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Recent Submissions</h3>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Gender</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Contact Info</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                // Skeleton Loader
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-10 w-40 bg-slate-100 rounded-lg" /></td>
                    <td className="px-6 py-5"><div className="h-6 w-12 bg-slate-100 rounded-md mx-auto" /></td>
                    <td className="px-6 py-5"><div className="h-10 w-48 bg-slate-100 rounded-lg" /></td>
                    <td className="px-6 py-5"><div className="h-8 w-20 bg-slate-100 rounded-full" /></td>
                  </tr>
                ))
              ) : data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                          {item.fullName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-semibold text-slate-700 whitespace-nowrap">{item.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded capitalize">
                        {item.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{item.email}</span>
                        <span className="text-xs text-slate-400 font-mono tracking-tighter">{item.phoneNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;