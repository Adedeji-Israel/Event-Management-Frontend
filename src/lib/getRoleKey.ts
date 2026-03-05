import type { SidebarRole } from "@/layouts/sidebarLinks";

export const getRoleKey = (
  role?: string
): SidebarRole | undefined => {
  if (!role) return undefined;

  const normalized = role.trim().toLowerCase();

  const roleMap: Record<string, SidebarRole> = {
    admin: "admin",
    organizer: "organizer",
    attendee: "attendee",
    user: "attendee", // map "user" → attendee
  };

  return roleMap[normalized];
};