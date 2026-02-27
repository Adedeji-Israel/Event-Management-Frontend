import { X, Check } from "lucide-react";

interface SignupSuccessProps {
  onClose?: () => void;
}

const SignupSuccess = ({ onClose }: SignupSuccessProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white px-6 py-10 text-center shadow-lg">
        
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X size={22} />
          </button>
        )}

        {/* Success icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
          <Check className="text-white" size={40} strokeWidth={3} />
        </div>

        {/* Title */}
        <h2 className="mb-3 text-2xl font-bold text-[#0A2A52]">
          You have a mail!
        </h2>

        {/* Message */}
        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          Your application was submitted. Kindly{" "}
          <span className="font-medium text-gray-700">
            check your email
          </span>{" "}
          in 2 minutes.
        </p>

        {/* Emojis */}
        <div className="text-2xl">💙💙💙</div>
      </div>
    </div>
  );
};

export default SignupSuccess;
