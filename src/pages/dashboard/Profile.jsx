import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
  FaUser,
  FaEnvelope,
  FaShieldHalved,
  FaLock,
  FaKey,
  FaCalendarDays,
  FaCheck,
  FaCircleExclamation,
  FaEye,
  FaEyeSlash,
  FaFloppyDisk,
  FaUserGear,
  FaIdCard,
  FaCircleCheck
} from 'react-icons/fa6';

const Profile = () => {
  const { user, updateUser, refreshUser } = useAuth();

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toast / Feedback State
  const [alert, setAlert] = useState(null);

  const triggerAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  // Synchronize initial data from AuthContext
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || user.full_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Formatter Helpers
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

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    : 'Active Session';

  // Handle Profile Update Submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.fullName.trim() || !profileData.email.trim()) {
      triggerAlert('error', 'Please fill in both full name and email address.');
      return;
    }

    setSavingProfile(true);
    try {
      const response = await API.put('/auth/profile', {
        fullName: profileData.fullName.trim(),
        email: profileData.email.trim(),
      });

      if (response.data && response.data.data) {
        updateUser(response.data.data);
      } else {
        await refreshUser();
      }

      triggerAlert('success', 'Profile information updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      triggerAlert('error', error.response?.data?.message || 'Failed to update profile details.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Password Change Submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      triggerAlert('error', 'Please enter your current password.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      triggerAlert('error', 'New password must be at least 6 characters.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      triggerAlert('error', 'New password and confirmation do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      await API.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      triggerAlert('success', 'Password updated successfully! Please use your new password next time.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Password change error:', error);
      triggerAlert('error', error.response?.data?.message || 'Failed to update password. Verify your current password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in duration-500 pb-16">

      {/* Toast Alert Banner */}
      {alert && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold animate-in slide-in-from-top-4 duration-300 ${alert.type === 'success'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-500/10'
          : 'bg-red-50 text-red-800 border-red-200 shadow-red-500/10'
          }`}>
          {alert.type === 'success' ? <FaCheck className="text-emerald-600" /> : <FaCircleExclamation className="text-red-600" />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Account Settings</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Manage your personal details, email address, and account security.</p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Banner */}
        <div className="h-24 sm:h-32 bg-slate-100 relative"></div>

        {/* Profile Info Bar */}
        <div className="px-4 sm:px-8 pb-5 sm:pb-6 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">

          <div className="flex items-end gap-3.5 sm:gap-4">
            <div className="relative shrink-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-purple-600 text-white flex items-center justify-center font-extrabold text-xl sm:text-2xl shadow-lg ring-4 ring-white">
                {getInitials(user?.fullName || profileData.fullName)}
              </div>
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <div className="mb-0.5 sm:mb-1 min-w-0">
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-slate-900 leading-tight truncate">
                    {user?.fullName || 'Team Member'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
                    <FaEnvelope className="text-slate-400 shrink-0" />
                    <span className="truncate">{user?.email || 'No email associated'}</span>
                  </p>
                </div>

                <span className={`w-fit inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-bold border ${getRoleBadgeStyle(user?.role)}`}>
                  <FaShieldHalved className="text-[10px]" />
                  {formatRole(user?.role)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-100 self-start sm:self-auto">
            <FaCalendarDays className="text-slate-400 shrink-0" />
            <span>Member since: <strong>{memberSince}</strong></span>
          </div>

        </div>

      </div>

      {/* Main Form Sections (2 Columns on large screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

        {/* Left 2 Columns: Personal Details & Password */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">

          {/* Card 1: Personal Details */}
          <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-5 sm:space-y-6">

            <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-slate-100">
              <div className="p-2 sm:p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                <FaUser className="text-base sm:text-lg" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900">Personal Information</h4>
                <p className="text-xs text-slate-400">Update your name and communication email address</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4 sm:space-y-5">

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaUser className="text-sm" />
                  </div>
                  <input
                    type="text"
                    required
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaEnvelope className="text-sm" />
                  </div>
                  <input
                    type="email"
                    required
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    placeholder="Enter your email address"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-orange-600/20 disabled:opacity-50 cursor-pointer min-h-[44px]"
                >
                  <FaFloppyDisk className="text-sm" />
                  <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>

            </form>

          </div>

          {/* Card 2: Security & Password */}
          <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-5 sm:space-y-6">

            <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-slate-100">
              <div className="p-2 sm:p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <FaLock className="text-base sm:text-lg" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900">Security & Password</h4>
                <p className="text-xs text-slate-400">Change your password to keep your workforce account secure</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-5">

              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaKey className="text-sm" />
                  </div>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaLock className="text-sm" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
                <span className="text-[11px] text-slate-400">Must be at least 6 characters</span>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FaLock className="text-sm" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 cursor-pointer min-h-[44px]"
                >
                  <FaKey className="text-sm" />
                  <span>{savingPassword ? 'Updating Password...' : 'Update Password'}</span>
                </button>
              </div>

            </form>

          </div>

        </div>

        {/* Right 1 Column: Account Permissions & Info */}
        <div className="space-y-5 sm:space-y-6">

          {/* Permissions Overview Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-4">

            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <FaShieldHalved className="text-orange-600 text-lg" />
              <h4 className="text-base font-bold text-slate-900">Your Permissions</h4>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Your account is currently configured with <strong>{formatRole(user?.role)}</strong> privileges.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <FaCircleCheck className="text-emerald-500 mt-0.5 shrink-0" />
                <span>View real-time church overview metrics</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <FaCircleCheck className="text-emerald-500 mt-0.5 shrink-0" />
                <span>Access first timers and guest submissions list</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <FaCircleCheck className="text-emerald-500 mt-0.5 shrink-0" />
                <span>Browse full team workforce directory</span>
              </div>

              {user?.role === 'admin' || user?.role === 'super_admin' ? (
                <>
                  <div className="flex items-start gap-2.5 text-xs text-purple-700 font-semibold">
                    <FaCircleCheck className="text-purple-600 mt-0.5 shrink-0" />
                    <span>Manage user roles and remove accounts</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-purple-700 font-semibold">
                    <FaCircleCheck className="text-purple-600 mt-0.5 shrink-0" />
                    <span>Export submissions data (CSV)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-purple-700 font-semibold">
                    <FaCircleCheck className="text-purple-600 mt-0.5 shrink-0" />
                    <span>Add new workers and ministers</span>
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-slate-400 italic pt-2">
                  Need administrative privileges? Contact a senior church administrator.
                </p>
              )}
            </div>

          </div>

          {/* System Info Box */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 text-xs space-y-3 text-slate-500">
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <FaIdCard className="text-slate-400 text-sm" />
              <span>Session Details</span>
            </div>
            <div className="space-y-1.5 font-mono text-[11px]">
              <p>User ID: <span className="text-slate-800 break-all">{user?.id || 'Active'}</span></p>
              <p>Status: <span className="text-emerald-600 font-sans font-bold">Authenticated</span></p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;
