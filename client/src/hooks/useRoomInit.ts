import { useEffect, useState } from "react";
import { useRoomStore } from "@/stores/roomStore";
import { fetchRoom } from "@/lib/api/room";

export const useRoomInit = () => {
    const [initialized, setInitialized] = useState(false);
    const room = useRoomStore((s) => s.room);
    const setRoom = useRoomStore((s) => s.setRoom);

    useEffect(() => {
        if (initialized) return;

        const init = async () => {
            try {
                if (!room) {
                    const data = await fetchRoom();
                    setRoom(data);
                }
            } catch (err) {
                console.error("Room init failed:", err);
            } finally {
                setInitialized(true);
            }
        };

        init();
    }, [initialized, room, setRoom]);

    return initialized;
};
