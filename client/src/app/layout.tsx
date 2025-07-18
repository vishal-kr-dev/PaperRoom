"use client";

import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { checkAuthStatus } from "@/lib/authCheck";
import { useUIStore } from "@/stores/uiStore";

import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Credentials check on page load
    const { isInitialized, setInitialized, setLoading } = useAuthStore();

    useEffect(() => {
        if (!isInitialized) {
            const initAuth = async () => {
                setLoading(true);
                await checkAuthStatus();
                setInitialized(true);
                setLoading(false);
            };

            initAuth();
        }
    }, [isInitialized, setInitialized, setLoading]);

    // Adding theme
    const theme = useUIStore((state) => state.theme);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <body className="antialiased min-h-screen bg-background text-foreground">
                <SpeedInsights />
                <Toaster richColors position="top-center" />
                <main>{children}</main>
            </body>
        </html>
    );
}
