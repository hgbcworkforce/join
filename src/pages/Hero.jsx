import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok  } from "react-icons/fa6";
import API from "./../api/axios";
import { z } from "zod";
import SucessVideoModal from "../components/SucessVideoModal";
import { Navigate } from "react-router-dom";

const Hero = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

 const Navigate = useNavigate();

  const totalSteps = 4;

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
  professionalOrganization: '',
  professionalOccupation: '',
  otherStatus: '',
  howDidYouHear: "",
  experienceToday: "",
  bestContactTime: "",
  preferredContactMethod: "",
  prayerRequests: ""
  });


  const formSchema = z
  .object({
    // 1. Always Required Fields
    fullName: z.string().min(1, "Full name is required"),
    gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    phoneNumber: z.string().min(7, "Phone number is too short"),
    email: z.string().email("Invalid email address"),
    residenceAddress: z.string().min(1, "Residence address is required"),
    status: z.enum(["student", "professional", "other"], { 
      required_error: "Status is required" 
    }),
    howDidYouHear: z.string().min(1, "Please let us know how you heard about us"),

    // 2. Conditional Fields (Marked optional here, enforced in superRefine)
    studentLevel: z.string().optional(),
    studentFaculty: z.string().optional(),
    studentDepartment: z.string().optional(),
    studentInstitution: z.string().optional(),
    professionalOrganization: z.string().optional(),
    professionalOccupation: z.string().optional(),
    otherStatus: z.string().optional(),

    // 3. Truly Optional Fields
    experienceToday: z.string().optional(),
    bestContactTime: z.string().optional(),
    preferredContactMethod: z.string().optional(),
    prayerRequests: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Logic for Students
    if (data.status === "student") {
      if (!data.studentInstitution?.trim()) {
        ctx.addIssue({ code: "custom", path: ["studentInstitution"], message: "Institution is required" });
      }
      if (!data.studentFaculty?.trim()) {
        ctx.addIssue({ code: "custom", path: ["studentFaculty"], message: "Faculty is required" });
      }
      if (!data.studentDepartment?.trim()) {
        ctx.addIssue({ code: "custom", path: ["studentDepartment"], message: "Department is required" });
      }
      if (!data.studentLevel?.trim()) {
        ctx.addIssue({ code: "custom", path: ["studentLevel"], message: "Level is required" });
      }
    }

    // Logic for Professionals
    if (data.status === "professional") {
      if (!data.professionalOccupation?.trim()) {
        ctx.addIssue({ code: "custom", path: ["professionalOccupation"], message: "Occupation is required" });
      }
      // Organization is optional based on your initial code, but you can add a check here if needed
    }

    // Logic for "Other" status
    if (data.status === "other" && !data.otherStatus?.trim()) {
      ctx.addIssue({ code: "custom", path: ["otherStatus"], message: "Please specify your status" });
    }
  });





  // 1. Handle Intro Animation
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 8000);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  // 2. Progress Calculation
  const progressWidth = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    // Validate current step fields before moving forward
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => {
      if (!prev) return {};
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const validateStep = (step) => {
    const stepFields = (() => {
      switch (step) {
        case 1:
          return ["fullName", "gender", "dateOfBirth", "phoneNumber", "email", "residenceAddress"];
        case 2: {
          if (formData.status === "student") {
            return ["status", "studentInstitution", "studentFaculty", "studentDepartment", "studentLevel"];
          }
          if (formData.status === "professional") {
            return ["status", "professionalOrganization", "professionalOccupation"];
          }
          return ["status", "otherStatus"]; // other
        }
        case 3:
          return ["howDidYouHear"];
        default:
          return [];
      }
    })();

    const result = formSchema.safeParse(formData);
    if (result.success) {
      // clear errors for this step
      setFieldErrors(prev => {
        const copy = { ...(prev || {}) };
        stepFields.forEach(f => delete copy[f]);
        return copy;
      });
      setErrorMessage("");
      return true;
    }

    const zodErrors = result.error?.issues ?? result.error?.errors ?? [];
    const relevant = zodErrors.filter(err => stepFields.includes(err.path?.[0]));
    if (relevant.length === 0) {
      // no errors for this step
      setFieldErrors(prev => {
        const copy = { ...(prev || {}) };
        stepFields.forEach(f => delete copy[f]);
        return copy;
      });
      setErrorMessage("");
      return true;
    }

    const newFieldErrors = {};
    relevant.forEach(err => {
      const key = err.path?.[0] || "form";
      if (!newFieldErrors[key]) newFieldErrors[key] = err.message || "Invalid value";
    });

    setFieldErrors(prev => ({ ...(prev || {}), ...newFieldErrors }));
    setErrorMessage(Object.values(newFieldErrors).join("; "));
    return false;
  };

// const API_URL = import.meta.env.VITE_API_BASE_URL; 
const API_URL = API.defaults.baseURL; // Using the helper function from api.js

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const zodErrors = result.error?.issues ?? result.error?.errors ?? [];
      const newFieldErrors = {};
      const messages = zodErrors.map((err) => {
        const key = err.path?.length ? err.path[0] : "form";
        if (key && !newFieldErrors[key]) newFieldErrors[key] = err.message;
        const path = err.path?.length ? err.path.join(".") : "form";
        return `${path}: ${err.message}`;
      });
      setFieldErrors(prev => ({ ...(prev || {}), ...newFieldErrors }));
      setErrorMessage(messages.join("; "));
      return;
    }

    setIsLoading(true);

    try {
      await API.post("/first-timers", formData);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        Navigate("/");
      }, 20000);
 
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message || error);
      const serverMessage = error.response?.data?.message || error.response?.data || null;
      setErrorMessage(serverMessage || "Failed to submit. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Intro Animation */}
      {showIntro && (
        <div id="intro-overlay" className="w-full h-full fixed top-0 left-0 bg-white flex flex-col justify-center items-center z-50">
          <div className="intro-content">
            <h1 className="fade-text opacity-0 text-3xl md:text-5xl lg:text-7xl font-normal  mb-4 flex flex-col md:flex-row items-center space-x-0 md:space-x-1 space-y-2 md:space-y-0">
              <span>Welcome to The </span>
              <span className="city-bg bg-[rgb(234,57,8)] text-white py-1 px-5 rounded-md">City of Refuge</span>
            </h1>
            <div className="relative flex flex-col items-center">
                <span className="underbar opacity-0 w-72 md:w-96  lg:w-[31.25rem] h-5 inline-block bg-[rgb(234,57,8)] absolute top-[54%] left-35% transform -translate-x-[35%]"></span>
                <p className="fade-text delay text-xl md:text-4xl opacity-0 font-normal">We are so glad you're here!</p>
            </div>

          </div>
        </div>
      )}

      {/* Main Content */}
      <main id="main-content" className={`${showIntro ? "hidden" : "block"}`}>
                {/* Success Notification - The React Way */}
        <SucessVideoModal isOpen={isSubmitted} onClose={() => setIsSubmitted(false)} />

                {/* Error Notification */}
        {/* {errorMessage && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
            {errorMessage}
          </div>
        )} */}

        <div className="form container max-w-112.5 mx-auto mt-10 p-10 bg-white rounded-lg shadow-lg">

            {/* Progress Bar */}
          <div className="progress-container h-1 bg-gray-200 rounded-xl mb-10">
            <div
              className="progress-bar h-full w-[33%] bg-orange-600 transition-all duration-[500] ease-in-out"
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* <!-- Step 1 --> */}
            {currentStep === 1 && (
              <div className="form-step active" data-step="1">
                <h2 className="text-xl font-semibold mb-5 ">
                  Personal Information
                </h2>
                <div className="my-2">
                  <label  className="text-gray-700 font-normal" htmlFor="name">Full Name</label>
                  {fieldErrors.fullName && (
                    <div className="text-red-600 text-sm mt-1">{fieldErrors.fullName}</div>
                  )}
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    id="name"
                    placeholder="Full Name"
                    className="w-full p-3 my-3 border border-gray-100 rounded-lg transition-all duration-300 focus:border-gray-500 focus:outline-0"
                   onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label  className="text-gray-700 font-normal" htmlFor="gender">Gender</label>
                  {fieldErrors.gender && (
                    <div className="text-red-600 text-sm mt-1">{fieldErrors.gender}</div>
                  )}
                  <select
                    name="gender"
                    value={formData.gender}
                    id="gender"
                    className="text-gray-700 font-normal w-full p-3 my-3 border border-gray-100 rounded-lg transition-all duration-300 focus:border-gray-500 focus:outline-0"
                   onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="my-2">
                  <label  className="text-gray-700 font-normal" htmlFor="age">Date of Birth</label>
                  {fieldErrors.dateOfBirth && (
                    <div className="text-red-600 text-sm mt-1">{fieldErrors.dateOfBirth}</div>
                  )}
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      id="age"
                      className="w-full p-3 my-3 border border-gray-100 rounded-lg transition-all duration-300 focus:border-gray-500 focus:outline-0"
                     onChange={handleChange}
                      required
                    />
                </div>

                <div className="my-2">
                  <label  className="text-gray-700 font-normal" htmlFor="phone">
                    Phone Number (WhatsApp preferable)
                  </label>
                  {fieldErrors.phoneNumber && (
                    <div className="text-red-600 text-sm mt-1">{fieldErrors.phoneNumber}</div>
                  )}
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    id="phoneNumber"
                    placeholder="Phone Number"
                    className="w-full p-3 my-3 border border-gray-100 rounded-lg transition-all duration-300 focus:border-gray-500 focus:outline-0"
                   onChange={handleChange}
                    required
                  />
                </div>

                <div className="my-2">
                  <label  className="text-gray-700 font-normal" htmlFor="email">Email</label>
                  {fieldErrors.email && (
                    <div className="text-red-600 text-sm mt-1">{fieldErrors.email}</div>
                  )}
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    id="email"
                    placeholder="Email Address"
                    className="w-full p-3 my-3 border border-gray-100 rounded-lg transition-all duration-300 focus:border-gray-500 focus:outline-0"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="my-2">
                  <label  className="text-gray-700 font-normal" htmlFor="address">Residence Address</label>
                  {fieldErrors.residenceAddress && (
                    <div className="text-red-600 text-sm mt-1">{fieldErrors.residenceAddress}</div>
                  )}
                  <input
                    type="text"
                    name="residenceAddress"
                    value={formData.residenceAddress}
                    id="residenceAddress"
                    placeholder="Residence Address"
                    className="w-full p-3 my-3 border border-gray-100 rounded-lg transition-all duration-300 focus:border-gray-500 focus:outline-0"
                   onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="next-btn w-full cursor-pointer border-0 bg-orange-600 text-white text-xl py-3 px-6 rounded-md hover:bg-orange-700 transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            )}

            {/* Step 2 */}

{/* Step 2 */}
{currentStep === 2 && (
  <div className="form-step" data-step="2">
    <h2 className="text-xl font-semibold mb-5">Occupational Information</h2>
    
    <div className="input-group">
      <label className="text-gray-700 font-normal" htmlFor="status">Status</label>
      {fieldErrors.status && (
        <div className="text-red-600 text-sm mt-1">{fieldErrors.status}</div>
      )}
      <select
        className="text-gray-700 font-normal w-full p-3 my-3 border border-gray-100 rounded-lg transition-all duration-300 focus:border-gray-500 focus:outline-0"
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        <option value="">Select Status</option>
        <option value="student">Student</option>
        <option value="professional">Professional</option>
        <option value="other">Other</option>
      </select>
    </div>

    {/* Conditionally Render Student Fields */}
    {formData.status === "student" && (
      <div id="studentStatus" className="animate-in fade-in duration-300">
                <div className="input-group">
          <label className="text-gray-700 font-normal" htmlFor="institution">Institution</label>
                  {fieldErrors.studentInstitution && (
                    <div className="text-red-600 text-sm mt-1">{fieldErrors.studentInstitution}</div>
                  )}
          <input
            type="text"
            name="studentInstitution"
            value={formData.studentInstitution}
            id="institution"
            placeholder="Institution"
            className="w-full p-3 my-3 border border-gray-100 rounded-lg focus:border-gray-500 focus:outline-0"
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label className="text-gray-700 font-normal" htmlFor="faculty">Faculty</label>
                  {fieldErrors.studentFaculty && (
                    <div className="text-red-600 text-sm mt-1">{fieldErrors.studentFaculty}</div>
                  )}
          <input
            type="text"
            name="studentFaculty"
            value={formData.studentFaculty}
            id="faculty"
            placeholder="Faculty"
            className="w-full p-3 my-3 border border-gray-100 rounded-lg focus:border-gray-500 focus:outline-0"
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label className="text-gray-700 font-normal" htmlFor="department">Department</label>
                  {fieldErrors.studentDepartment && (
                    <div className="text-red-600 text-sm mt-1">{fieldErrors.studentDepartment}</div>
                  )}
          <input
            type="text"
            name="studentDepartment"
            value={formData.studentDepartment}
            id="department"
            placeholder="Department"
            className="w-full p-3 my-3 border border-gray-100 rounded-lg focus:border-gray-500 focus:outline-0"
            onChange={handleChange}
            required
          />
        </div>
                <div className="input-group">
          <label className="text-gray-700 font-normal" htmlFor="level">Level</label>
                  {fieldErrors.studentLevel && (
                    <div className="text-red-600 text-sm mt-1">{fieldErrors.studentLevel}</div>
                  )}
          <input
            type="text"
            name="studentLevel"
            value={formData.studentLevel}
            id="level"
            placeholder="Level"
            className="w-full p-3 my-3 border border-gray-100 rounded-lg focus:border-gray-500 focus:outline-0"
            onChange={handleChange}
            required
          />
        </div>
      </div>
    )}

    {/* Conditionally Render Professional Fields */}
    {formData.status === "professional" && (
      <div id="proStatus" className="animate-in fade-in duration-300">
                <div className="input-group">
          <label className="text-gray-700 font-normal" htmlFor="company">Organization/ Company</label>
                  {fieldErrors.professionalOrganization && (
                    <div className="text-red-600 text-sm mt-1">{fieldErrors.professionalOrganization}</div>
                  )}
          <input
            type="text"
            name="professionalOrganization"
            value={formData.professionalOrganization}
            id="company"
            placeholder="Organization/ Company"
            onChange={handleChange}
            className="w-full p-3 my-3 border border-gray-100 rounded-lg focus:border-gray-500 focus:outline-0"
          />
        </div>
        <div className="input-group">
          <label className="text-gray-700 font-normal" htmlFor="job">Job Title / Industry</label>
                  {fieldErrors.professionalOccupation && (
                    <div className="text-red-600 text-sm mt-1">{fieldErrors.professionalOccupation}</div>
                  )}
          <input
            type="text"
            name="professionalOccupation"
            value={formData.professionalOccupation}
            id="job"
            placeholder="e.g. Software Engineer"
            onChange={handleChange}
            className="w-full p-3 my-3 border border-gray-100 rounded-lg focus:border-gray-500 focus:outline-0"
          />
        </div>
      </div>
    )}

    {/* Conditionally Render Other Fields */}
    {formData.status === "other" && (
      <div className="input-group animate-in fade-in duration-300">
        <label className="text-gray-700 font-normal" htmlFor="other-status">Please Specify</label>
        {fieldErrors.otherStatus && (
          <div className="text-red-600 text-sm mt-1">{fieldErrors.otherStatus}</div>
        )}
        <input
          type="text"
          name="otherStatus"
            value={formData.otherStatus}
          id="other-status"
          placeholder="Your current status"
          onChange={handleChange}
          className="w-full p-3 my-3 border border-gray-100 rounded-lg focus:border-gray-500 focus:outline-0"
        />
      </div>
    )}

    <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={handlePrev}
          className="w-1/2 cursor-pointer border border-gray-300 bg-white text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="w-1/2 cursor-pointer border-0 bg-orange-600 text-white py-3 px-6 rounded-md hover:bg-orange-700 transition-colors duration-200"
        >
          Next
        </button>
    </div>
  </div>
)}


            {/*  Step 3 */}
            {currentStep === 3 && (
              <div className="form-step" data-step="3">
                <h2 className="text-xl font-semibold mb-5">Connection & Experience</h2>
                <div className="my-2">
                  <label  className="text-gray-700 font-normal" htmlFor="howDidYouHear">How did you hear about us?</label>
                    {fieldErrors.howDidYouHear && (
                      <div className="text-red-600 text-sm mt-1">{fieldErrors.howDidYouHear}</div>
                    )}
                  <select
                    className="text-gray-700 font-normal w-full p-3 my-3 border border-gray-100 rounded-lg transition-all duration-300 focus:border-gray-500 focus:outline-0"
                    name="howDidYouHear"
                    value={formData.howDidYouHear}
                    onChange={handleChange}
                  > 
                    <option value="">How did you hear about us?</option>
                    <option value="social media">Social Media</option>
                    <option value="friend">A Friend</option>
                    <option value="family">A Family Member</option>
                    <option value="search">Online Search</option>
                    <option value="billboard">Billboard/Poster</option>
                  </select>
                </div>

                <div className="my-2">
                  <label  className="text-gray-700 font-normal" htmlFor="experienceToday">
                    Tell us about your experience today
                  </label>
                  <textarea
                    id="experience"
                    name="experienceToday"
                    value={formData.experienceToday}
                    placeholder="We'd love to hear about your experience today!"
                    onChange={handleChange}
                    className="w-full p-3 my-3 border border-gray-100 rounded-lg transition-all duration-300 focus:border-gray-500 focus:outline-0"
                  ></textarea>
                </div>

                <div className="flex justify-between gap-4 mt-5">
        <button
          type="button"
          onClick={handlePrev}
          className="w-1/2 cursor-pointer border border-gray-300 bg-white text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="w-1/2 cursor-pointer border-0 bg-orange-600 text-white py-3 px-6 rounded-md hover:bg-orange-700 transition-colors duration-200"
        >
          Next
        </button>
                </div>
              </div>
            )}
                    {/*  Step 4 */}
            {currentStep === 4 && (
              <div className="form-step" data-step="3">
                <h2 className="text-xl font-semibold mb-5">Follow-up Preference</h2>
                <div className="my-2">
                  <label  className="text-gray-700 font-normal" htmlFor="source">Best time to reach you</label>
                  <select
                    onChange={handleChange}
                    className="text-gray-700 font-normal w-full p-3 my-3 border border-gray-100 rounded-lg transition-all duration-300 focus:border-gray-500 focus:outline-0"
                    name="bestContactTime"
                    value={formData.bestContactTime}
                  > 
                    <option value="">Best time to reach you</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>

                                <div className="my-2">
                  <label  className="text-gray-700 font-normal" htmlFor="source">Preferred Contact Method</label>
                  <select
                   onChange={handleChange}
                   className="text-gray-700 font-normal w-full p-3 my-3 border border-gray-100 rounded-lg transition-all duration-300 focus:border-gray-500 focus:outline-0"
                    name="preferredContactMethod"
                    value={formData.preferredContactMethod}
                  > 
                    <option value="">Preferred Contact Method</option>
                    <option value="phone">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="textMessage">SMS</option>
                  </select>
                </div>


                <div className="my-2">
                  <label  className="text-gray-700 font-normal" htmlFor="prayer">
                    Is there anything we can pray for you about?
                  </label>
                  <textarea
                    id="prayer"
                    placeholder="Please Specify"
                    name="prayerRequests"
                    value={formData.prayerRequests}
                   onChange={handleChange}
                    className="w-full p-3 my-3 border border-gray-100 rounded-lg transition-all duration-300 focus:border-gray-500 focus:outline-0"
                  ></textarea>
                </div>

                <div className="flex justify-between gap-4 mt-5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="prev-btn  w-full cursor-pointer border-0 bg-orange-600 text-white text-xl py-3 px-6 rounded-md hover:bg-orange-700 transition-colors duration-200"
                  >
                    Back
                  </button>
                  <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full cursor-pointer border-0 bg-orange-600 text-white text-xl py-3 px-6 rounded-md hover:bg-orange-700 transition-colors duration-200 disabled:bg-gray-400"
                >
                  {isLoading ? "Submitting..." : "Submit Form"}
                </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 absolute right-[5%] bottom-[5%]">
          <a
            href="https://www.instagram.com/hgbcinfluencers"
            target="_blank"
            className="flex justify-center items-center w-10 h-10 rounded-full bg-white hover:bg-orange-600 text-orange-600 hover:text-white transition-colors duration-300 shadow-lg"
          >
            <FaInstagram className="w-6 h-6 " />
          </a>
          <a
            href="https://www.facebook.com/hgbcinfluencers"
            target="_blank"
            className="flex justify-center items-center w-10 h-10 rounded-full bg-white hover:bg-orange-600 text-orange-600 hover:text-white transition-colors duration-300 shadow-lg"
          >
            <FaFacebook className="w-6 h-6" />
          </a>
          <a
            href="https://www.youtube.com/@hgbcinfluencers"
            target="_blank"
            className="flex justify-center items-center w-10 h-10 rounded-full bg-white hover:bg-orange-600 text-orange-600 hover:text-white transition-colors duration-300 shadow-lg"
          >
            <FaYoutube className="w-6 h-6" />
          </a>
          <a
            href="https://www.tiktok.com/@hgbcinfluencers"
            target="_blank"
            className="flex justify-center items-center w-10 h-10 rounded-full bg-white hover:bg-orange-600 text-orange-600 hover:text-white transition-colors duration-300 shadow-lg"
          >
            <FaTiktok className="w-6 h-6" />
          </a>
        </div>

        <SucessVideoModal isOpen={isSubmitted} onClose={() => setIsSubmitted(false)} />

      </main>
    </>
  );
};

export default Hero;
