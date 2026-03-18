import { useState } from 'react';
import { FaUser, FaGraduationCap, FaCheck, FaChurch, FaHandsPraying, FaCopy, FaXmark, FaEnvelope, FaPhone, FaLocationDot, FaBriefcase } from 'react-icons/fa6';

const SubmissionModal = ({ data, onClose }) => {
    const [copiedField, setCopiedField] = useState("");

    const copyToClipboard = (text, fieldName) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(""), 2000);
    };

    if (!data) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-2 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 cursor-pointer rounded-full transition-all"
                >
                    <FaXmark className="w-5 h-5" />
                </button>

                {/* Header: Identity & Status */}
                <div className="p-8 pb-4 flex flex-col md:flex-row gap-6 border-b border-slate-50">
                    <div className="w-20 h-20 shrink-0 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-100">
                        {data.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                        <div className='flex flex-row space-x-1 items-center'>
                                 <h1 className="text-2xl font-extrabold text-slate-900">{data.fullName}</h1>
                                 <span className="text-sm text-green-800 bg-green-200 px-3 rounded-full">Contacted</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                                {data.status}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                {data.gender}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-10">
                    
                    {/* SECTION 1: GENERIC PERSONAL DETAILS (For Everyone) */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                            <FaUser className="text-sm" />
                            <h2 className="text-[11px] font-black uppercase tracking-widest">General Information</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <DetailItem label="Date of Birth" value={data.dateOfBirth} />
                            <DetailItem label="Gender" value={data.gender} />
                            <DetailItem label="Contact Method" value={data.preferredContactMethod} />
                            <DetailItem label="Best Time" value={data.bestContactTime} />
                        </div>
                        
                        {/* Contact Bar */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                           />
                        </div>
                    </section>

                    {/* SECTION 2: CONDITIONAL DETAILS (Based on Status) */}
                    <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-6">
                            {data.status === 'Student' ? <FaGraduationCap className="text-indigo-600" /> : <FaBriefcase className="text-indigo-600" />}
                            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                                {data.status} specific Details
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.status === 'Student' ? (
                                <>
                                    <DetailItem label="Institution" value={data.studentInstitution} />
                                    <DetailItem label="Faculty" value={data.studentFaculty} />
                                    <DetailItem label="Department" value={data.studentDepartment} />
                                    <DetailItem label="Academic Level" value={data.studentLevel} />
                                </>
                            ) : data.status === 'Professional' ? (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-slate-400">
                                <FaChurch />
                                <h2 className="text-[11px] font-black uppercase tracking-widest">Church Experience</h2>
                            </div>
                            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
                                <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2">How they heard</p>
                                <p className="text-sm text-slate-800 font-medium mb-4">{data.howDidYouHear}</p>
                                <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2">Today's Experience</p>
                                <p className="text-sm italic text-slate-600 leading-relaxed">"{data.experienceToday}"</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-slate-400">
                                <FaHandsPraying />
                                <h2 className="text-[11px] font-black uppercase tracking-widest">Requests</h2>
                            </div>
                            <div className="p-5 rounded-2xl border border-slate-200 h-full">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Prayer Requests</p>
                                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                    {data.prayerRequests || "No prayer requests provided."}
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">
                        Close
                    </button>
                    <button className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                        Mark as Contacted
                    </button>
                </div>
            </div>
        </div>
    );
};

/* Helper Components to keep the main JSX clean */
const DetailItem = ({ label, value }) => (
    <div>
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{label}</h4>
        <p className="text-sm font-bold text-slate-700">{value || '---'}</p>
    </div>
);

const ContactCard = ({ icon, label, value, onCopy, isCopied }) => (
    <div className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
        <div className="text-indigo-500 bg-indigo-50 p-2 rounded-lg">{icon}</div>
        <div className="flex-1 min-w-0">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</h4>
            <p className="text-sm font-bold text-slate-700 truncate">{value}</p>
        </div>
        {onCopy && (
            <button onClick={onCopy} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                {isCopied ? <FaCheck className="text-emerald-500" /> : <FaCopy />}
            </button>
        )}
    </div>
);

export default SubmissionModal;