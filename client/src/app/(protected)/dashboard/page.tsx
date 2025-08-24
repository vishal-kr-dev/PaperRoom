"use client";

import PointsChart from "./_components/PointsChart";
import TaskQuickComplete from "./_components/TaskQuickComplete";
import Leaderboard from "./_components/RankList";

const DashboardPage = () => {
    return (
        <main className="container mx-auto pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left: (2/3 width on lg+) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border bg-background p-4 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 text-foreground">
                            Points Chart
                        </h2>
                        <PointsChart />
                    </div>

                    <TaskQuickComplete />
                </div>

                <div className="space-y-4">
                    <div className="rounded-xl border bg-background shadow-sm">
                        <Leaderboard />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DashboardPage;
