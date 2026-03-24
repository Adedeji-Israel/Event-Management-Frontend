import { useLocation, Link } from "react-router-dom";
import { Bell, Settings, Search, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { roleLinks } from "@/layouts/sidebarLinks";
import { getRoleKey } from "@/lib/getRoleKey";

interface Props {
    onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: Props) => {
    const { user } = useAuth();
    const location = useLocation();

    const roleKey = getRoleKey(user?.role);

    const capitalize = (str: string = "") =>
        str.charAt(0).toUpperCase() + str.slice(1);

    const displayRole = capitalize(roleKey);

    const basePath = roleKey ? `/dashboard/${roleKey}` : "/dashboard";

    const isDashboard = location.pathname === basePath;

    const getCurrentPage = () => {
        if (!roleKey) return "Dashboard";

        const links = roleKey ? roleLinks[roleKey] : [];

        if (location.pathname === basePath) {
            return "Dashboard";
        }

        const sortedLinks = [...links].sort(
            (a, b) => b.to.length - a.to.length
        );

        const matchedLink = sortedLinks.find(link =>
            location.pathname.startsWith(link.to)
        );

        return matchedLink?.name || "Dashboard";
    };

    const currentPage = getCurrentPage();

    return (
        <header className="h-18 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">

            {/* LEFT */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-md cursor-pointer hover:bg-gray-100"
                >
                    <Menu size={30} />
                </button>

                <div>
                    {!isDashboard && (
                        <nav className="flex items-center text-sm text-gray-500">
                            <Link
                                to={basePath}
                                className="hover:text-purple-600 font-medium"
                            >
                                Dashboard
                            </Link>
                            <span className="mx-1 text-gray-400">/</span>
                            <span className="text-gray-700 font-semibold">
                                {currentPage}
                            </span>
                        </nav>
                    )}

                    <h1 className="text-xl lg:text-2xl font-bold text-purple-600">
                        {currentPage}
                    </h1>

                    {isDashboard && (
                        <p className="hidden sm:block text-sm text-gray-500">
                            Hello{" "}
                            <span className="font-bold">{user?.userName}</span>, Welcome back!
                        </p>
                    )}
                </div>
            </div>

            {/* SEARCH */}
            <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg w-72">
                <Search size={16} className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search anything..."
                    className="bg-transparent outline-none ml-2 text-sm w-full"
                />
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
                <button className="p-2 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-200">
                    <Bell size={20} />
                </button>

                <button className="p-2 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-200">
                    <Settings size={20} />
                </button>

                <div className="flex items-center gap-2">
                    <img
                        src={user?.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="hidden lg:block">
                        <span className="text-sm font-bold">
                            {user?.fullName}
                        </span>
                        <p className="text-xs text-gray-500">
                            {displayRole}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;