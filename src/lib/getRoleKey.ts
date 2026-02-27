export const getRoleKey = (role?: string) => {
  if (!role) return undefined;

  const normalized = role.trim().toLowerCase();

  const roleMap: Record<string, string> = {
    admin: "admin",
    organizer: "organizer",
    attendee: "attendee",
    user: "attendee", // map "user" → attendee
  };

  return roleMap[normalized];
};
