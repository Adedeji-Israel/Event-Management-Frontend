import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/hooks/useAuth";
import { toastSuccess, toastError } from "@/utils/toast";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";

import BackgroundImage from "@/assets/images/hero_area_image_3.jpg";
import Logo from "@/assets/images/logo.png";

interface ResetPasswordFormData {
    newPassword: string;
    confirmPassword: string;
}

const FormSchema = yup.object({
    newPassword: yup
        .string()
        .required("New password is required!")
        .min(8, "Password must be at least 8 characters"),
    confirmPassword: yup
        .string()
        .required("Please confirm your password!")
        .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

const ResetPassword = () => {
    const { resetPassword, submitting } = useAuth();
    const navigate = useNavigate();
    const { resetPasswordToken } = useParams<{ resetPasswordToken: string }>();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<ResetPasswordFormData>({
        resolver: yupResolver(FormSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!resetPasswordToken) {
            toastError("Invalid or missing reset token.");
            return;
        }

        try {
            await resetPassword(resetPasswordToken, data.newPassword);
            reset();
            toastSuccess("Password reset successful. Please log in.");
            navigate("/auth/login", { replace: true });
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

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-[90%] max-w-md bg-white backdrop-blur-md p-8 rounded-lg shadow-xl"
                >
                    <div className="flex flex-col items-center mb-6">
                        <h1 className="text-2xl font-bold text-[#4B22A6]">SET A NEW PASSWORD</h1>
                        <p className="text-gray-500 text-sm mt-2 text-center">
                            Must be at least 8 characters.
                        </p>
                    </div>

                    {/* New Password */}
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("newPassword")}
                                id="newPassword"
                                className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>
                        </div>
                        {errors.newPassword && (
                            <p className="text-red-600 text-sm mt-1">{errors.newPassword.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword")}
                                id="confirmPassword"
                                className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer text-gray-600"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <button
                            type="submit"
                            disabled={!isValid || submitting}
                            className="w-full bg-[#4B22A7] hover:bg-[#3D1C88] text-white py-2 rounded-sm font-semibold cursor-pointer transition disabled:bg-[#9A84D6] disabled:cursor-not-allowed"
                        >
                            {submitting ? "Resetting..." : "RESET PASSWORD"}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link to="/auth/login" className="text-[#4B22A6] font-semibold hover:underline">
                            Back to login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;