import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Room } from "@/types/room";

interface RoomStore {
    room: Room | null;
    setRoom: (room: Room) => void;
    clearRoom: () => void;
}

export const useRoomStore = create<RoomStore>()(
    persist(
        (set) => ({
            room: null,
            setRoom: (room) => set({ room }),
            clearRoom: () => set({ room: null }),
        }),
        { name: "room-store" }
    )
);
