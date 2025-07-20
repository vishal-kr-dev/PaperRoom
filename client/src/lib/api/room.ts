import axiosInstance from "@/lib/axiosInstance";
import { Room } from "@/types/room";

export const fetchRoom = async (): Promise<Room> => {
    const res = await axiosInstance.get("/room");
    return res.data.data;
};

export const roomApi = {
    fetch: async (): Promise<Room> => {
        try {
            const response = await axiosInstance.get("/room");
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch room:", error);
            throw error;
        }
    },
};
