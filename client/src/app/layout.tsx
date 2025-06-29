// app/layout.tsx
"use client";
import { useEffect } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { checkAuthStatus } from "@/lib/authCheck";

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
    const { isInitialized, setInitialized, setLoading } = useAuthStore();

    useEffect(() => {
        // Only check once when app initializes
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

    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <body className="antialiased min-h-screen bg-background text-foreground">
                <Toaster richColors position="top-center" />
                {children}
            </body>
        </html>
    );
}
