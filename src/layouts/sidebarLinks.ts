// layouts/sidebarLinks.ts
import {
  LayoutDashboard,
  CalendarDays,
  CalendarPlus,
  CalendarClock,
  CalendarCheck2,
  Ticket,
  TicketCheck,
  Wallet,
  Compass,
  History,
  Users,
  UserRoundPlus,
  ClipboardCheck,
  Images,
  Star,
  BarChart3,
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
  {
    name: "Dashboard",
    to: "/dashboard/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Events",
    to: "/dashboard/admin/events",
    icon: CalendarDays,
  },
  {
    name: "Bookings",
    to: "/dashboard/admin/bookings",
    icon: TicketCheck,
  },
  {
    name: "Payments",
    to: "/dashboard/admin/payments",
    icon: Wallet,
  },
  {
    name: "Calendar",
    to: "/dashboard/admin/calendar",
    icon: CalendarDays,
  },
  {
    name: "Gallery",
    to: "/dashboard/admin/gallery",
    icon: Images,
  },
  {
    name: "Feedback",
    to: "/dashboard/admin/feedback",
    icon: Star,
  },
   {
    name: "Organizer Requests",
    to: "/dashboard/admin/organizer-requests",
    icon: ClipboardCheck,
  },
];

/* ================= ORGANIZER ================= */
export const organizerLinks: NavItem[] = [
  {
    name: "Dashboard",
    to: "/dashboard/organizer",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "My Events",
    to: "/dashboard/organizer/events",
    icon: CalendarCheck2,
    end: true,
  },
  {
    name: "Create Event",
    to: "/dashboard/organizer/events/create",
    icon: CalendarPlus,
  },
  {
    name: "Bookings",
    to: "/dashboard/organizer/bookings",
    icon: TicketCheck,
  },
  {
    name: "Attendees",
    to: "/dashboard/organizer/attendees",
    icon: Users,
  },
  {
    name: "Analytics",
    to: "/dashboard/organizer/analytics",
    icon: BarChart3,
  },
];

/* ================= ATTENDEE ================= */
export const attendeeLinks: NavItem[] = [
  {
    name: "Dashboard",
    to: "/dashboard/attendee",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Browse Events",
    to: "/dashboard/attendee/events",
    icon: Compass,
    end: true,
  },
  {
    name: "Upcoming Events",
    to: "/dashboard/attendee/events/upcoming",
    icon: CalendarClock,
  },
  {
    name: "Past Events",
    to: "/dashboard/attendee/events/past",
    icon: History,
  },
  {
    name: "My Tickets",
    to: "/dashboard/attendee/my-tickets",
    icon: Ticket,
  },
  {
    name: "Calendar",
    to: "/dashboard/attendee/calendar",
    icon: CalendarDays,
  },
  {
    name: "Become an Organizer",
    to: "/dashboard/attendee/organizer-request",
    icon: UserRoundPlus,
  },
];

/* ================= ROLE MAP ================= */
export const roleLinks: Record<SidebarRole, NavItem[]> = {
  admin: adminLinks,
  organizer: organizerLinks,
  attendee: attendeeLinks,
};
