import { FaPlay } from "react-icons/fa6";

const SucessVideoModal = ({ isOpen = false, onClose = () => {} }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay: covers screen and dims background */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/20 backdrop-blur-sm"
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
    </>
  );
};

export default SucessVideoModal;