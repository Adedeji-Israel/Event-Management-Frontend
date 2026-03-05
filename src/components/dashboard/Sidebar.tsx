import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AppLogo from "@/assets/images/logo.png";
import SidebarLogoutButton from "@/components/dashboard/SidebarLogoutBotton";
import { roleLinks } from "@/layouts/sidebarLinks";
import { getRoleKey } from "@/lib/getRoleKey";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: Props) => {
  const { user } = useAuth();

  const roleKey = getRoleKey(user?.role);
  const links = roleKey ? roleLinks[roleKey] : [];


  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-30 lg:hidden ${isOpen ? "block" : "hidden"
          }`}
      />

      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-white border-r
        flex flex-col justify-between
        transform transition-transform duration-300
        lg:static lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Top */}
        <div>
          <div className="bg-[#4738B9] h-18 px-5 flex items-center justify-between">
            <img src={AppLogo} className="w-40" />
            <button onClick={onClose} className="lg:hidden text-white">
              <X size={22} />
            </button>
          </div>

          <nav className="mt-4 p-4 space-y-2">
            {links.map(({ name, to, icon: Icon, end }) => (
              <NavLink
                key={name}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition
                  ${isActive
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={18} />
                {name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4">
          <SidebarLogoutButton />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;