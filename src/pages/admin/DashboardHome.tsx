// pages/dashboard/DashboardHome.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import api from "@/lib/AxiosInterceptor";
import { Users, CalendarDays, Ticket, Landmark, UserCheck, } from "lucide-react";
import { isAfter } from "date-fns";

import StatCard from "@/components/dashboard/StatCard";
import UpcomingEventsWidget from "@/components/dashboard/UpcomingEventsWidget";
import RecentActivity from "@/components/dashboard/RecentActivity";
import TicketSalesChart from "@/components/dashboard/charts/TicketSalesChart";
import RevenueChart from "@/components/dashboard/charts/RevenueChart";

interface Event {
  _id: string;
  title: string;
  date: string;
  location?: string;
  price?: number;
  image?: string;
  bookingsCount?: number;
}

interface DashboardStats {
  totalUsers: number;
  totalOrganizers: number;
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
}


const DashboardHome = () => {
  const [ticketRange, setTicketRange] = useState<"monthly" | "weekly">("monthly");
  const [revenueRange, setRevenueRange] = useState<"monthly" | "weekly">("monthly");

  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, eventsRes, ticketsRes] = await Promise.all([
        api.get("/dashboard/admin/overview"),
        api.get("/events"),
        api.get("/tickets"),
      ]);

      setStats(statsRes.data.data);
      setEvents(eventsRes.data.events || []);
      setTickets(ticketsRes.data.tickets || []);

      console.log("stats: ", statsRes.data);

    } catch (err: any) {
      console.error("Dashboard fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const popularEvents = [...events]
    .sort((a, b) => (b.bookingsCount || 0) - (a.bookingsCount || 0))
    .slice(0, 3);

  const today = new Date();

  const futureEvents = events
    .filter((event) => isAfter(new Date(event.date), today))
    .sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  const upcomingEvent = futureEvents.length ? futureEvents[0] : null;

  if (loading) return <p className="p-6">Loading dashboard...</p>;
  if (!stats) return <p className="p-6">No dashboard data available.</p>;

  return (
    <div>
      {/* ===== TOP STAT CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
        <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={16} />} />
        <StatCard title="Organizers" value={stats.totalOrganizers} icon={<UserCheck size={16} />} />
        <StatCard title="Total Events" value={stats.totalEvents} icon={<CalendarDays size={16} />} />
        <StatCard title="Tickets Sold" value={stats.totalTicketsSold} icon={<Ticket size={16} />} />
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          icon={<Landmark size={16} />} isCurrency
        />
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* ================= LEFT CONTENT ================= */}
        <div className="col-span-12 xl:col-span-8 space-y-6">

          {/* ===== CHARTS ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ticket Sales */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border min-w-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Ticket Sales</h3>
                  <p className="text-xs text-gray-500">Last 30 days performance</p>
                </div>
                <select
                  value={ticketRange}
                  onChange={(e) => setTicketRange(e.target.value as any)}
                  className="text-sm border rounded-lg px-2 py-1"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <TicketSalesChart range={ticketRange} />
            </div>

            {/* Revenue */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border min-w-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Revenue</h3>
                  <p className="text-xs text-gray-500">Income overview</p>
                </div>
                <select
                  value={revenueRange}
                  onChange={(e) => setRevenueRange(e.target.value as any)}
                  className="text-sm border rounded-lg px-2 py-1"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <RevenueChart range={revenueRange} />
            </div>
          </div>

          {/* ===== POPULAR EVENTS ===== */}
          <div className="bg-white p-5 rounded-xl shadow-md border">
            <h2 className="text-lg font-semibold mb-4">🔥 Popular Events</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {popularEvents.map((event) => (
                <div
                  key={event._id}
                  onClick={() => navigate(`/dashboard/events/${event._id}`)}
                  className="border rounded-lg p-3 hover:shadow-md transition cursor-pointer"
                >
                  <img
                    src={event.image || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={event.title}
                    className="h-32 w-full object-cover rounded-md mb-2"
                  />
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.location || "Online"}</p>
                  <p className="text-sm text-gray-500">{new Date(event.date).toDateString()}</p>
                  <p className="text-sm font-medium mt-1">{event.bookingsCount || 0} bookings</p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== ALL EVENTS ===== */}
          <div className="bg-white p-5 rounded-xl shadow-md border">
            <h2 className="text-lg font-semibold mb-4">🎫 All Events</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {events.map((event) => (
                <div
                  key={event._id}
                  onClick={() => navigate(`/dashboard/events/${event._id}`)}
                  className="border rounded-lg p-3 hover:shadow-md transition cursor-pointer"
                >
                  <img
                    src={event.image || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={event.title}
                    className="h-32 w-full object-cover rounded-md mb-2"
                  />
                  <h3 className="font-semibold text-sm">{event.title}</h3>
                  <p className="text-xs text-gray-500">{event.location || "Online"}</p>
                  <p className="text-xs text-gray-500">{new Date(event.date).toDateString()}</p>
                  <p className="text-sm font-medium mt-1">
                    ₦{event.price?.toLocaleString() || "Free"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ===== RECENT BOOKINGS ===== */}
          <div className="bg-white p-5 rounded-xl shadow-md border">
            <h2 className="text-lg font-semibold mb-4">🧾 Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Event</th>
                    <th className="p-3">Tickets</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.slice(0, 6).map((ticket) => (
                    <tr key={ticket._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{ticket.user?.name || "Guest"}</td>
                      <td className="p-3">{ticket.event?.title || "Deleted Event"}</td>
                      <td className="p-3">{ticket.ticketCount}</td>
                      <td className="p-3">₦{ticket.totalAmount?.toLocaleString()}</td>
                      <td className="p-3">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <UpcomingEventsWidget
            upcomingEvent={upcomingEvent}
            events={events}
          />
          <RecentActivity events={events} tickets={tickets} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
