import { useState } from 'react'
import { FaUser, FaGraduationCap, FaCheck, FaChurch, FaHandsPraying, FaCopy } from 'react-icons/fa6'

const SubmissionModal = ({ data, onClose }) => {

    const [copiedField, setCopiedField] = useState("");

    const copyToClipboard = (text, fieldName) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName); // Mark this field as "copied"
        setTimeout(() => setCopiedField(""), 2000); // Reset after 2 seconds
    };


    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

            <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
                {/* <button
                    onClick={onClose}
                    className="absolute top-4 right-4 cursor-pointer text-white hover:text-orange-600"
                >
                    <FaX className='w-4 h-4' />
                </button> */}

                {/* 1. Profile Header Section */}
                <div className='bg-gradient-to-r from-gray-800 to-gray-900 p-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-8'>
                   <div className='flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 '>
                                        <div className='w-24 h-24 flex justify-center items-center rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20'>
                        <FaUser className='w-12 h-12 text-orange-200' />
                    </div>
                    <div className='text-center md:text-left'>
                        <div className='flex flex-row items-start space-x-2'>
                             <h1 className='text-lg md:text-3xl font-bold text-white'>{data.fullName}</h1>
                              {/* <span className='px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold uppercase tracking-wider border border-orange-500/30'>Followed</span> */}
                        </div>
                       
                        <div className='flex flex-wrap justify-center md:justify-start gap-2 mt-2'>
                            <span className='px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold uppercase tracking-wider border border-green-500/30'>
                                {data.status}
                            </span>
                            {data.status === 'Student' ? (
                                <span className='px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-500/30'>
                                    {data.studentLevel}
                                </span>) : null
                            }


                        </div>
                    </div>
                   </div>

                   {/* <form action="POST">
                    <button type="submit" className='bg-orange-500 hover:bg-orange-600 text-white backdrop-blur-sm px-6 py-2 rounded-full cursor-pointer'>Mark as Followed</button>
                   </form> */}

                </div> 

                <div className='p-8 space-y-10 bg-gray-50/50'>

                    {/* 2. Personal Information Grid */}
                    <section>
                        <div className='flex items-center space-x-2 mb-6 border-b border-gray-200 pb-2'>
                            <FaUser className='text-orange-600' />
                            <h2 className='text-sm font-bold text-gray-400 uppercase tracking-widest'>Personal Details</h2>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            <div>
                                <span className='text-xs text-gray-400 font-semibold'>Gender</span>
                                <p className='text-gray-900 font-semibold'>{data.gender}</p>
                            </div>
                            <div>
                                <span className='text-xs text-gray-400 font-semibold'>Date of Birth</span>
                                <p className='text-gray-900 font-semibold'>{data.dateOfBirth}</p>
                            </div>
                            <div >

                                <span className='text-xs text-gray-400 font-semibold'>Phone Number</span>
                                <div className='flex items-start space-x-2'>
                                    <p className='text-gray-900 font-semibold'>{data.phoneNumber}</p>
                                    <button onClick={() => copyToClipboard(data.phoneNumber, 'phoneNumber')}>
                                        {copiedField === 'phoneNumber' ? <FaCheck className=" cursor-pointer text-green-500" /> : <FaCopy className=" cursor-pointer text-orange-400" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <span className='text-xs text-gray-400 font-semibold'>Email Address</span>
                                <p className='text-gray-900 font-semibold'>{data.email}</p>
                            </div>
                            <div>
                                <span className='text-xs text-gray-400 font-semibold'>Home Address</span>
                                <p className='text-gray-900 font-semibold'>{data.residenceAddress}</p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Education/Occupation Section */}
                    <section className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
                        <div className='flex items-center space-x-2 mb-6'>
                            <FaGraduationCap className='text-orange-600 text-xl' />
                            <h2 className='text-sm font-bold text-gray-400 uppercase tracking-widest'>Occupation & Education</h2>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12'>
                            {data.status === "Student" ? (
                                <>
                                    <div>
                                        <span className='text-xs text-gray-400 font-semibold uppercase tracking-wider'>Institution</span>
                                        <p className='text-gray-900 font-semibold'>{data.studentInstitution}</p>
                                    </div>
                                    <div>
                                        <span className='text-xs text-gray-400 font-semibold uppercase tracking-wider'>Faculty</span>
                                        <p className='text-gray-900 font-semibold'>{data.studentFaculty}</p>
                                    </div>
                                    <div>
                                        <span className='text-xs text-gray-400 font-semibold uppercase tracking-wider'>Department</span>
                                        <p className='text-gray-900 font-semibold'>{data.studentDepartment}</p>
                                    </div>
                                    <div>
                                        <span className='text-xs text-gray-400 font-semibold uppercase tracking-wider'>Academic Level</span>
                                        <p className='text-gray-900 font-semibold'>{data.studentLevel}</p>
                                    </div>
                                </>
                            ) : data.status === "Professional" ? (
                                <>
                                    <div>
                                        <span className='text-xs text-gray-400 font-semibold uppercase tracking-wider'>Organization</span>
                                        <p className='text-gray-900 font-semibold'>{data.professionalOrganization}</p>
                                    </div>
                                    <div>
                                        <span className='text-xs text-gray-400 font-semibold uppercase tracking-wider'>Occupational Field</span>
                                        <p className='text-gray-900 font-semibold'>{data.professionalOccupation}</p>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <span className='text-xs text-gray-400 font-semibold uppercase tracking-wider'>Occupation</span>
                                    <p className='text-gray-900 font-semibold'>{data.otherStatus || '---'}</p>
                                </div>
                            )}
                        </div>

                    </section>

                    {/* 4. Church Experience & Outreach */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <section className='space-y-4'>
                            <div className='flex items-center space-x-2'>
                                <FaChurch className='text-orange-600' />
                                <h2 className='text-sm font-bold text-gray-400 uppercase tracking-widest'>About Church</h2>
                            </div>
                            <div className='bg-blue-50 p-5 rounded-xl border border-blue-100'>
                                <h4 className='text-xs font-bold text-blue-400 uppercase mb-1'>Discovery Source</h4>
                                <p className='text-gray-800 font-medium mb-4'>{data.howDidYouHear}</p>

                                <h4 className='text-xs font-bold text-blue-400 uppercase mb-1'>Worship Experience</h4>
                                <p className='text-gray-700 italic'>“{data.experienceToday}”</p>
                            </div>
                        </section>

                        <section className='space-y-4'>
                            <div className='flex items-center space-x-2'>
                                <FaHandsPraying className='text-orange-600' />
                                <h2 className='text-sm font-bold text-gray-400 uppercase tracking-widest'>Contact & Requests</h2>
                            </div>
                            <div className='bg-white p-5 rounded-xl border border-gray-200 space-y-4 shadow-sm'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-gray-500 text-sm'>Best Time</span>
                                    <span className='text-gray-800 font-bold'>{data.bestContactTime}</span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-gray-500 text-sm'>Method</span>
                                    <span className='text-green-600 font-bold flex items-center gap-1'>
                                        {data.preferredContactMethod}
                                    </span>
                                </div>
                                <div className='pt-2 border-t border-gray-100'>
                                    <h4 className='text-xs font-bold text-gray-400 uppercase mb-1'>Prayer Request</h4>
                                    <p className='text-gray-800 font-semibold'>{data.prayerRequests}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Small helper component to keep code clean
const DetailBlock = ({ label, value, isFullWidth = false }) => (
    <div className={isFullWidth ? 'md:col-span-2' : ''}>
        <h3 className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1'>{label}</h3>
        <p className='text-gray-700 font-medium'>{value}</p>
    </div>
)

export default SubmissionModal
