"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Hash, Plus, Settings, Lock, Globe } from "lucide-react";
import axiosInstance, { createApiError } from "@/lib/axiosInstance";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import NavbarAuth from "@/components/NavbarAuth";
import { useAuthStore } from "@/stores/authStore";

interface JoinRoomForm {
    roomCode: string;
}

interface CreateRoomForm {
    roomName: string;
    description: string;
    privacy: "public" | "private";
    maxMembers: number;
    tags: string[];
}

interface FormErrors {
    [key: string]: string;
}

const RoomDiscoveryPage: React.FC = () => {
    const [isJoining, setIsJoining] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);

    // Join room
    const [joinForm, setJoinForm] = useState<JoinRoomForm>({
        roomCode: "",
    });
    const [joinErrors, setJoinErrors] = useState<FormErrors>({});

    // Create room
    const [createForm, setCreateForm] = useState<CreateRoomForm>({
        roomName: "",
        description: "",
        privacy: "public",
        maxMembers: 5,
        tags: [],
    });
    const [createErrors, setCreateErrors] = useState<FormErrors>({});

    // Validation functions
    const validateJoinForm = (data: JoinRoomForm): FormErrors => {
        const errors: FormErrors = {};
        if (!data.roomCode.trim()) {
            errors.roomCode = "Room code is required";
        }
        return errors;
    };

    const validateCreateForm = (data: CreateRoomForm): FormErrors => {
        const errors: FormErrors = {};
        if (!data.roomName.trim()) {
            errors.roomName = "Room name is required";
        }
        return errors;
    };

    const handleJoinRoom = async () => {
        const errors = validateJoinForm(joinForm);
        setJoinErrors(errors);

        if (Object.keys(errors).length > 0) return;

        setIsJoining(true);

        try {
            const response = await axiosInstance.post(
                `/room/${joinForm.roomCode}/join`
            );

            if (response.status === 200) {
                toast.success("Joined room successfully!");
                router.push("/dashboard");

                setIsJoining(false);
                setJoinForm({ roomCode: "" });
                setJoinErrors({});
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                const apiError = createApiError(error);
                toast.error(apiError.message);
            } else {
                toast.error("Failed to join the room");
            }
        } finally {
            setIsJoining(false);
        }
    };

    const handleCreateRoom = async () => {
        const errors = validateCreateForm(createForm);
        setCreateErrors(errors);

        if (Object.keys(errors).length > 0) return;
        setIsCreating(true);

        try {
            const response = await axiosInstance.post(
                "/room/create",
                createForm
            );

            if (response.status === 201) {
                toast.success("Room created successfully");
                router.push("/dashboard")
                if(user){
                    setUser({ ...user, roomId: response.data.data._id });
                }
                setCreateForm({
                    roomName: "",
                    description: "",
                    privacy: "public",
                    maxMembers: 5,
                    tags: [],
                });
                setCreateErrors({});
            }
        } catch (error) {
            console.log(error)
            let errorMessage = "Failed to create room!";
            if (error instanceof AxiosError && error.response?.status === 400) {
                errorMessage = "User is already in a room";
                router.push("/login")
            }

            toast.error(errorMessage);
        } finally {
            setIsCreating(false);
            setIsModalOpen(false);
        }
    };

    const updateJoinForm = (field: keyof JoinRoomForm, value: string) => {
        setJoinForm((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (joinErrors[field]) {
            setJoinErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const updateCreateForm = (field: keyof CreateRoomForm, value: any) => {
        setCreateForm((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (createErrors[field]) {
            setCreateErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 pt-16 lg:pt-20 transition-colors duration-300">
            <NavbarAuth />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12 pt-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text">
                        Discover Amazing Rooms
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Join collaborative spaces that match your interests and
                        goals
                    </p>
                </div>

                {/* Action Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Join Room Card */}
                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-blue-500/20 transition-all duration-300">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                    <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Join with Room Code
                                </CardTitle>
                            </div>
                            <CardDescription className="text-gray-600 dark:text-gray-300">
                                Have a room code? Enter it here to join
                                instantly
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="roomCode"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Room Code
                                </Label>
                                <Input
                                    id="roomCode"
                                    type="text"
                                    placeholder="Enter room code..."
                                    value={joinForm.roomCode}
                                    onChange={(e) =>
                                        updateJoinForm(
                                            "roomCode",
                                            e.target.value
                                        )
                                    }
                                    className="h-12 text-lg border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleJoinRoom();
                                        }
                                    }}
                                />
                                {joinErrors.roomCode && (
                                    <p className="text-sm text-red-500 dark:text-red-400">
                                        {joinErrors.roomCode}
                                    </p>
                                )}
                            </div>

                            <Button
                                onClick={handleJoinRoom}
                                disabled={isJoining}
                                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl text-white"
                            >
                                {isJoining ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Joining...
                                    </div>
                                ) : (
                                    "Join Room"
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Create Room Card */}
                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-green-500/20 transition-all duration-300">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                    <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Create New Room
                                </CardTitle>
                            </div>
                            <CardDescription className="text-gray-600 dark:text-gray-300">
                                Start your own collaborative space with custom
                                settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
                                <div className="text-center text-gray-500 dark:text-gray-400">
                                    <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">
                                        Configure your room settings
                                    </p>
                                </div>
                            </div>

                            <Dialog
                                open={isModalOpen}
                                onOpenChange={setIsModalOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl text-white">
                                        <div className="flex items-center gap-2">
                                            <Plus className="w-5 h-5" />
                                            Create Room
                                        </div>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                                            <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
                                            Create New Room
                                        </DialogTitle>
                                        <DialogDescription className="text-gray-600 dark:text-gray-300">
                                            Set up your collaborative space with
                                            custom settings and preferences.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-6 py-4">
                                        {/* Basic Info */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                                                Basic Information
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="roomName"
                                                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                                    >
                                                        Room Name *
                                                    </Label>
                                                    <Input
                                                        id="roomName"
                                                        placeholder="Enter room name..."
                                                        value={
                                                            createForm.roomName
                                                        }
                                                        onChange={(e) =>
                                                            updateCreateForm(
                                                                "roomName",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                    />
                                                    {createErrors.roomName && (
                                                        <p className="text-sm text-red-500 dark:text-red-400">
                                                            {
                                                                createErrors.roomName
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="description"
                                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                                >
                                                    Description
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    placeholder="Describe what this room is about..."
                                                    value={
                                                        createForm.description
                                                    }
                                                    onChange={(e) =>
                                                        updateCreateForm(
                                                            "description",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="min-h-[80px] resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Tags *
                                                        <span className=" text-gray-500 dark:text-gray-400">
                                                            (one per field,
                                                            total 5)
                                                        </span>
                                                    </Label>
                                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                                                        {[0, 1, 2, 3, 4].map(
                                                            (idx) => (
                                                                <Input
                                                                    key={idx}
                                                                    type="text"
                                                                    placeholder={`Tag ${
                                                                        idx + 1
                                                                    }`}
                                                                    value={
                                                                        createForm
                                                                            .tags[
                                                                            idx
                                                                        ] || ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const newTags =
                                                                            [
                                                                                ...createForm.tags,
                                                                            ];
                                                                        newTags[
                                                                            idx
                                                                        ] =
                                                                            e.target.value;
                                                                        updateCreateForm(
                                                                            "tags",
                                                                            newTags
                                                                                .map(
                                                                                    (
                                                                                        tag
                                                                                    ) =>
                                                                                        tag.trim()
                                                                                )
                                                                                .filter(
                                                                                    (
                                                                                        tag
                                                                                    ) =>
                                                                                        tag.length >
                                                                                        0
                                                                                )
                                                                        );
                                                                    }}
                                                                    className="h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                                    maxLength={
                                                                        20
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Privacy & Access */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                                                Privacy & Access
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Privacy Level
                                                    </Label>
                                                    <Select
                                                        value={
                                                            createForm.privacy
                                                        }
                                                        onValueChange={(
                                                            value:
                                                                | "public"
                                                                | "private"
                                                        ) =>
                                                            updateCreateForm(
                                                                "privacy",
                                                                value
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                                            <SelectItem
                                                                value="public"
                                                                className="dark:text-white dark:focus:bg-grayF-700"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Globe className="w-4 h-4" />
                                                                    Public -
                                                                    Anyone can
                                                                    join
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem
                                                                value="private"
                                                                className="dark:text-white dark:focus:bg-gray-700"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Lock className="w-4 h-4" />
                                                                    Private -
                                                                    Invite Only
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="maxMembers"
                                                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                                    >
                                                        Max Members
                                                    </Label>
                                                    <Select
                                                        value={
                                                            String(createForm.maxMembers)
                                                        }
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            updateCreateForm(
                                                                "maxMembers",
                                                                Number(value)
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                                            <SelectItem
                                                                value="5"
                                                                className="dark:text-white dark:focus:bg-gray-700"
                                                            >
                                                                5 members
                                                            </SelectItem>
                                                            <SelectItem
                                                                value="7"
                                                                className="dark:text-white dark:focus:bg-gray-700"
                                                            >
                                                                7 members
                                                            </SelectItem>
                                                            <SelectItem
                                                                value="10"
                                                                className="dark:text-white dark:focus:bg-gray-700"
                                                            >
                                                                10 members
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setIsModalOpen(false)
                                            }
                                            className="flex-1 h-11 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                            disabled={isCreating}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleCreateRoom}
                                            disabled={isCreating}
                                            className="flex-1 h-11 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white"
                                        >
                                            {isCreating ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Creating Room...
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Plus className="w-4 h-4" />
                                                    Create Room
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RoomDiscoveryPage;
