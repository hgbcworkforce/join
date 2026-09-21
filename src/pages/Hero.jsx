import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "./../api/axios";
import { z } from "zod";
import SucessVideoModal from "../components/SucessVideoModal";
import herobg from "../assets/hero.jpeg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Hero = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const Navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    residenceAddress: "",
    status: "",
    studentLevel: "",
    studentFaculty: "",
    studentDepartment: "",
    studentInstitution: "",
    professionalOrganization: "",
    professionalOccupation: "",
    otherStatus: "",
    howDidYouHear: "",
    experienceToday: "",
    bestContactTime: "",
    preferredContactMethod: "",
    prayerRequests: "",
  });

  // --- FORM SCHEMA & LOGIC (UNALTERED) ---
  const formSchema = z
    .object({
      fullName: z.string().min(1, "Full name is required"),
      gender: z.enum(["male", "female"], {
        required_error: "Gender is required",
      }),
      dateOfBirth: z.string().min(1, "Date of birth is required"),
      phoneNumber: z.string().min(7, "Phone number is too short"),
      email: z.string().email("Invalid email address"),
      residenceAddress: z.string().min(1, "Residence address is required"),
      status: z.enum(["student", "professional", "other"], {
        required_error: "Status is required",
      }),
      howDidYouHear: z
        .string()
        .min(1, "Please let us know how you heard about us"),
      studentLevel: z.string().optional(),
      studentFaculty: z.string().optional(),
      studentDepartment: z.string().optional(),
      studentInstitution: z.string().optional(),
      professionalOrganization: z.string().optional(),
      professionalOccupation: z.string().optional(),
      otherStatus: z.string().optional(),
      experienceToday: z.string().optional(),
      bestContactTime: z.string().optional(),
      preferredContactMethod: z.string().optional(),
      prayerRequests: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.status === "student") {
        if (!data.studentInstitution?.trim())
          ctx.addIssue({
            code: "custom",
            path: ["studentInstitution"],
            message: "Institution is required",
          });
        if (!data.studentFaculty?.trim())
          ctx.addIssue({
            code: "custom",
            path: ["studentFaculty"],
            message: "Faculty is required",
          });
        if (!data.studentDepartment?.trim())
          ctx.addIssue({
            code: "custom",
            path: ["studentDepartment"],
            message: "Department is required",
          });
        if (!data.studentLevel?.trim())
          ctx.addIssue({
            code: "custom",
            path: ["studentLevel"],
            message: "Level is required",
          });
      }
      if (data.status === "professional") {
        if (!data.professionalOccupation?.trim())
          ctx.addIssue({
            code: "custom",
            path: ["professionalOccupation"],
            message: "Occupation is required",
          });
      }
      if (data.status === "other" && !data.otherStatus?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["otherStatus"],
          message: "Please specify your status",
        });
      }
    });

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const newFieldErrors = {};
      result.error.issues.forEach((err) => {
        const key = err.path?.[0] || "form";
        newFieldErrors[key] = err.message;
      });
      setFieldErrors(newFieldErrors);

      // Auto scroll to first error field
      const firstErrorField = Object.keys(newFieldErrors)[0];
      const element = document.getElementsByName(firstErrorField)[0] || document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    try {
      await API.post("/first-timers", formData);
      setIsSubmitted(true);
      setFormData({
        fullName: "",
        gender: "",
        dateOfBirth: "",
        phoneNumber: "",
        email: "",
        residenceAddress: "",
        status: "",
        studentLevel: "",
        studentFaculty: "",
        studentDepartment: "",
        studentInstitution: "",
        professionalOrganization: "",
        professionalOccupation: "",
        otherStatus: "",
        howDidYouHear: "",
        experienceToday: "",
        bestContactTime: "",
        preferredContactMethod: "",
        prayerRequests: "",
      });
      setFieldErrors({});
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Failed to submit. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- REFINED UI COMPONENTS ---
  const inputStyle = (hasError) =>
    `w-full p-4 bg-gray-50 border ${hasError ? "border-red-500" : "border-gray-200"} rounded-xl focus:ring-2 focus:ring-orange-600/10 focus:border-orange-600 outline-none transition-all duration-200 placeholder:text-gray-400`;
  const labelStyle =
    "text-[11px] font-black uppercase tracking-widest text-gray-500 mb-2 block ml-1";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Intro Overlay */}
      {showIntro && (
        <div className="fixed inset-0 bg-white flex flex-col justify-center items-center z-50 p-6 text-center">
          <h1 className="fade-text opacity-0 text-3xl md:text-6xl font-normal mb-4">
            Welcome to The{" "}
            <span className="bg-[rgb(234,57,8)] text-white py-1 px-5 rounded-md">
              City of Refuge
            </span>
          </h1>
          <div className="relative flex flex-col items-center">
            <span className="underbar opacity-0 w-72 md:w-96  lg:w-[31.25rem] h-5 inline-block bg-[rgb(234,57,8)] absolute top-[54%] left-35% transform -translate-x-[35%]"></span>
            <p className="fade-text delay text-xl md:text-4xl opacity-0 font-normal">
              We are so glad you're here!
            </p>
          </div>{" "}
        </div>
      )}

      <main
        className={`${showIntro ? "hidden" : "block"} transition-all duration-700`}
      >
        <SucessVideoModal
          isOpen={isSubmitted}
          onClose={() => setIsSubmitted(false)}
        />

        {/* Hero Section */}
        <section
          className="relative h-[80vh] flex flex-col items-center justify-center text-white text-center px-6 bg-cover bg-center"
          style={{ backgroundImage: `url(${herobg})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
          {/* Navbar Wrapper */}
          <div className="relative z-30 w-full">
            <Navbar />
          </div>

          <div className="relative z-10 max-w-4xl">
            <span className="inline-block px-5 py-2 text-[10px] tracking-[0.3em] bg-white/10 backdrop-blur-md text-orange-500 font-black rounded-full mb-8 border border-white/20 uppercase">
              First Timers
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 tracking-tighter leading-tight">
              WELCOME TO HGBC
            </h1>
            <p className="max-w-2xl mx-auto text-base md:text-lg font-medium text-gray-200 leading-relaxed opacity-90">
              We're honored to have you join our family today. Please fill out
              the form below so we can stay connected.
            </p>
          </div>
        </section>

        {/* Card Form Container */}
        <div className="max-w-6xl mx-auto mt-20 md:-mt-24 relative z-20 px-4 pb-20 ">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
              <div className="flex justify-between items-center border-b border-gray-100 pb-5 mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">
                  Registration Check-in
                </h2>
                <div>
                  <span className="text-orange-600 font-black text-[10px] tracking-widest uppercase bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                    Direct Check-in
                  </span>
                </div>
              </div>

              {/* Main Grid: Left column (Personal) & Right column (Occupational & Connection) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Column 1: Personal Information */}
                <div className="space-y-6 bg-slate-50/40 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-orange-600 border-b border-slate-100 pb-2">
                    1. Personal Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className={labelStyle}>Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className={inputStyle(fieldErrors.fullName)}
                      />
                      {fieldErrors.fullName && (
                        <p className="text-red-600 text-xs mt-2 font-medium">
                          {fieldErrors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelStyle}>Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={inputStyle(fieldErrors.gender)}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {fieldErrors.gender && (
                        <p className="text-red-600 text-xs mt-2 font-medium">
                          {fieldErrors.gender}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelStyle}>Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={inputStyle(fieldErrors.dateOfBirth)}
                      />
                      {fieldErrors.dateOfBirth && (
                        <p className="text-red-600 text-xs mt-2 font-medium">
                          {fieldErrors.dateOfBirth}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelStyle}>Phone (WhatsApp preferable)</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="0800 000 0000"
                        className={inputStyle(fieldErrors.phoneNumber)}
                      />
                      {fieldErrors.phoneNumber && (
                        <p className="text-red-600 text-xs mt-2 font-medium">
                          {fieldErrors.phoneNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelStyle}>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={inputStyle(fieldErrors.email)}
                      />
                      {fieldErrors.email && (
                        <p className="text-red-600 text-xs mt-2 font-medium">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelStyle}>Residence Address</label>
                      <input
                        type="text"
                        name="residenceAddress"
                        value={formData.residenceAddress}
                        onChange={handleChange}
                        placeholder="Street address, City"
                        className={inputStyle(fieldErrors.residenceAddress)}
                      />
                      {fieldErrors.residenceAddress && (
                        <p className="text-red-600 text-xs mt-2 font-medium">
                          {fieldErrors.residenceAddress}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column 2: Occupational & Connection Details */}
                <div className="space-y-6 flex flex-col justify-between">
                  {/* Status Selection Box */}
                  <div className="bg-slate-50/40 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-orange-600 border-b border-slate-100 pb-2">
                      2. Occupational Status
                    </h3>
                    
                    <div>
                      <label className={labelStyle}>Current Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={inputStyle(fieldErrors.status)}
                      >
                        <option value="">Select Status</option>
                        <option value="student">Student</option>
                        <option value="professional">Professional</option>
                        <option value="other">Other</option>
                      </select>
                      {fieldErrors.status && (
                        <p className="text-red-600 text-xs mt-2 font-medium">
                          {fieldErrors.status}
                        </p>
                      )}
                    </div>

                    {/* Student collapsible inputs */}
                    {formData.status === "student" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="md:col-span-2">
                          <label className={labelStyle}>Institution</label>
                          <input
                            name="studentInstitution"
                            value={formData.studentInstitution}
                            onChange={handleChange}
                            placeholder="University Name"
                            className={inputStyle(fieldErrors.studentInstitution)}
                          />
                          {fieldErrors.studentInstitution && (
                            <p className="text-red-600 text-xs mt-2 font-medium">
                              {fieldErrors.studentInstitution}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelStyle}>Faculty</label>
                          <input
                            name="studentFaculty"
                            value={formData.studentFaculty}
                            onChange={handleChange}
                            placeholder="e.g. Science"
                            className={inputStyle(fieldErrors.studentFaculty)}
                          />
                          {fieldErrors.studentFaculty && (
                            <p className="text-red-600 text-xs mt-2 font-medium">
                              {fieldErrors.studentFaculty}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelStyle}>Department</label>
                          <input
                            name="studentDepartment"
                            value={formData.studentDepartment}
                            onChange={handleChange}
                            placeholder="e.g. Computer Science"
                            className={inputStyle(fieldErrors.studentDepartment)}
                          />
                          {fieldErrors.studentDepartment && (
                            <p className="text-red-600 text-xs mt-2 font-medium">
                              {fieldErrors.studentDepartment}
                            </p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className={labelStyle}>Level</label>
                          <input
                            name="studentLevel"
                            value={formData.studentLevel}
                            onChange={handleChange}
                            placeholder="e.g. 400 Level"
                            className={inputStyle(fieldErrors.studentLevel)}
                          />
                          {fieldErrors.studentLevel && (
                            <p className="text-red-600 text-xs mt-2 font-medium">
                              {fieldErrors.studentLevel}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Professional collapsible inputs */}
                    {formData.status === "professional" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div>
                          <label className={labelStyle}>Organization / Company</label>
                          <input
                            name="professionalOrganization"
                            value={formData.professionalOrganization}
                            onChange={handleChange}
                            placeholder="Workplace Name"
                            className={inputStyle(fieldErrors.professionalOrganization)}
                          />
                        </div>
                        <div>
                          <label className={labelStyle}>Job Title / Industry</label>
                          <input
                            name="professionalOccupation"
                            value={formData.professionalOccupation}
                            onChange={handleChange}
                            placeholder="e.g. Software Engineer"
                            className={inputStyle(fieldErrors.professionalOccupation)}
                          />
                          {fieldErrors.professionalOccupation && (
                            <p className="text-red-600 text-xs mt-2 font-medium">
                              {fieldErrors.professionalOccupation}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Other status collapsible input */}
                    {formData.status === "other" && (
                      <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className={labelStyle}>Please Specify</label>
                        <input
                          name="otherStatus"
                          value={formData.otherStatus}
                          onChange={handleChange}
                          placeholder="Tell us more..."
                          className={inputStyle(fieldErrors.otherStatus)}
                        />
                        {fieldErrors.otherStatus && (
                          <p className="text-red-600 text-xs mt-2 font-medium">
                            {fieldErrors.otherStatus}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Connect and Discovery */}
                  <div className="bg-slate-50/40 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-orange-600 border-b border-slate-100 pb-2">
                      3. Connection & Preferences
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className={labelStyle}>How did you hear about us?</label>
                        <select
                          name="howDidYouHear"
                          value={formData.howDidYouHear}
                          onChange={handleChange}
                          className={inputStyle(fieldErrors.howDidYouHear)}
                        >
                          <option value="">Select Option</option>
                          <option value="social media">Social Media</option>
                          <option value="friend">A Friend</option>
                          <option value="family">A Family Member</option>
                          <option value="search">Online Search</option>
                          <option value="billboard">Billboard/Poster</option>
                        </select>
                        {fieldErrors.howDidYouHear && (
                          <p className="text-red-600 text-xs mt-2 font-medium">
                            {fieldErrors.howDidYouHear}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className={labelStyle}>Best time to reach you</label>
                        <select
                          name="bestContactTime"
                          value={formData.bestContactTime}
                          onChange={handleChange}
                          className={inputStyle()}
                        >
                          <option value="">Select Time</option>
                          <option value="morning">Morning</option>
                          <option value="afternoon">Afternoon</option>
                          <option value="evening">Evening</option>
                        </select>
                      </div>

                      <div>
                        <label className={labelStyle}>Preferred Contact Method</label>
                        <select
                          name="preferredContactMethod"
                          value={formData.preferredContactMethod}
                          onChange={handleChange}
                          className={inputStyle()}
                        >
                          <option value="">Select Method</option>
                          <option value="phone">Phone Call</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="email">Email</option>
                          <option value="textMessage">SMS</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Full-width Row: Experience & Prayer Requests */}
              <div className="bg-slate-50/40 p-6 rounded-2xl border border-slate-100 space-y-6 mt-6">
                <h3 className="text-xs font-black uppercase tracking-wider text-orange-600 border-b border-slate-100 pb-2">
                  4. Experience & Requests
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>Tell us about your experience today</label>
                    <textarea
                      name="experienceToday"
                      value={formData.experienceToday}
                      onChange={handleChange}
                      rows="4"
                      placeholder="We'd love to hear your thoughts! (Optional)"
                      className={inputStyle()}
                    />
                  </div>

                  <div>
                    <label className={labelStyle}>Is there anything we can pray for you about?</label>
                    <textarea
                      name="prayerRequests"
                      value={formData.prayerRequests}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Your prayer request... (Optional)"
                      className={inputStyle()}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto px-12 py-4 bg-orange-600 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isLoading ? "Submitting..." : "Complete Registration"}
                </button>
              </div>

              {errorMessage && (
                <p className="mt-6 text-center text-red-600 text-sm font-semibold p-4 bg-red-50 rounded-lg">
                  {errorMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Hero;
