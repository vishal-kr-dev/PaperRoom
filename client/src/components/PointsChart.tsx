"use client";
import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";

interface PointsChartProps {
    height?: number;
}

// Generate a color palette for dynamic users
const generateColor = (index: number): string => {
    const colors = [
        "#6366f1",
        "#10b981",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
        "#f97316",
        "#84cc16",
        "#ec4899",
        "#6b7280",
    ];
    return colors[index % colors.length];
};

export default function PointsChart({ height = 320 }: PointsChartProps) {
    const [data, setData] = useState<any[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [userColors, setUserColors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getData = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/user/xp-chart");
            const chartData = res.data.data;

            if (!chartData || chartData.length === 0) {
                setError("No data available");
                return;
            }

            // Extract unique users from the data
            const uniqueUsers = new Set<string>();
            chartData.forEach((item: any) => {
                Object.keys(item).forEach((key) => {
                    if (
                        key !== "date" &&
                        key !== "created_at" &&
                        key !== "updated_at" &&
                        key !== "id"
                    ) {
                        uniqueUsers.add(key);
                    }
                });
            });

            const usersArray = Array.from(uniqueUsers);

            // Fill missing user data with 0 or null for better visualization
            const processedData = chartData.map((item: any) => {
                const processedItem = { ...item };
                usersArray.forEach((user) => {
                    if (!(user in processedItem)) {
                        processedItem[user] = 0; // or null if you want gaps
                    }
                });
                return processedItem;
            });

            // Generate colors for each user
            const colors: Record<string, string> = {};
            usersArray.forEach((user, index) => {
                colors[user] = generateColor(index);
            });

            setData(processedData);
            setUsers(usersArray);
            setUserColors(colors);
            setError(null);
        } catch (err) {
            console.error("Error fetching chart data:", err);
            setError("Failed to load chart data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    if (loading) {
        return (
            <div className="p-4 border rounded-xl bg-background shadow-sm">
                <div className="flex items-center justify-center h-80">
                    <div className="text-muted-foreground">
                        Loading chart data...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 border rounded-xl bg-background shadow-sm">
                <div className="flex items-center justify-center h-80">
                    <div className="text-destructive">{error}</div>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="p-4 border rounded-xl bg-background shadow-sm">
                <div className="flex items-center justify-center h-80">
                    <div className="text-muted-foreground">
                        No data to display
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 border rounded-xl bg-background shadow-sm">

            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={data}>
                    <defs>
                        {users.map((user) => (
                            <linearGradient
                                key={user}
                                id={`color-${user.replace(/\s+/g, "-")}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor={userColors[user]}
                                    stopOpacity={0.4}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={userColors[user]}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                            // Format date for better readability
                            const date = new Date(value);
                            return date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            });
                        }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                        labelFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            });
                        }}
                        formatter={(value: number, name: string) => [
                            `${value} XP`,
                            name,
                        ]}
                    />
                    <Legend />
                    {users.map((user) => (
                        <Area
                            key={user}
                            type="monotone"
                            dataKey={user}
                            stroke={userColors[user]}
                            fill={`url(#color-${user.replace(/\s+/g, "-")})`}
                            fillOpacity={1}
                            strokeWidth={2}
                            connectNulls={false}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
