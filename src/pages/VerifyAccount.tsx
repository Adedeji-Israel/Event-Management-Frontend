import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Logo from "@/assets/images/logo.png";
import BackgroundImage from "@/assets/images/hero_area_image_3.jpg";

import { Loader2, CheckCircle, XCircle, ShieldCheck } from "lucide-react";


interface VerificationResponse {
  status: "success" | "error";
  message: string;
}

const VerifyAccount: React.FC = () => {
  const { verificationToken } = useParams<{ verificationToken: string }>();
  const navigate = useNavigate();

  const [verifying, setVerifying] = useState(false);
  const [verification, setVerification] = useState<VerificationResponse | null>(
    null
  );
  const [redirecting, setRedirecting] = useState(false);

  const baseUrl: string = import.meta.env.VITE_BASE_URL;
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && verificationToken) {
      hasFetched.current = true;
      handleVerifyAcc();
    }
  }, [verificationToken]);

  const handleVerifyAcc = async (): Promise<void> => {
    setVerifying(true);
    try {
      const res = await fetch(
        `${baseUrl}/auth/verify-account/${verificationToken}`
      );
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setVerification({ status: "success", message: data.message });
      } else {
        toast.error(data.message);
        setVerification({ status: "error", message: data.message });
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
      setVerification({
        status: "error",
        message: "An unexpected error occurred",
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen py-10 bg-gray-100 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="flex flex-col items-center w-full">
        {/* Logo */}
        <img src={Logo} alt="site_logo" className="w-60 mb-5" />

        {/* Verification Card */}
        <div className="w-full max-w-md bg-white backdrop-blur-md p-8 rounded-lg shadow-xl text-center">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <ShieldCheck className="w-6 h-6 text-[#4B22A6]" />
            <h1 className="text-xl font-bold text-[#4B22A6]">
              ACCOUNT VERIFICATION PROCESS
            </h1>
          </div>

          {/* Loading State */}
          {verifying && (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#4B22A6]" />
              <p className="text-gray-600 font-medium">
                Verifying your account, please wait...
              </p>
            </div>
          )}

          {/* Result State */}
          {!verifying && verification && (
            <div className="flex flex-col items-center">
              {verification.status === "success" ? (
                <CheckCircle className="w-14 h-14 text-green-600 mb-3" />
              ) : (
                <XCircle className="w-14 h-14 text-red-600 mb-3" />
              )}

              <p
                className={`font-medium mb-4 ${verification.status === "success"
                    ? "text-green-600"
                    : "text-red-600"
                  }`}
              >
                {verification.message}
              </p>

              {verification.status === "success" && (
                <button
                  onClick={() => {
                    setRedirecting(true);
                    setTimeout(() => {
                      navigate("/auth/login");
                    }, 3000);
                  }}
                  className="w-full bg-[#4B22A7] hover:bg-[#3D1C88] text-white py-2 rounded-sm font-semibold transition cursor-pointer"
                >
                  {redirecting ? "Redirecting..." : "GO TO LOGIN"}
                </button>
              )}
            </div>
          )}

          {/* Pending */}
          {!verifying && !verification && (
            <p className="text-gray-600">
              Verification process pending...
            </p>
          )}
        </div>
      </div>
    </div>
  );

};

export default VerifyAccount;
