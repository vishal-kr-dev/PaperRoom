import NavbarAuth from "@/components/NavbarAuth";
import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <NavbarAuth />
            <main>{children}</main>
        </div>
    );
}
