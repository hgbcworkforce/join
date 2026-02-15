import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaPlay  } from "react-icons/fa6";

const SucessVideoModal = ({ isOpen = false, onClose = () => {} }) => {
  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-white/20 backdrop-blur-sm">
            {/* Modal Overlay: covers screen and dims background */}
      <div className="flex items-center justify-center p-4 "
        onClick={onClose}
      >
        {/* Modal Content: the actual card */}
        <div
          id="success-state"
          className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden p-8 text-center animate-in fade-in zoom-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          {/* <button
            aria-label="Close"
            className="bg-orange-600 w-8 h-8 flex justify-center items-center p-3 top-4 right-4 text-white rounded-full cursor-pointer shadow-lg absolute"
            onClick={onClose}
          >
            <FaX className="absolute w-5 h-5 " />
          </button> */}

          {/* Success Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <span className="text-3xl font-bold">✓</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">You're part of the family!</h2>
          <p className="text-gray-600">We can't wait to see you soon.</p>

          <div className="mt-8 border-t pt-6">
            <p className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wide">
              Watch a message from our Pastor (Optional)
            </p>

            {/* Video Preview */}
            <div className="group relative w-full h-[200px] bg-gray-900 rounded-xl overflow-hidden flex justify-center items-center cursor-pointer shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              {/* Play Button */}
              <div className="relative z-10 w-14 h-14 rounded-full bg-orange-600 flex justify-center items-center group-hover:scale-110 transition-transform duration-300 ease-out shadow-lg">
                <FaPlay className="text-white text-xl ml-1" />
                <div className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-75"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
                {/* Social Media Links */}
        <div className=" flex justify-center space-x-6 mt-6">
          <a
            href="https://www.instagram.com/hgbcinfluencers"
            target="_blank"
            className="flex justify-center items-center w-12 h-12 rounded-full bg-white hover:bg-orange-600 text-orange-600 hover:text-white transition-colors duration-300 shadow-lg"
          >
            <FaInstagram className="w-8 h-8 " />
          </a>
          <a
            href="https://www.facebook.com/hgbcinfluencers"
            target="_blank"
            className="flex justify-center items-center w-12 h-12 rounded-full bg-white hover:bg-orange-600 text-orange-600 hover:text-white transition-colors duration-300 shadow-lg"
          >
            <FaFacebook className="w-8 h-8" />
          </a>
          <a
            href="https://www.youtube.com/@hgbcinfluencers"
            target="_blank"
            className="flex justify-center items-center w-12 h-12 rounded-full bg-white hover:bg-orange-600 text-orange-600 hover:text-white transition-colors duration-300 shadow-lg"
          >
            <FaYoutube className="w-8 h-8" />
          </a>
          <a
            href="https://www.tiktok.com/@hgbcinfluencers"
            target="_blank"
            className="flex justify-center items-center w-12 h-12 rounded-full bg-white hover:bg-orange-600 text-orange-600 hover:text-white transition-colors duration-300 shadow-lg"
          >
            <FaTiktok className="w-8 h-8" />
          </a>
        </div>
    </div>

    </>
  );
};

export default SucessVideoModal;