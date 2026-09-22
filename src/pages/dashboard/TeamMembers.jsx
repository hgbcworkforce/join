import { useState, useEffect, useMemo } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  FaUserGear,
  FaShieldHalved,
  FaUserGroup,
  FaUserPlus,
  FaMagnifyingGlass,
  FaFilter,
  FaRotate,
  FaTrashCan,
  FaPenToSquare,
  FaEnvelope,
  FaCalendarDays,
  FaCheck,
  FaXmark,
  FaCircleExclamation,
  FaLock,
  FaUserTie
} from 'react-icons/fa6';

const TeamMembers = () => {
  const { user: currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [deleteModalUser, setDeleteModalUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [selectedNewRole, setSelectedNewRole] = useState('');
  const [roleSubmitting, setRoleSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Add Member Form State
  const [newMemberData, setNewMemberData] = useState({
    fullName: '',
    email: '',
    role: 'team_member',
    password: '',
  });
  const [addMemberSubmitting, setAddMemberSubmitting] = useState(false);
  const [addMemberError, setAddMemberError] = useState('');

  // Toast / Feedback
  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000);
  };

  // Check if current user is an Admin / Super Admin / Pastor
  const currentUserRole = currentUser?.role?.toLowerCase();
  const isAdmin = currentUserRole === 'admin' || currentUserRole === 'super_admin' || currentUserRole === 'pastor';

  // Fetch Team Members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/users');
      let fetched = res.data?.data || [];

      // Guarantee the current user is included in the list
      if (currentUser?.email) {
        const exists = fetched.some(
          (m) => (currentUser.id && m.id === currentUser.id) ||
            (m.email && m.email.toLowerCase() === currentUser.email.toLowerCase())
        );
        if (!exists) {
          fetched = [
            {
              id: currentUser.id || 'current-user-id',
              fullName: currentUser.fullName || currentUser.full_name || 'Current User',
              email: currentUser.email,
              role: currentUser.role || 'team_member',
              isActive: true,
              createdAt: currentUser.createdAt || new Date().toISOString(),
            },
            ...fetched,
          ];
        }
      }

      setMembers(fetched);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      // Fallback: If network error or endpoint issue, ensure at least current user is visible
      if (currentUser?.email) {
        setMembers([
          {
            id: currentUser.id || 'current-user-id',
            fullName: currentUser.fullName || currentUser.full_name || 'Current User',
            email: currentUser.email,
            role: currentUser.role || 'team_member',
            isActive: true,
            createdAt: currentUser.createdAt || new Date().toISOString(),
          },
        ]);
      }
      showAlert('error', error.response?.data?.message || 'Failed to load team members directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [currentUser]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchMembers();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesRole = roleFilter === 'all' || member.role?.toLowerCase() === roleFilter.toLowerCase();
      const s = searchTerm.toLowerCase().trim();
      const matchesSearch = !s ||
        member.fullName?.toLowerCase().includes(s) ||
        member.email?.toLowerCase().includes(s);
      return matchesRole && matchesSearch;
    });
  }, [members, roleFilter, searchTerm]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = members.length;
    const admins = members.filter(m => m.role === 'admin' || m.role === 'super_admin').length;
    const pastors = members.filter(m => m.role === 'pastor').length;
    const teamMembers = members.filter(m => m.role === 'team_member' || !m.role).length;
    return { total, admins, pastors, teamMembers };
  }, [members]);

  // Formatters
  const formatRole = (role) => {
    if (!role) return 'Team Member';
    const clean = role.toLowerCase().replace(/_/g, ' ');
    if (clean === 'super admin') return 'Super Admin';
    if (clean === 'admin') return 'Administrator';
    if (clean === 'pastor') return 'Pastor / Minister';
    if (clean === 'team member') return 'Team Member';
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case 'super_admin':
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'pastor':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Handle Role Change Submission
  const handleRoleChangeSubmit = async (e) => {
    e.preventDefault();
    if (!roleModalUser || !selectedNewRole) return;

    setRoleSubmitting(true);
    try {
      await API.patch(`/users/${roleModalUser.id}/role`, { role: selectedNewRole });
      showAlert('success', `Role for ${roleModalUser.fullName} updated to ${formatRole(selectedNewRole)}.`);
      setRoleModalUser(null);
      fetchMembers();
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Failed to update user role.');
    } finally {
      setRoleSubmitting(false);
    }
  };

  // Handle Delete User Submission
  const handleDeleteSubmit = async () => {
    if (!deleteModalUser) return;

    setDeleteSubmitting(true);
    try {
      await API.delete(`/users/${deleteModalUser.id}`);
      showAlert('success', `User account for ${deleteModalUser.fullName} was removed.`);
      setDeleteModalUser(null);
      fetchMembers();
    } catch (error) {
      showAlert('error', error.response?.data?.message || 'Failed to delete user.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // Handle Add Member Submission
  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    setAddMemberError('');

    if (newMemberData.password.length < 6) {
      setAddMemberError('Temporary password must be at least 6 characters.');
      return;
    }

    setAddMemberSubmitting(true);
    try {
      await API.post('/users', newMemberData);
      showAlert('success', `Team member ${newMemberData.fullName} created successfully.`);
      setIsAddModalOpen(false);
      setNewMemberData({
        fullName: '',
        email: '',
        role: 'team_member',
        password: '',
      });
      fetchMembers();
    } catch (error) {
      setAddMemberError(error.response?.data?.message || 'Failed to create team member.');
    } finally {
      setAddMemberSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

      {/* Toast Alert Banner */}
      {alertMessage && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold animate-in slide-in-from-top-4 duration-300 ${alertMessage.type === 'success'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-500/10'
          : 'bg-red-50 text-red-800 border-red-200 shadow-red-500/10'
          }`}>
          {alertMessage.type === 'success' ? <FaCheck className="text-emerald-600" /> : <FaCircleExclamation className="text-red-600" />}
          <span>{alertMessage.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
              <FaUserGear className="text-xl" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Team Members</h2>
              <p className="text-slate-500 text-sm mt-0.5">Directory of workforce ministers, admins, and follow-up team members.</p>
            </div>
          </div>
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

          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-orange-600/20 cursor-pointer"
            >
              <FaUserPlus className="text-sm" />
              <span>Add Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Permission Notice Banner for Regular Members */}
      {!isAdmin && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-amber-800 text-xs md:text-sm">
          <div className="flex items-center gap-2.5 font-medium">
            <FaCircleExclamation className="text-amber-600 text-base shrink-0" />
            <span>You have <strong>Read-Only</strong> access to the Team Directory. Contact a church administrator to request role adjustments.</span>
          </div>
          <span className="shrink-0 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold uppercase tracking-wider">
            Team Member
          </span>
        </div>
      )}

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Members */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Members</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{loading ? '...' : metrics.total}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl">
            <FaUserGroup />
          </div>
        </div>

        {/* Administrators */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Administrators</p>
            <p className="text-2xl font-extrabold text-purple-700 mt-1">{loading ? '...' : metrics.admins}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
            <FaShieldHalved />
          </div>
        </div>

        {/* Pastors & Ministers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pastors / Leaders</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{loading ? '...' : metrics.pastors}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            <FaUserTie />
          </div>
        </div>

        {/* Follow-up Team */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Follow-Up Workers</p>
            <p className="text-2xl font-extrabold text-slate-700 mt-1">{loading ? '...' : metrics.teamMembers}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            <FaUserGear />
          </div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaMagnifyingGlass className="text-slate-400 group-focus-within:text-orange-600 transition-colors" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search member by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600 transition-all shadow-sm"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <FaFilter className="text-[10px]" /> Filter:
          </span>
          {['all', 'admin', 'pastor', 'team_member'].map((roleKey) => (
            <button
              key={roleKey}
              onClick={() => setRoleFilter(roleKey)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${roleFilter === roleKey
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              {roleKey === 'all' ? 'All Roles' : formatRole(roleKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Team Directory</h3>
            <p className="text-xs text-slate-400 mt-0.5">Showing {filteredMembers.length} active registered accounts</p>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Member</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Email Address</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Access Role</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Registered Date</th>
                {isAdmin && (
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Admin Actions</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 w-44 bg-slate-100 rounded-xl" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-40 bg-slate-100 rounded-lg" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-slate-100 rounded-full mx-auto" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-28 bg-slate-100 rounded-lg" /></td>
                    {isAdmin && <td className="px-6 py-4"><div className="h-8 w-20 bg-slate-100 rounded-lg ml-auto" /></td>}
                  </tr>
                ))
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((member) => {
                  const isCurrent = Boolean(
                    (currentUser?.id && member.id === currentUser.id) ||
                    (currentUser?.email && member.email && member.email.toLowerCase() === currentUser.email.toLowerCase())
                  );
                  const memberRole = member.role || 'team_member';

                  return (
                    <tr
                      key={member.id}
                      className={`transition-colors group ${isCurrent ? 'bg-green-50/40 hover:bg-green-50/70 border-l-4 border-l-green-500' : 'hover:bg-slate-50/80'
                        }`}
                    >

                      {/* Member Name + Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="h-10 w-10 shrink-0 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                              {getInitials(member.fullName)}
                            </div>
                            {isCurrent && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 text-sm leading-tight">
                                {member.fullName}
                              </span>
                              {isCurrent && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-extrabold rounded-md uppercase tracking-wider border border-orange-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 capitalize">
                              {isCurrent ? 'Current Session • Active' : member.isActive ? 'Active Member' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email Address */}
                      <td className="px-6 py-4">
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
                        >
                          <FaEnvelope className="text-slate-400 text-xs" />
                          <span>{member.email}</span>
                        </a>
                      </td>

                      {/* Access Role Badge */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadgeStyle(memberRole)}`}>
                          {memberRole === 'admin' || memberRole === 'super_admin' ? (
                            <FaShieldHalved className="text-[10px]" />
                          ) : memberRole === 'pastor' ? (
                            <FaUserTie className="text-[10px]" />
                          ) : (
                            <FaUserGroup className="text-[10px]" />
                          )}
                          <span>{formatRole(memberRole)}</span>
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <FaCalendarDays className="text-slate-400" />
                          <span>
                            {member.createdAt
                              ? new Date(member.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                              : '---'}
                          </span>
                        </div>
                      </td>

                      {/* Actions Column (Admin Only) */}
                      {isAdmin && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">

                            {/* Update Role Button */}
                            <button
                              onClick={() => {
                                setRoleModalUser(member);
                                setSelectedNewRole(member.role || 'team_member');
                              }}
                              className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all border border-slate-200 hover:border-orange-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                              title="Update User Role"
                            >
                              <FaPenToSquare className="text-xs" />
                              <span className="hidden sm:inline">Role</span>
                            </button>

                            {/* Delete User Button */}
                            <button
                              onClick={() => setDeleteModalUser(member)}
                              disabled={isCurrent}
                              className={`p-2 rounded-xl transition-all border text-xs font-semibold flex items-center gap-1.5 shadow-sm ${isCurrent
                                ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                                : 'border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 cursor-pointer'
                                }`}
                              title={isCurrent ? "You cannot delete your own account" : "Delete User"}
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
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-16 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center gap-2">
                      <FaUserGroup className="text-3xl text-slate-300" />
                      <p>No team members matching your search/filter criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* ================= MODALS ================= */}

      {/* 1. UPDATE ROLE MODAL */}
      {roleModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                  <FaShieldHalved className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Manage Access Role</h3>
                  <p className="text-xs text-slate-400">{roleModalUser.fullName}</p>
                </div>
              </div>
              <button
                onClick={() => setRoleModalUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <FaXmark className="text-base" />
              </button>
            </div>

            <form onSubmit={handleRoleChangeSubmit} className="mt-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Role Level
                </label>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'team_member',
                      name: 'Team Member',
                      badge: 'Standard Access',
                      desc: 'Can view submissions, guest logs, and team directory.',
                    },
                    {
                      id: 'pastor',
                      name: 'Pastor / Leader',
                      badge: 'Ministerial Access',
                      desc: 'Oversight access to first timers, reports, and follow-up notes.',
                    },
                    {
                      id: 'admin',
                      name: 'Administrator',
                      badge: 'Full Access',
                      desc: 'Can manage user roles, delete accounts, add members, and export all records.',
                    },
                  ].map((roleOpt) => (
                    <label
                      key={roleOpt.id}
                      onClick={() => setSelectedNewRole(roleOpt.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${selectedNewRole === roleOpt.id
                        ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      <input
                        type="radio"
                        name="roleSelect"
                        value={roleOpt.id}
                        checked={selectedNewRole === roleOpt.id}
                        onChange={() => setSelectedNewRole(roleOpt.id)}
                        className="mt-1 accent-orange-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-800">{roleOpt.name}</span>
                          <span className="text-[10px] font-semibold text-slate-500 uppercase">{roleOpt.badge}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{roleOpt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRoleModalUser(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={roleSubmitting}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {roleSubmitting ? 'Updating...' : 'Save Role Changes'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 2. DELETE CONFIRMATION MODAL */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">

            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-xl mx-auto mb-4">
              <FaTrashCan />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">Remove Team Member?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove <strong>{deleteModalUser.fullName}</strong> (<span className="font-mono">{deleteModalUser.email}</span>)?
              </p>
              <p className="text-xs text-red-600 font-medium pt-1">
                This will revoke their access to the workforce portal immediately.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                className="w-1/2 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={deleteSubmitting}
                className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/20 disabled:opacity-50 cursor-pointer"
              >
                {deleteSubmitting ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. ADD TEAM MEMBER MODAL (Admin Only) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                  <FaUserPlus className="text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Add New Team Member</h3>
                  <p className="text-xs text-slate-400">Register a new minister or follow-up worker</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <FaXmark className="text-base" />
              </button>
            </div>

            {addMemberError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                {addMemberError}
              </div>
            )}

            <form onSubmit={handleAddMemberSubmit} className="mt-4 space-y-4">

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sister Grace Johnson"
                  value={newMemberData.fullName}
                  onChange={(e) => setNewMemberData({ ...newMemberData, fullName: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="worker@hgbcinfluencers.org"
                  value={newMemberData.email}
                  onChange={(e) => setNewMemberData({ ...newMemberData, email: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Access Role
                </label>
                <select
                  value={newMemberData.role}
                  onChange={(e) => setNewMemberData({ ...newMemberData, role: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
                >
                  <option value="team_member">Team Member (Standard)</option>
                  <option value="pastor">Pastor / Minister</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Temporary Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newMemberData.password}
                  onChange={(e) => setNewMemberData({ ...newMemberData, password: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                <span className="text-[11px] text-slate-400">Minimum 6 characters</span>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMemberSubmitting}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {addMemberSubmitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default TeamMembers;
