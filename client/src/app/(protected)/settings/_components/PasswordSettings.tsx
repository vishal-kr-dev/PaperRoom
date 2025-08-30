import { Eye, EyeOff, Lock, Save } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const PasswordSettings: React.FC = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<PasswordFormData>();

    const newPassword = watch("newPassword");

    const onSubmit: SubmitHandler<PasswordFormData> = async () => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Changing password");
            alert("Password changed successfully!");
            reset();
        } catch (error) {
            console.error("Error changing password:", error);
            alert("Failed to change password. Please try again.");
        }
    };

    // Password strength validation
    const validatePassword = (value: string) => {
        const minLength = value.length >= 8;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasNonalphas = /\W/.test(value);

        if (!minLength) return "Password must be at least 8 characters long";
        if (!hasUpperCase)
            return "Password must contain at least one uppercase letter";
        if (!hasLowerCase)
            return "Password must contain at least one lowercase letter";
        if (!hasNumbers) return "Password must contain at least one number";
        if (!hasNonalphas)
            return "Password must contain at least one special character";
        return true;
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <Lock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Change Password
                </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Current Password
                    </label>
                    <div className="relative">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            {...register("currentPassword", {
                                required: "Current password is required",
                            })}
                            className={`w-full px-3 py-2 pr-10 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.currentPassword
                                    ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                                    : "bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                            } text-gray-900 placeholder-gray-500 dark:text-white dark:placeholder-gray-400`}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            {showCurrentPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.currentPassword.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            {...register("newPassword", {
                                required: "New password is required",
                                validate: validatePassword,
                            })}
                            className={`w-full px-3 py-2 pr-10 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.newPassword
                                    ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                                    : "bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                            } text-gray-900 placeholder-gray-500 dark:text-white dark:placeholder-gray-400`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            {showNewPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.newPassword.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === newPassword ||
                                    "Passwords do not match",
                            })}
                            className={`w-full px-3 py-2 pr-10 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.confirmPassword
                                    ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                                    : "bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                            } text-gray-900 placeholder-gray-500 dark:text-white dark:placeholder-gray-400`}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <h3 className="font-medium mb-2 text-gray-900 dark:text-white">
                        Password Requirements:
                    </h3>
                    <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                        <li>• At least 8 characters long</li>
                        <li>• Include uppercase and lowercase letters</li>
                        <li>• Include at least one number</li>
                        <li>• Include at least one special character</li>
                    </ul>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Changing Password..." : "Change Password"}
                </button>
            </form>
        </div>
    );
};
