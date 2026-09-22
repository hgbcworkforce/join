import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FaFileImport, FaCalendarDay, FaUserCheck, FaShareNodes } from "react-icons/fa6";

const MetricsCards = () => {
  const [metrics, setMetrics] = useState({
    totalSubmissions: 0,
    dailySubmissions: 0,
    followedUp: 0,
    topDiscoverySource: "No data",
    topDiscoveryCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // Try dedicated metrics endpoint first
        const res = await API.get("/metrics");
        if (res.data?.data) {
          setMetrics(res.data.data);
        }
      } catch (error) {
        console.warn("Metrics endpoint failed, falling back to direct calculation", error);
        try {
          const res = await API.get("/first-timers");
          const submissions = res.data?.data || [];
          
          const today = new Date().toISOString().split('T')[0];
          const daily = submissions.filter(sub => sub.createdAt?.split('T')[0] === today).length;

          const sourceCounts = {};
          submissions.forEach(sub => {
            if (sub.howDidYouHear) {
              sourceCounts[sub.howDidYouHear] = (sourceCounts[sub.howDidYouHear] || 0) + 1;
            }
          });

          let topSource = "No data";
          let maxCount = 0;
          Object.entries(sourceCounts).forEach(([src, cnt]) => {
            if (cnt > maxCount) {
              maxCount = cnt;
              topSource = src;
            }
          });

          setMetrics({
            totalSubmissions: submissions.length,
            dailySubmissions: daily,
            followedUp: submissions.filter(s => s.followUpStatus && s.followUpStatus !== 'pending').length,
            topDiscoverySource: topSource,
            topDiscoveryCount: maxCount,
          });
        } catch (fallbackError) {
          console.error("Failed to load metrics", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
      {/* Total Submissions */}
      <div className="group flex flex-col items-start p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-default">
        <div className="p-2.5 sm:p-3 bg-blue-50 text-blue-600 rounded-xl mb-3 sm:mb-4">
          <FaFileImport className="text-2xl sm:text-3xl" />
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            Total Submissions
          </h3>
          <p className="text-slate-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
            {loading ? "..." : metrics.totalSubmissions}
          </p>
        </div>
      </div>

      {/* Daily Submissions */}
      <div className="group flex flex-col items-start p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-default">
        <div className="p-2.5 sm:p-3 bg-green-50 text-green-600 rounded-xl mb-3 sm:mb-4">
          <FaCalendarDay className="text-2xl sm:text-3xl" />
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            Daily Submissions
          </h3>
          <p className="text-slate-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
            {loading ? "..." : metrics.dailySubmissions}
          </p>
        </div>
      </div>

      {/* Followed Up */}
      <div className="group flex flex-col items-start p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-default">
        <div className="p-2.5 sm:p-3 bg-purple-50 text-purple-600 rounded-xl mb-3 sm:mb-4">
          <FaUserCheck className="text-2xl sm:text-3xl" />
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            Followed Up
          </h3>
          <p className="text-slate-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
            {loading ? "..." : metrics.followedUp}
          </p>
        </div>
      </div>

      {/* Discovery Sources */}
      <div className="group flex flex-col items-start p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-default">
        <div className="p-2.5 sm:p-3 bg-orange-50 text-orange-600 rounded-xl mb-3 sm:mb-4">
          <FaShareNodes className="text-2xl sm:text-3xl" />
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <h3 className="text-slate-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            Discovery Sources
          </h3>
          <div className="flex space-x-1.5 items-baseline">
            <p className="text-slate-700 text-base sm:text-lg font-bold capitalize truncate max-w-[140px]" title={metrics.topDiscoverySource}>
              {loading ? "..." : metrics.topDiscoverySource}:
            </p>
            <p className="text-slate-900 text-2xl sm:text-3xl font-extrabold tracking-tight">
              {loading ? "" : metrics.topDiscoveryCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;