import type { Event } from "@/types/event";
import { useEffect, useState } from "react";
import { Users, UserCheck, CalendarDays, Landmark } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import api from "@/lib/AxiosInterceptor";
import { Link } from "react-router-dom";
import TicketCard from "@/components/events/TicketCard";

interface DashboardStats {
  totalEvents: number;
  liveEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
}

const OrganizerDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    liveEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/events/my-events");
        setEvents(res.data.events);
        setStats(res.data.stats);
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    .filter(e => new Date(e.date) <= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">

      {/* ===== Dashboard Header ===== */}
      <div>
        <p className="text-purple-600 font-semibold text-2xl">
          Monitor your events, ticket sales and revenue
        </p>
      </div>

      {/* ===== Stats ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={<Users size={18} />}
        />

        <StatCard
          title="Live Events"
          value={stats.liveEvents}
          icon={<UserCheck size={18} />}
        />

        <StatCard
          title="Tickets Sold"
          value={stats.totalTicketsSold}
          icon={<CalendarDays size={18} />}
        />

        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          icon={<Landmark size={18} />}
          isCurrency
        />
      </div>

      {/* ===== Quick Actions ===== */}
      <div className="bg-white p-6 rounded-xl border">
        <h2 className="text-lg text-purple-600 font-semibold mb-4">Quick Actions</h2>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/dashboard/organizer/events/create"
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
          >
            + Create Event
          </Link>

          <Link
            to="/dashboard/organizer/events"
            className="bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-lg transition"
          >
            Manage Events
          </Link>
        </div>
      </div>

      {/* ===== Upcoming Events ===== */}
      <div className="bg-white p-6 rounded-xl border">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg text-purple-600 font-semibold">Upcoming Events</h2>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No upcoming events.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {upcomingEvents.map(event => (
              <TicketCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* ===== past Events ===== */}
      <div className="bg-white p-6 rounded-xl border">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg tezt-purple-600 font-semibold">Past Events</h2>
        </div>

        {pastEvents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No past events.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {pastEvents.map(event => (
              <TicketCard key={event._id} event={event} isPast />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;