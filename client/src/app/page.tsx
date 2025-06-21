"use client";
import React, { useState, useEffect } from "react";
import {
    ArrowRight,
    CheckCircle,
    Users,
    BarChart3,
    Tag,
    Star,
    Sparkles,
    Zap,
    Globe,
    Shield,
    Twitter,
    Github,
    Linkedin,
    Menu,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const LandingPage = () => {
    const router = useRouter();

    const [isVisible, setIsVisible] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % 3);
        }, 5000);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll);

        return () => {
            clearInterval(interval);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const testimonials = [
        {
            name: "Jane Doe",
            role: "Product Designer",
            initials: "JD",
            quote: "PaperRoom has transformed how our design team collaborates. The point system makes task completion fun and engaging.",
            gradient: "from-purple-500 to-pink-500",
        },
        {
            name: "Mike Smith",
            role: "Team Lead",
            initials: "MS",
            quote: "The analytics and tracking features help me understand my team's productivity patterns and allocate resources more effectively.",
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            name: "Alex Johnson",
            role: "Developer",
            initials: "AJ",
            quote: "I love how PaperRoom organizes tasks by interest areas. It helps me focus on what I'm passionate about while still contributing to the team.",
            gradient: "from-green-500 to-emerald-500",
        },
    ];

    const features = [
        {
            icon: Tag,
            title: "Interest-Based Rooms",
            description:
                "Join rooms based on shared interests and collaborate with like-minded people",
            gradient: "from-indigo-500 to-purple-500",
        },
        {
            icon: CheckCircle,
            title: "Shared Tasks",
            description:
                "Create and manage tasks that are visible to all room members",
            gradient: "from-green-500 to-teal-500",
        },
        {
            icon: BarChart3,
            title: "Activity Tracking",
            description:
                "Monitor your progress with detailed charts and visualizations",
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            icon: Users,
            title: "Member Rankings",
            description:
                "See how you stack up against other room members with leaderboards",
            gradient: "from-orange-500 to-red-500",
        },
    ];

    const rooms = [
        {
            name: "Design Team",
            color: "bg-blue-500",
            tags: ["UI/UX", "Wireframing", "Prototyping"],
            description:
                "Collaborate on design projects, share feedback, and maintain design systems.",
            members: 24,
            tasks: 156,
            gradient: "from-blue-500/20 to-purple-500/20",
        },
        {
            name: "Development Hub",
            color: "bg-green-500",
            tags: ["Frontend", "Backend", "DevOps"],
            description:
                "Track development tasks, manage sprints, and coordinate releases.",
            members: 32,
            tasks: 218,
            gradient: "from-green-500/20 to-teal-500/20",
        },
        {
            name: "Marketing Squad",
            color: "bg-purple-500",
            tags: ["Content", "Social Media", "Analytics"],
            description:
                "Plan campaigns, create content, and analyze marketing performance.",
            members: 18,
            tasks: 124,
            gradient: "from-purple-500/20 to-pink-500/20",
        },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 overflow-hidden pt-16 lg:pt-20">
            {/* Cursor follower */}
            <div
                className="fixed w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full pointer-events-none z-40 opacity-60 blur-sm transition-all duration-300 ease-out"
                style={{
                    left: mousePosition.x - 8,
                    top: mousePosition.y - 8,
                }}
            />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center lg:-my-6 px-6 lg:px-8 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl animate-bounce"></div>
                </div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    {/* Hero Content */}
                    <div
                        className={`space-y-8 transition-all duration-1000 ${
                            isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                    >
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full border border-indigo-200 backdrop-blur-sm">
                                <Sparkles className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-medium text-indigo-700">
                                    New: Real-time collaboration features
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                                Welcome to{" "}
                                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    PaperRoom
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                                A collaborative space where teams can organize
                                tasks based on shared interests. Join rooms,
                                create tasks, and track progress together with
                                gamified productivity.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={() => router.push("/signup")}
                            >
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            {/* <Button
                                size="lg"
                                variant="outline"
                                className="group border-2 hover:bg-gray-50 transition-all duration-300"
                            >
                                Try Demo Room
                                <Zap className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                            </Button> */}
                        </div>

                        {/* Stats */}
                        {/* <div className="flex gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Teams</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </div>
            </div> */}
                    </div>

                    {/* Hero Visual */}
                    <div
                        className={`relative transition-all duration-1000 delay-300 ${
                            isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl animate-pulse"></div>

                            <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            Design Room
                                        </CardTitle>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">
                                                4.9
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <Badge
                                            variant="secondary"
                                            className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-indigo-200"
                                        >
                                            UI/UX
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200"
                                        >
                                            Wireframing
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className="bg-gradient-to-r from-pink-50 to-red-50 text-pink-700 border-pink-200"
                                        >
                                            Prototyping
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        {[
                                            {
                                                task: "Create wireframes",
                                                points: 15,
                                                progress: 100,
                                            },
                                            {
                                                task: "User testing",
                                                points: 25,
                                                progress: 60,
                                            },
                                            {
                                                task: "Design system update",
                                                points: 20,
                                                progress: 30,
                                            },
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className="group p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium group-hover:text-indigo-600 transition-colors">
                                                        {item.task}
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className="group-hover:border-indigo-300"
                                                    >
                                                        {item.points} pts
                                                    </Badge>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                                        style={{
                                                            width: `${item.progress}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 border-2 border-white flex items-center justify-center text-white text-xs font-semibold`}
                                                >
                                                    {i}
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            24 members
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section
                id="features"
                className="py-24 px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to collaborate effectively with
                            your team and boost productivity
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
                            >
                                <CardContent className="p-8 text-center">
                                    <div
                                        className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 group-hover:text-indigo-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Get started with PaperRoom in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                step: 1,
                                title: "Create or Join a Room",
                                description:
                                    "Create a new room based on your interests or join an existing one with a room code",
                                icon: Globe,
                            },
                            {
                                step: 2,
                                title: "Create and Assign Tasks",
                                description:
                                    "Add tasks with detailed descriptions, due dates, and point values",
                                icon: CheckCircle,
                            },
                            {
                                step: 3,
                                title: "Track Progress Together",
                                description:
                                    "Monitor task completion, earn points, and see how you rank among room members",
                                icon: BarChart3,
                            },
                        ].map((item, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative mb-8">
                                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <span className="text-2xl font-bold text-white">
                                            {item.step}
                                        </span>
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                                        <item.icon className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-indigo-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Rooms Section */}
            <section
                id="rooms"
                className="py-24 px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Popular Rooms
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover some of our most active collaboration
                            spaces
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {rooms.map((room, index) => (
                            <Card
                                key={index}
                                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white"
                            >
                                <div className={`h-2 ${room.color}`}></div>
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${room.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                                ></div>

                                <CardContent className="p-8 relative z-10">
                                    <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">
                                        {room.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {room.tags.map((tag, tagIndex) => (
                                            <Badge
                                                key={tagIndex}
                                                variant="secondary"
                                                className="group-hover:bg-white/20 group-hover:text-white transition-colors"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 group-hover:text-white/90 transition-colors leading-relaxed mb-6">
                                        {room.description}
                                    </p>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <span className="group-hover:text-white transition-colors">
                                                {room.members} members
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="group-hover:text-white transition-colors">
                                                {room.tasks} tasks
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 lg:px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl lg:text-6xl font-bold mb-8">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl mb-12 text-white/90 leading-relaxed">
                            Join PaperRoom today and transform how your team
                            collaborates. Experience the future of productivity.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Button
                                size="lg"
                                className="group bg-white text-indigo-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={() => router.push("/signup")}
                            >
                                Create Account
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            {/* <Button
                                size="lg"
                                variant="outline"
                                className="group border-2 border-white text-white hover:bg-white/10 transition-all duration-300"
                            >
                                Try Demo
                                <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                            </Button> */}
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Footer */}
            <footer className="bg-gray-900 text-white py-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                    <span className="text-lg font-bold">
                                        PR
                                    </span>
                                </div>
                                <span className="text-2xl font-bold">
                                    PaperRoom
                                </span>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                A collaborative task management platform for
                                teams with shared interests.
                            </p>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                                    <Github className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {[
                            {
                                title: "Product",
                                links: [
                                    "Features",
                                    "Pricing",
                                    "Roadmap",
                                    "FAQ",
                                ],
                            },
                            {
                                title: "Company",
                                links: ["About", "Blog", "Careers", "Contact"],
                            },
                            {
                                title: "Legal",
                                links: [
                                    "Terms",
                                    "Privacy",
                                    "Cookies",
                                    "Licenses",
                                ],
                            },
                        ].map((section, index) => (
                            <div key={index}>
                                <h3 className="text-lg font-semibold mb-6">
                                    {section.title}
                                </h3>
                                <ul className="space-y-4">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <a
                                                href="#"
                                                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2025 PaperRoom. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 mt-4 md:mt-0">
                            <span className="text-sm text-gray-400">
                                Made with ❤️ for teams
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
};

export default LandingPage;
