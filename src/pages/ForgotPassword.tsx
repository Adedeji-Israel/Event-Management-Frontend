import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/hooks/useAuth";
import { toastError } from "@/utils/toast";
import { Link } from "react-router-dom";
import { useState } from "react";

import BackgroundImage from "@/assets/images/hero_area_image_3.jpg";
import Logo from "@/assets/images/logo.png";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface ForgotPasswordFormData {
  email: string;
}

const FormSchema = yup.object({
  email: yup
    .string()
    .required("Email is required!")
    .matches(emailRegex, "Invalid email format"),
});

const ForgotPassword = () => {
  const { forgotPassword, submitting } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(FormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      setSentTo(data.email);
      setSubmitted(true);
      reset();
    } catch (error: any) {
      reset();
      toastError(error.message);
    }
  };

  return (
    <div
      className="w-full min-h-screen py-10 bg-gray-100 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="flex flex-col items-center w-full">
        <img src={Logo} alt="site_logo" className="w-60 mb-5" />

        <div className="w-[90%] max-w-md bg-white backdrop-blur-md p-8 rounded-lg shadow-xl">
          {submitted ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#4B22A6] mb-3">CHECK YOUR EMAIL</h1>
              <p className="text-gray-600 mb-6">
                If an account exists for <span className="font-semibold">{sentTo}</span>,
                we've sent a link to reset your password. It expires in 1 hour.
              </p>
              <Link to="/auth/login" className="text-[#4B22A6] font-semibold hover:underline">
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col items-center mb-6">
                <h1 className="text-2xl font-bold text-[#4B22A6]">FORGOT YOUR PASSWORD?</h1>
                <p className="text-gray-500 text-sm mt-2 text-center">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email")}
                  id="email"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  disabled={!isValid || submitting}
                  className="w-full bg-[#4B22A7] hover:bg-[#3D1C88] text-white py-2 rounded-sm font-semibold cursor-pointer transition disabled:bg-[#9A84D6] disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : "SEND RESET LINK"}
                </button>
              </div>

              <div className="text-center">
                <Link to="/auth/login" className="text-[#4B22A6] font-semibold hover:underline">
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;