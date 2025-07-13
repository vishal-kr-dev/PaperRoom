import axiosInstance from "@/lib/axiosInstance";
import { Room } from "@/types/room";

export const fetchRoom = async (): Promise<Room> => {
    const res = await axiosInstance.get("/room");
    return res.data.data;
};
