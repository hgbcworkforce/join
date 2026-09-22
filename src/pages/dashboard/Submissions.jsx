import { useState, useEffect, useCallback } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import SubmissionModal from '../../components/dashboard/SubmissionModal';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaFileExport, 
  FaFilter, 
  FaMagnifyingGlass,
  FaCheck,
  FaClock,
  FaTrashCan,
  FaCircleCheck,
  FaCircleExclamation,
  FaRotate,
  FaShieldHalved,
  FaEnvelope,
  FaPhone,
  FaEye
} from 'react-icons/fa6';

const Submissions = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [deleteModalSubmission, setDeleteModalSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [followUpFilter, setFollowUpFilter] = useState(""); // "", "contacted", "pending"
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Pagination States
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Toast / Feedback State
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4000);
  };

  // Determine if current logged-in user is an administrator
  const userRole = user?.role?.toLowerCase();
  const isAdmin = userRole === 'admin' || userRole === 'super_admin' || userRole === 'pastor';

  const nPages = Math.ceil(totalRecords / recordsPerPage);

  const getStatusBadge = (status) => {
    const styles = {
      student: "bg-blue-50 text-blue-700 border-blue-100",
      professional: "bg-purple-50 text-purple-700 border-purple-100",
      other: "bg-slate-50 text-slate-700 border-slate-100"
    };
    return styles[status?.toLowerCase()] || styles.other;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Fetch Submissions Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(`/first-timers`, {
        params: {
          page: currentPage,
          limit: recordsPerPage,
          search: searchTerm,
          status: statusFilter,
          followUpStatus: followUpFilter,
        }
      });
      
      setData(res.data?.data || []);
      
      if (res.data?.pagination?.total !== undefined) {
        setTotalRecords(res.data.pagination.total);
      } else {
        const totalHeader = res.headers["x-total-count"] || res.headers["X-Total-Count"];
        if (totalHeader) setTotalRecords(Number(totalHeader));
      }
    } catch (error) {
      console.error("Fetch failed", error);
      showAlert('error', error.response?.data?.message || "Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, followUpFilter]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchData]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  // Toggle Follow-up Status (Admin only)
  const handleToggleFollowed = async (submission, e) => {
    if (e) e.stopPropagation();
    if (!isAdmin) return;

    const currentStatus = submission.followUpStatus?.toLowerCase();
    const isCurrentlyFollowed = currentStatus === 'contacted' || currentStatus === 'followed' || currentStatus === 'integrated';
    const newStatus = isCurrentlyFollowed ? 'pending' : 'contacted';

    setUpdatingId(submission.id);

    try {
      await API.patch(`/first-timers/${submission.id}`, {
        followUpStatus: newStatus,
      });

      // Optimistic update in UI
      setData(prev => prev.map(item => {
        if (item.id === submission.id) {
          return { ...item, followUpStatus: newStatus };
        }
        return item;
      }));

      // Update selectedSubmission if open in modal
      if (selectedSubmission?.id === submission.id) {
        setSelectedSubmission(prev => ({ ...prev, followUpStatus: newStatus }));
      }

      showAlert(
        'success', 
        newStatus === 'contacted' 
          ? `Marked "${submission.fullName}" as Followed Up!` 
          : `Marked "${submission.fullName}" as Follow-up Pending.`
      );
    } catch (error) {
      console.error("Status update failed:", error);
      showAlert('error', error.response?.data?.message || "Failed to update follow-up status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Submission Action (Admin only)
  const handleDeleteSubmission = async () => {
    if (!deleteModalSubmission || !isAdmin) return;

    const target = deleteModalSubmission;
    setDeletingId(target.id);

    try {
      await API.delete(`/first-timers/${target.id}`);
      
      setData(prev => prev.filter(item => item.id !== target.id));
      setTotalRecords(prev => Math.max(0, prev - 1));
      setDeleteModalSubmission(null);

      if (selectedSubmission?.id === target.id) {
        setSelectedSubmission(null);
      }

      showAlert('success', `Submission for "${target.fullName}" was removed successfully.`);
    } catch (error) {
      console.error("Delete failed:", error);
      showAlert('error', error.response?.data?.message || "Failed to delete submission.");
    } finally {
      setDeletingId(null);
    }
  };

  // Export CSV
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const response = await API.get("/first-timers/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `hgbc_first_timers_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showAlert('success', "Submissions exported to CSV successfully.");
    } catch (error) {
      console.error("CSV Export failed", error);
      showAlert('error', "Failed to export CSV. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      
      {/* Toast Alert Banner */}
      {alert && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold animate-in slide-in-from-top-4 duration-300 ${
          alert.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-500/10' 
            : 'bg-red-50 text-red-800 border-red-200 shadow-red-500/10'
        }`}>
          {alert.type === 'success' ? <FaCircleCheck className="text-emerald-600" /> : <FaCircleExclamation className="text-red-600" />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Submissions</h2>
          <p className="text-slate-500 mt-1">Manage and review all incoming first timer and guest registrations.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
          >
            <FaRotate className={`text-xs ${isRefreshing ? 'animate-spin text-orange-600' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          {/* Export CSV Button (Admin Only or All) */}
          <button 
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-orange-600/20 disabled:opacity-50 cursor-pointer"
          >
            <FaFileExport className="text-xs" /> 
            <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* Quick Follow-up Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => { setFollowUpFilter(""); setCurrentPage(1); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            followUpFilter === ""
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Submissions ({totalRecords})
        </button>

        <button
          onClick={() => { setFollowUpFilter("pending"); setCurrentPage(1); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            followUpFilter === "pending"
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-amber-700 hover:bg-amber-50'
          }`}
        >
          <FaClock className="text-[11px]" />
          <span>Pending Follow-up</span>
        </button>

        <button
          onClick={() => { setFollowUpFilter("contacted"); setCurrentPage(1); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            followUpFilter === "contacted"
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <FaCheck className="text-[11px]" />
          <span>Followed Up</span>
        </button>
      </div>

      {/* Polished Search & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaMagnifyingGlass className="text-slate-400 group-focus-within:text-orange-600 transition-colors" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name, email or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 relative">
          {/* Category Filter Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-white border ${statusFilter ? 'border-orange-500 text-orange-600 bg-orange-50/50' : 'border-slate-200 text-slate-600'} rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all cursor-pointer`}
            >
              <FaFilter className="text-xs" /> 
              <span>{statusFilter ? `Category: ${statusFilter}` : 'Filter Category'}</span>
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 py-2">
                <button
                  onClick={() => { setStatusFilter(""); setShowFilterDropdown(false); setCurrentPage(1); }}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 ${!statusFilter ? 'text-orange-600 font-bold' : 'text-slate-600'}`}
                >
                  All Categories
                </button>
                <button
                  onClick={() => { setStatusFilter("student"); setShowFilterDropdown(false); setCurrentPage(1); }}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 ${statusFilter === 'student' ? 'text-orange-600 font-bold' : 'text-slate-600'}`}
                >
                  Student
                </button>
                <button
                  onClick={() => { setStatusFilter("professional"); setShowFilterDropdown(false); setCurrentPage(1); }}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 ${statusFilter === 'professional' ? 'text-orange-600 font-bold' : 'text-slate-600'}`}
                >
                  Professional
                </button>
                <button
                  onClick={() => { setStatusFilter("other"); setShowFilterDropdown(false); setCurrentPage(1); }}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 ${statusFilter === 'other' ? 'text-orange-600 font-bold' : 'text-slate-600'}`}
                >
                  Other
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Guest Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Gender / DOB</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Contact Info</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Category / Occupation</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Follow-up Status</th>
                {isAdmin && (
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Admin Actions</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={isAdmin ? 6 : 5} className="px-6 py-4">
                      <div className="h-9 bg-slate-100 rounded-xl w-full" />
                    </td>
                  </tr>
                ))
              ) : data.length > 0 ? (
                data.map((submission) => {
                  const followUp = submission.followUpStatus?.toLowerCase();
                  const isFollowed = followUp === 'contacted' || followUp === 'followed' || followUp === 'integrated';
                  const isUpdating = updatingId === submission.id;

                  return (
                    <tr 
                      key={submission.id} 
                      className="hover:bg-orange-50/20 transition-colors group cursor-pointer"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      {/* Name & Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-bold text-xs group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                            {getInitials(submission?.fullName)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-sm group-hover:text-orange-600 transition-colors block">
                              {submission?.fullName}
                            </span>
                            <span className={`inline-block px-2 py-0.5 text-[9px] font-bold rounded-md border uppercase tracking-wider mt-0.5 ${getStatusBadge(submission?.status)}`}>
                              {submission?.status}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Gender & DOB */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700 capitalize">{submission?.gender || '---'}</span>
                          <span className="text-xs text-slate-400 font-mono tracking-tighter">{submission?.dateOfBirth || "---"}</span>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <FaPhone className="text-[10px] text-slate-400" />
                            <span>{submission?.phoneNumber}</span>
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <FaEnvelope className="text-[10px] text-slate-400" />
                            <span>{submission?.email}</span>
                          </span>
                        </div>
                      </td>

                      {/* Category Details */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700 truncate max-w-[170px]">
                            {submission?.studentFaculty || submission?.professionalOrganization || submission?.professionalOccupation || submission?.otherStatus || '---'}
                          </span>
                          <span className="text-[11px] text-slate-400 italic">
                            {submission?.studentDepartment || submission?.studentLevel}
                          </span>
                        </div>
                      </td>

                      {/* Follow-up Status */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border transition-all ${
                          isFollowed
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          {isFollowed ? (
                            <>
                              <FaCircleCheck className="text-emerald-600 text-xs" />
                              <span>Followed</span>
                            </>
                          ) : (
                            <>
                              <FaClock className="text-amber-600 text-xs" />
                              <span>Pending</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Admin Actions */}
                      {isAdmin && (
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            
                            {/* Toggle Followed Button */}
                            <button
                              onClick={(e) => handleToggleFollowed(submission, e)}
                              disabled={isUpdating}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm cursor-pointer ${
                                isFollowed
                                  ? 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300'
                                  : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10'
                              }`}
                              title={isFollowed ? "Click to set back to Pending" : "Click to mark as Followed"}
                            >
                              {isUpdating ? (
                                <FaRotate className="text-xs animate-spin" />
                              ) : (
                                <FaCheck className="text-xs" />
                              )}
                              <span>{isFollowed ? 'Followed' : 'Mark Followed'}</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteModalSubmission(submission);
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 hover:border-red-200 transition-all cursor-pointer shadow-sm"
                              title="Delete Submission"
                            >
                              <FaTrashCan className="text-xs" />
                            </button>

                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="text-center py-20 text-slate-400 font-medium">
                    No submissions matching your filter criteria.
                  </td>
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
              onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.max(1, prev - 1)); }}
              className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm cursor-pointer"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            
            <div className="flex items-center gap-1">
               <span className="px-4 py-1.5 bg-orange-600 text-white rounded-lg text-sm font-bold shadow-sm shadow-orange-200">
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
              className="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm cursor-pointer"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* 1. Full Submission Detail Modal */}
      {selectedSubmission && (
        <SubmissionModal 
          data={selectedSubmission} 
          onClose={() => setSelectedSubmission(null)}
          isAdmin={isAdmin}
          onToggleFollowed={handleToggleFollowed}
          onDelete={(sub) => setDeleteModalSubmission(sub)}
        />
      )}

      {/* 2. Admin Delete Confirmation Modal */}
      {deleteModalSubmission && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl mx-auto mb-4">
              <FaTrashCan />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">Delete Guest Submission?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete the submission for <strong>{deleteModalSubmission.fullName}</strong> (<span className="font-mono">{deleteModalSubmission.email}</span>)?
              </p>
              <p className="text-xs text-red-600 font-medium pt-1">
                This record will be permanently erased from the follow-up CRM.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalSubmission(null)}
                className="w-1/2 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmission}
                disabled={Boolean(deletingId)}
                className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/20 disabled:opacity-50 cursor-pointer"
              >
                {deletingId ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Submissions;