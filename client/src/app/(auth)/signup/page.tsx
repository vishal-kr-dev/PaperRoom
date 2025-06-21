"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axiosInstance from "@/utils/axiosInstance";

const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function SignupPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password || !confirm) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!isValidEmail(email)) {
            toast.warning("Please enter a valid email address");
            return;
        }

        if (password.length < 6) {
            toast.warning("Password must be at least 6 characters");
            return;
        }

        if (password !== confirm) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post("/auth/signup", {
                username: name,
                email,
                password,
            });

            if (response.status === 201) {
                toast.success("Account created! Please login.");
                router.push("/login");
            }
        } catch {
            toast.error("Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return { strength: 0, text: "" };
        if (password.length < 6)
            return { strength: 25, text: "Weak", color: "bg-red-500" };
        if (password.length < 8)
            return { strength: 50, text: "Fair", color: "bg-yellow-500" };
        if (password.length < 12)
            return { strength: 75, text: "Good", color: "bg-blue-500" };
        return { strength: 100, text: "Strong", color: "bg-green-500" };
    };

    const passwordStrength = getPasswordStrength(password);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden py-8 pt-16 lg:pt-20">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-2/3 right-1/5 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
                <div className="absolute bottom-1/3 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>

            {/* Main card */}
            <div className="w-full max-w-md mt-8 mx-4 relative z-10">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:shadow-purple-500/25">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            Create Account
                        </h2>
                        <p className="text-white/70">Join us today</p>
                    </div>

                    {/* Form */}
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90">
                                Full Name
                            </label>
                            <Input
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all duration-200 h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90">
                                Email
                            </label>
                            <Input
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all duration-200 h-12"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90">
                                Password
                            </label>
                            <Input
                                placeholder="Create a password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all duration-200 h-12"
                            />
                            {password && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-white/70">
                                        <span>Password strength</span>
                                        <span className="font-medium">
                                            {passwordStrength.text}
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                            style={{
                                                width: `${passwordStrength.strength}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90">
                                Confirm Password
                            </label>
                            <Input
                                placeholder="Confirm your password"
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-indigo-400 focus:ring-indigo-400/20 transition-all duration-200 h-12"
                            />
                            {confirm && password !== confirm && (
                                <p className="text-red-400 text-xs flex items-center space-x-1">
                                    <svg
                                        className="w-3 h-3"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>Passwords do not match</span>
                                </p>
                            )}
                            {confirm && password === confirm && (
                                <p className="text-green-400 text-xs flex items-center space-x-1">
                                    <svg
                                        className="w-3 h-3"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>Passwords match</span>
                                </p>
                            )}
                        </div>

                        <Button
                            onClick={handleSignup}
                            disabled={loading}
                            className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-indigo-500/25"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Creating account...</span>
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-white/70">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-200 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Decorative elements */}
                {/* <div className="absolute -top-4 -right-4 w-8 h-8 bg-indigo-500 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full opacity-60 animate-bounce animation-delay-1000"></div>
        <div className="absolute top-1/2 -right-8 w-4 h-4 bg-pink-500 rounded-full opacity-40 animate-pulse"></div> */}
            </div>
        </div>
    );
}
