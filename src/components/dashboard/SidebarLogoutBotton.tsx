import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LogoutConfirmModal from "@/components/modals/LogoutConfirmModal";

const SidebarLogoutButton = () => {
    const { logout } = useAuth();

    const [showModal, setShowModal] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleConfirmLogout = () => {
        if (isSigningOut) return;

        setIsSigningOut(true);

        setTimeout(async () => {
            await logout();
            setIsSigningOut(false);
            setShowModal(false);
        }, 3000);
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                disabled={isSigningOut}
                className="mt-6 w-full bg-white text-purple-600 font-medium rounded-lg py-2.5 px-4 border border-purple-600 flex items-center justify-center gap-3 transition-all duration-600 hover:bg-purple-600 hover:text-white hover:border-purple-300 disabled:opacity-60 cursor-pointer"
            >
                <LogOut size={18} />
                Sign Out
            </button>

            <LogoutConfirmModal
                show={showModal}
                loading={isSigningOut}
                onClose={() => !isSigningOut && setShowModal(false)}
                onConfirm={handleConfirmLogout}
            />
        </>
    );
};

export default SidebarLogoutButton;
