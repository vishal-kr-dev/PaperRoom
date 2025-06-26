"use client";

import { useAuthStore } from "@/stores/authStore";
import { redirect } from "next/navigation";

function page() {
    const { user, isAuthenticated } = useAuthStore((state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
    }));

    if (isAuthenticated && user) {
        redirect("/dashboard");
    }

    redirect("/home");

    return <main>How did you end up here?</main>;
}

export default page;
