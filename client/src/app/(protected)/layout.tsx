import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 lg:ml-64 pt-20 p-6 min-h-screen overflow-auto bg-gray-50 dark:bg-gray-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
