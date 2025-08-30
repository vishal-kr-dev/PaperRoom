import { Save, User } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserAvatar } from "../../../../components/UserAvatar";
import { useAuthStore } from "@/stores/authStore";

interface ProfileFormData {
    email: string;
    username: string;
    // bio: string;
}

export const ProfileSettings: React.FC = () => {
    const user = useAuthStore((s) => s.user);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormData>({
        defaultValues: {
            email: user?.email,
            username: user?.username,
        },
    });

    const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Saving profile:", data);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Profile Information
                </h2>
            </div>

            <div className="flex flex-col items-center md:items-start md:flex-row gap-5">
                {/* Avatar Section */}
                <UserAvatar className="w-25 h-25 mb-4" />

                {/* Profile Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 w-full"
                >
                    <div className="flex flex-col gap-6 w-full">
                        {/* Username */}
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Username
                            </label>
                            <input
                                type="text"
                                {...register("username", {
                                    required: "Username is required",
                                    minLength: {
                                        value: 2,
                                        message:
                                            "Username must be at least 2 characters",
                                    },
                                })}
                                className={`w-full px-3 py-2 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.username
                                        ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                                        : "bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                                } text-gray-900 placeholder-gray-500 dark:text-white dark:placeholder-gray-400`}
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                Email Address
                            </label>
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address",
                                    },
                                })}
                                className={`w-full px-3 py-2 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.email
                                        ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                                        : "bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                                } text-gray-900 placeholder-gray-500 dark:text-white dark:placeholder-gray-400`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-6 py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};
