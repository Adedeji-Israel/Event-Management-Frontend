import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import BackgroundImage from "@/assets/images/hero_area_image_3.jpg";
import Logo from "@/assets/images/logo.png"

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface LoginFormData {
  email: string;
  password: string;
}

const FormSchema = yup.object({
  email: yup
    .string()
    .required("Email is required!")
    .matches(emailRegex, "Invalid email format"),
  password: yup
    .string()
    .required("Password is required!")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const { login, submitting } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(FormSchema),
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await login(data);

      reset();
      toast.success("Login successful!");

      // 🔁 ROLE-BASED REDIRECT
      if (!user?.role) {
        console.warn("User role missing");
        navigate("/");
        return;
      }

      switch (user.role) {
        case "admin":
          navigate("/dashboard/admin");
          break;
        case "organizer":
          navigate("/dashboard/organizer");
          break;
        case "user":
          navigate("/dashboard/attendee");
          break;
        default:
          console.warn("Unknown role:", user.role);
          navigate("/");
      }

    } catch (error: any) {
      toast.error(error.message);
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

        {/* Signup Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[90%] max-w-md bg-white backdrop-blur-md p-8 rounded-lg shadow-xl"
        >
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-2xl font-bold text-[#4B22A6]">LOG IN TO YOUR ACCOUNT</h1>
          </div>

          {/* Email */}
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
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                id="password"
                className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                onClick={handleTogglePassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="mb-4">
            <button
              type="submit"
              disabled={!isValid || submitting}
              className="w-full bg-[#4B22A7] hover:bg-[#3D1C88] text-white py-2 rounded-sm font-semibold cursor-pointer transition disabled:bg-[#9A84D6] disabled:cursor-not-allowed"
            >
              {submitting ? "Logging In..." : "LOG IN"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              New to EventPlace?{" "}
              <Link to="/auth/signup" className="text-[#4B22A6] font-semibold hover:underline">
                Register Now!
              </Link>
            </p>

            <Link to="/auth/forgot-password" className="text-[#4B22A6] font-semibold hover:underline">
              Forgot your password?
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;

// http://localhost:5174/events/payment/verify?trxref=pxmegwc9ly&reference=pxmegwc9ly
// http://localhost:5174/events/payment/verify?trxref=u1o2wpiasu&reference=u1o2wpiasu 
