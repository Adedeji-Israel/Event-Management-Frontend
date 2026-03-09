// layouts/sidebarLinks.ts
import {
  LayoutDashboard,
  Ticket,
  CreditCard,
  Calendar,
  MessageSquare,
  Image,
  Star,
  BarChart3,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  name: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

export type SidebarRole = "admin" | "organizer" | "attendee";

/* ================= ADMIN ================= */
export const adminLinks: NavItem[] = [
  { name: "Dashboard", to: "/dashboard/admin", icon: LayoutDashboard, end: true },
  { name: "Events", to: "/dashboard/admin/events", icon: Ticket },
  { name: "Bookings", to: "/dashboard/admin/bookings", icon: CreditCard },
  { name: "Payments", to: "/dashboard/admin/payments", icon: CreditCard },
  { name: "Calendar", to: "/dashboard/admin/calendar", icon: Calendar },
  { name: "Messages", to: "/dashboard/admin/messages", icon: MessageSquare },
  { name: "Gallery", to: "/dashboard/admin/gallery", icon: Image },
  { name: "Feedback", to: "/dashboard/admin/feedback", icon: Star },
];

/* ================= ORGANIZER ================= */
export const organizerLinks: NavItem[] = [
  { name: "Dashboard", to: "/dashboard/organizer", icon: LayoutDashboard, end: true },
  { name: "My Events", to: "/dashboard/organizer/events", icon: Ticket },
  { name: "Bookings", to: "/dashboard/organizer/bookings", icon: CreditCard },
  { name: "Attendees", to: "/dashboard/organizer/attendees", icon: Users },
  { name: "Analytics", to: "/dashboard/organizer/analytics", icon: BarChart3 },
];

/* ================= ATTENDEE ================= */
export const attendeeLinks: NavItem[] = [
  { name: "Dashboard", to: "/dashboard/attendee", icon: LayoutDashboard, end: true },
  { name: "Browse Events", to: "/dashboard/attendee/events", icon: Ticket, end: true },
  { name: "Upcoming Events", to: "/dashboard/attendee/events/upcoming", icon: Ticket },
  { name: "Past Events", to: "/dashboard/attendee/events/past", icon: Ticket },
  { name: "My Tickets", to: "/dashboard/attendee/my-tickets", icon: CreditCard },
  { name: "Calendar", to: "/dashboard/attendee/calendar", icon: Calendar },
];

/* ================= ROLE MAP ================= */

export const roleLinks: Record<SidebarRole, NavItem[]> = {
  admin: adminLinks,
  organizer: organizerLinks,
  attendee: attendeeLinks,
};