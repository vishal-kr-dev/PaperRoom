import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AuthThemeClient from "@/components/AuthThemeClient";

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

export const metadata: Metadata = {
    title: "PaperRoom",
    description:
        "Boost your team's productivity with PaperRoom — gamified task tracking, XP rewards, and real-time collaboration.",
    keywords: [
        "task management",
        "productivity",
        "collaboration",
        "XP system",
        "gamified productivity",
        "PaperRoom",
    ],
    metadataBase: new URL("https://paper-room.vercel.app"),
    openGraph: {
        title: "PaperRoom",
        description:
            "Gamify your workflow. Track tasks, earn XP, and grow as a team.",
        url: "https://paper-room.vercel.app/",
        siteName: "PaperRoom",
        locale: "en_US",
        type: "website",
        // images: [
        //   {
        //     url: "https://paper-room.vercel.app/og-image.png",
        //     width: 1200,
        //     height: 630,
        //     alt: "PaperRoom Dashboard Preview",
        //   },
        // ],
    },
    twitter: {
        card: "summary_large_image",
        title: "PaperRoom",
        description:
            "Gamify your productivity and team workflow with PaperRoom.",
        // images: ["https://paper-room.vercel.app/og-image.png"],
        // creator: "@yourTwitterHandle",
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    // authors: [{ name: "Vishal Kumar", url: "https://yourportfolio.com" }],
    // creator: "Vishal Kumar",
};

// export const viewport: Viewport = {
//     themeColor: [
//         { media: "(prefers-color-scheme: light)", color: "#ffffff" },
//         { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
//     ],
// };


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable}`}
        >
            <body className="antialiased min-h-screen bg-background text-foreground">
                <SpeedInsights />
                <Toaster richColors position="top-center" />
                <AuthThemeClient />
                <main>{children}</main>
            </body>
        </html>
    );
}
