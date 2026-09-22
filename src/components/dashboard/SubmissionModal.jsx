import { useState } from 'react';
import { 
  FaUser, 
  FaGraduationCap, 
  FaCheck, 
  FaChurch, 
  FaHandsPraying, 
  FaCopy, 
  FaXmark, 
  FaEnvelope, 
  FaPhone, 
  FaBriefcase,
  FaTrashCan,
  FaClock,
  FaCircleCheck,
  FaShieldHalved
} from 'react-icons/fa6';

const SubmissionModal = ({ data, onClose, isAdmin, onToggleFollowed, onDelete }) => {
    const [copiedField, setCopiedField] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const copyToClipboard = (text, fieldName) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(""), 2000);
    };

    if (!data) return null;

    const statusLower = data.status?.toLowerCase();
    const isFollowed = data.followUpStatus?.toLowerCase() === 'contacted' || data.followUpStatus?.toLowerCase() === 'followed' || data.followUpStatus?.toLowerCase() === 'integrated';

    const handleStatusClick = async () => {
        if (!onToggleFollowed || updatingStatus) return;
        setUpdatingStatus(true);
        await onToggleFollowed(data);
        setUpdatingStatus(false);
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-300"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100 flex flex-col"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 cursor-pointer rounded-full transition-all"
                    aria-label="Close details"
                >
                    <FaXmark className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Header: Identity & Status */}
                <div className="p-5 sm:p-8 pb-4 flex flex-col sm:flex-row gap-4 sm:gap-6 border-b border-slate-100">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-orange-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg shadow-orange-100">
                        {data.fullName?.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 pr-8 sm:pr-0">
                        <div className='flex flex-row items-center flex-wrap gap-2'>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">{data.fullName}</h1>
                            <span className="text-xs font-bold text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200">First Timer</span>
                            
                            {/* Follow-up Status Badge */}
                            {isFollowed ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                    <FaCircleCheck className="text-emerald-600 text-xs" />
                                    Followed Up
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                                    <FaClock className="text-amber-600 text-xs" />
                                    Follow-up Pending
                                </span>
                            )}
                        </div>

                        <div className="flex gap-2 mt-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                                {data.status}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                {data.gender}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-5 sm:p-8 space-y-6 sm:space-y-8 flex-1">
                    
                    {/* SECTION 1: GENERIC PERSONAL DETAILS (For Everyone) */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 sm:mb-4 text-slate-400">
                            <FaUser className="text-sm" />
                            <h2 className="text-[11px] font-black uppercase tracking-widest">General Information</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                            <DetailItem label="Date of Birth" value={data.dateOfBirth} />
                            <DetailItem label="Gender" value={data.gender} />
                            <DetailItem label="Contact Method" value={data.preferredContactMethod} />
                            <DetailItem label="Best Time" value={data.bestContactTime} />
                        </div>
                        
                        {/* Contact Bar */}
                        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                           <ContactCard 
                             icon={<FaPhone />} 
                             label="Phone" 
                             value={data.phoneNumber} 
                             onCopy={() => copyToClipboard(data.phoneNumber, 'phone')}
                             isCopied={copiedField === 'phone'}
                           />
                           <ContactCard 
                             icon={<FaEnvelope />} 
                             label="Email" 
                             value={data.email} 
                             onCopy={() => copyToClipboard(data.email, 'email')}
                             isCopied={copiedField === 'email'}
                           />
                        </div>
                    </section>

                    {/* SECTION 2: CONDITIONAL DETAILS (Based on Status) */}
                    <section className="bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            {statusLower === 'student' ? <FaGraduationCap className="text-orange-600" /> : <FaBriefcase className="text-orange-600" />}
                            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                                {data.status} specific Details
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {statusLower === 'student' ? (
                                <>
                                    <DetailItem label="Institution" value={data.studentInstitution} />
                                    <DetailItem label="Faculty" value={data.studentFaculty} />
                                    <DetailItem label="Department" value={data.studentDepartment} />
                                    <DetailItem label="Academic Level" value={data.studentLevel} />
                                </>
                            ) : statusLower === 'professional' ? (
                                <>
                                    <DetailItem label="Organization" value={data.professionalOrganization} />
                                    <DetailItem label="Occupation Field" value={data.professionalOccupation} />
                                </>
                            ) : (
                                <DetailItem label="Specific Status/Role" value={data.otherStatus || 'N/A'} />
                            )}
                        </div>
                    </section>

                    {/* SECTION 3: GENERIC CHURCH & FEEDBACK (For Everyone) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                        <section className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-400">
                                <FaChurch />
                                <h2 className="text-[11px] font-black uppercase tracking-widest">Church Experience</h2>
                            </div>
                            <div className="p-4 sm:p-5 rounded-2xl bg-orange-50/50 border border-orange-100">
                                <p className="text-[10px] font-bold text-orange-600 uppercase mb-1.5">How they heard</p>
                                <p className="text-sm text-slate-800 font-medium mb-3">{data.howDidYouHear || '---'}</p>
                                <p className="text-[10px] font-bold text-orange-600 uppercase mb-1.5">Today's Experience</p>
                                <p className="text-sm italic text-slate-600 leading-relaxed">"{data.experienceToday || 'N/A'}"</p>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-400">
                                <FaHandsPraying />
                                <h2 className="text-[11px] font-black uppercase tracking-widest">Requests</h2>
                            </div>
                            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 h-full bg-white">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Prayer Requests</p>
                                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                    {data.prayerRequests || "No prayer requests provided."}
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Actions (Responsive Buttons) */}
                <div className="p-4 sm:p-6 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    
                    {/* Admin Action Buttons (Mark as Followed / Delete) */}
                    {isAdmin ? (
                        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                            <button
                                onClick={handleStatusClick}
                                disabled={updatingStatus}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer min-h-[40px] ${
                                    isFollowed
                                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'
                                }`}
                            >
                                <FaCircleCheck className="text-sm" />
                                <span>{isFollowed ? 'Mark as Pending' : 'Mark as Followed'}</span>
                            </button>

                            <button
                                onClick={() => {
                                    onClose();
                                    if (onDelete) onDelete(data);
                                }}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-all cursor-pointer min-h-[40px]"
                            >
                                <FaTrashCan className="text-sm" />
                                <span>Delete</span>
                            </button>
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400 italic text-center sm:text-left">
                            Read-only guest registration details
                        </div>
                    )}

                    <div className="flex items-center justify-end">
                        <button 
                            onClick={onClose} 
                            className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer min-h-[40px]"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* Helper Components to keep the main JSX clean */
const DetailItem = ({ label, value }) => (
    <div>
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">{label}</h4>
        <p className="text-sm font-bold text-slate-700 break-words">{value || '---'}</p>
    </div>
);

const ContactCard = ({ icon, label, value, onCopy, isCopied }) => (
    <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
        <div className="text-orange-500 bg-orange-50 p-2 rounded-lg shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</h4>
            <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">{value || '---'}</p>
        </div>
        {onCopy && (
            <button onClick={onCopy} className="p-2 text-slate-300 hover:text-orange-600 transition-colors cursor-pointer shrink-0">
                {isCopied ? <FaCheck className="text-emerald-500" /> : <FaCopy />}
            </button>
        )}
    </div>
);

export default SubmissionModal;