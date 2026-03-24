import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toastSuccess, toastError } from "@/utils/toast";

import SignupSuccess from "@/components/SignupSuccess";
import BackgroundImage from "@/assets/images/hero_area_image_3.jpg";
import Logo from "@/assets/images/logo.png";
import type { User } from "@/types/user";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface SignupFormData {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: User["gender"];
  profilePicture: FileList;
}

const FormSchema = yup.object({
  fullName: yup.string().required("Full Name is required!"),
  userName: yup.string().required("Username is required!"),
  email: yup
    .string()
    .required("Email address is required!")
    .matches(emailRegex, "Invalid email format"),
  password: yup
    .string()
    .required("Password is required!")
    .min(6, "Password must be at least 6 characters"),
  dateOfBirth: yup
    .string()
    .required("Date of Birth is required!")
    .test("age-validation", "You must be at least 18 years old", (value) => {
      if (!value) return false;
      const dob = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }

      return age >= 18;
    }),
  gender: yup
    .mixed<"male" | "female">()
    .oneOf(["male", "female"])
    .required("Gender is required!"),
  profilePicture: yup
    .mixed<FileList>()
    .required("Profile picture is required!")
    .test(
      "fileExists",
      "Profile picture is required!",
      (value) => value instanceof FileList && value.length > 0
    ),
});

const Signup = () => {
  const { signup, submitting } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<SignupFormData>({
    resolver: yupResolver(FormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SignupFormData) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("userName", data.userName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("dateOfBirth", data.dateOfBirth);
    formData.append("gender", data.gender);
    formData.append("profilePicture", data.profilePicture[0]);

    try {
      const message = await signup(formData);

      reset();
      toastSuccess(message);

      setShowSignupSuccess(true);

      setTimeout(() => {
        setShowSignupSuccess(false);
        navigate("/auth/login");
      }, 6000);

    } catch (error: any) {
      toastError(error.message);
    }
  };

  return (
    <>
      {showSignupSuccess && (
        <SignupSuccess onClose={() => setShowSignupSuccess(false)} />
      )}
      <div
        className="min-h-screen py-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="flex flex-col items-center">
          <img src={Logo} className="w-60 mb-5" alt="Logo" />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-[90%] max-w-md bg-white p-8 rounded-xl shadow-xl"
          >
            <h1 className="text-2xl font-bold text-[#4B22A6] text-center mb-6">
              CREATE YOUR ACCOUNT
            </h1>

            {/* Full Name */}
            <div className="mb-4">
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                {...register("fullName")}
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors.fullName && (
                <p className="text-red-600 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block mb-1">Email Address</label>
              <input
                type="email"
                {...register("email")}
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Username */}
            <div className="mb-4">
              <label className="block mb-1">Username</label>
              <input
                type="text"
                {...register("userName")}
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors.userName && (
                <p className="text-red-600 text-sm">
                  {errors.userName.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full border rounded-lg px-3 py-2 pr-10"
                />
                <span
                  onClick={handleTogglePassword}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <label className="block mb-1">Date of Birth</label>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                {...register("dateOfBirth")}
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors.dateOfBirth && (
                <p className="text-red-600 text-sm">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block mb-1">Gender</label>
              <select
                {...register("gender")}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && (
                <p className="text-red-600 text-sm">{errors.gender.message}</p>
              )}
            </div>

            {/* Profile Picture */}
            <div className="mb-6">
              <label className="block mb-1">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                {...register("profilePicture")}
              />
              {errors.profilePicture && (
                <p className="text-red-600 text-sm">
                  {errors.profilePicture.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || submitting}
              className="w-full bg-[#4B22A7] hover:bg-[#3D1C88] text-white py-2 rounded-sm font-semibold cursor-pointer transition disabled:bg-[#9A84D6] disabled:cursor-not-allowed"
            >
              {submitting ? "Signing Up..." : "SIGN UP"}
            </button>

            <p className="mt-4 text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                LOG IN
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;