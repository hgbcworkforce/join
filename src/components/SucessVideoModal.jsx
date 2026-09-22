import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaPlay, FaXmark } from "react-icons/fa6";

const SucessVideoModal = ({ isOpen = false, onClose = () => {} }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      {/* Modal Content Card */}
      <div
        id="success-state"
        className="relative w-full max-w-[480px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-8 text-center animate-in fade-in zoom-in duration-300 border border-slate-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          aria-label="Close"
          className="bg-orange-600 hover:bg-orange-700 w-8 h-8 flex justify-center items-center text-white rounded-full cursor-pointer shadow-md absolute top-3.5 right-3.5 sm:top-4 sm:right-4 transition-transform active:scale-90"
          onClick={onClose}
        >
          <FaXmark className="w-4 h-4" />
        </button>

        {/* Success Icon */}
        <div className="mx-auto mb-3 sm:mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600 shadow-inner">
          <span className="text-2xl sm:text-3xl font-bold">✓</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">You're part of the family!</h2>
        <p className="text-gray-600 text-sm sm:text-base">We can't wait to see you soon.</p>

        <div className="mt-6 sm:mt-8 border-t border-slate-100 pt-5 sm:pt-6">
          <p className="text-xs font-bold text-gray-500 mb-3 sm:mb-4 uppercase tracking-wider">
            Watch a message from our Pastor
          </p>

          {/* Video Preview */}
          <div 
            onClick={() => window.open("https://youtube.com/@hgbcinfluencers", "_blank")}
            className="group relative w-full h-[170px] sm:h-[200px] bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer shadow-inner"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            {/* Play Button */}
            <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-600 flex justify-center items-center group-hover:scale-110 transition-transform duration-300 ease-out shadow-lg">
              <FaPlay className="text-white text-base sm:text-lg ml-0.5" />
              <div className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-75"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Social Media Links */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
        <a
          href="https://www.instagram.com/hgbcinfluencers"
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-orange-600 text-orange-600 hover:text-white transition-colors duration-300 shadow-lg cursor-pointer"
        >
          <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6" />
        </a>
        <a
          href="https://www.facebook.com/hgbcinfluencers"
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-orange-600 text-orange-600 hover:text-white transition-colors duration-300 shadow-lg cursor-pointer"
        >
          <FaFacebook className="w-5 h-5 sm:w-6 sm:h-6" />
        </a>
        <a
          href="https://www.youtube.com/@hgbcinfluencers"
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-orange-600 text-orange-600 hover:text-white transition-colors duration-300 shadow-lg cursor-pointer"
        >
          <FaYoutube className="w-5 h-5 sm:w-6 sm:h-6" />
        </a>
        <a
          href="https://www.tiktok.com/@hgbcinfluencers"
          target="_blank"
          rel="noreferrer"
          className="flex justify-center items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-orange-600 text-orange-600 hover:text-white transition-colors duration-300 shadow-lg cursor-pointer"
        >
          <FaTiktok className="w-5 h-5 sm:w-6 sm:h-6" />
        </a>
      </div>
    </div>
  );
};

export default SucessVideoModal;