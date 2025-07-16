"use client";

import { useRoomStore } from "@/stores/roomStore";
import MembersList from "@/components/MembersList";
import PointsChart from "@/components/PointsChart";

const DashboardPage = () => {
    const room = useRoomStore((state) => state.room);
    const members = room?.members || [];

    return (
        <main className="container mx-auto pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left: Chart (2/3 width on lg+) */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border bg-background p-4 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-foreground">
                            Points Chart
                        </h2>
                        <PointsChart height={350} />
                    </div>
                </div>

                {/* Right: Sidebar components */}
                <div className="space-y-4">
                    <div className="rounded-xl border bg-background shadow-sm">
                        <MembersList members={members} maxHeight="h-60" />
                    </div>
                    <div className="rounded-xl border bg-background shadow-sm">
                        <MembersList members={members} maxHeight="h-full" />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DashboardPage;
