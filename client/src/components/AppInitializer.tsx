"use client";

import { useRoomInit } from "@/hooks/useRoomInit";

function AppInitializer() {
    useRoomInit();

    return null;
}

export default AppInitializer;