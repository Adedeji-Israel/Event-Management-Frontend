import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  CalendarDays,
  Landmark,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import api from "@/lib/AxiosInterceptor";
import { Link } from "react-router-dom";

const OrganizerDashboard = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events/my-events");
        setEvents(res.data.events);
      } catch (err: any) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  /* ================== STATS ================== */
  const totalEvents = events.length;
  const liveEvents = events.filter(e => e.status === "live").length;

  const totalTicketsSold = events.reduce(
    (sum, e) => sum + (e.bookingsCount || 0),
    0
  );

  const totalRevenue = events.reduce(
    (sum, e) => sum + (e.revenue || 0),
    0
  );

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8">

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={totalEvents}
          icon={<Users size={18} />}
        />

        <StatCard
          title="Live Events"
          value={liveEvents}
          icon={<UserCheck size={18} />}
        />

        <StatCard
          title="Tickets Sold"
          value={totalTicketsSold}
          icon={<CalendarDays size={18} />}
        />

        <StatCard
          title="Total Revenue"
          value={`₦${totalRevenue.toLocaleString()}`}
          icon={<Landmark size={18} />}
        />
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="bg-white p-6 rounded-xl border">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/dashboard/organizer/events/create"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
          >
            + Create New Event
          </Link>

          <Link
            to="/dashboard/organizer/events"
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
          >
            Manage Events
          </Link>
        </div>
      </div>

      {/* ================= UPCOMING EVENTS ================= */}
      <div className="bg-white p-6 rounded-xl border">
        <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>

        {upcomingEvents.length === 0 ? (
          <p className="text-gray-500">No upcoming events.</p>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.slice(0, 5).map(event => (
              <div
                key={event._id}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm">
                    {event.bookingsCount || 0} tickets
                  </p>
                  <p className="text-sm font-semibold">
                    ₦{(event.revenue || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default OrganizerDashboard;
