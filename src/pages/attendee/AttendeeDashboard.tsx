import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/AxiosInterceptor";
import StatCard from "@/components/dashboard/StatCard";
import TicketCard from "@/components/events/TicketCard";
import {
  CalendarDays,
  Clock,
  CreditCard,
} from "lucide-react";

interface TicketBooking {
  _id: string;
  event?: {
    _id: string;
    title: string;
    date: string;
    price?: number;
  };
  quantity: number;
  amount: number;
}

const AttendeeDashboard = () => {

  const [bookings, setBookings] = useState<TicketBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH USER TICKETS ================= */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/tickets/my-tickets");

        const tickets = res.data?.tickets || [];

        setBookings(tickets);
      } catch (err: any) {
        console.error("Dashboard error:", err?.response?.data || err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  /* ================== STATS ================== */

  const now = new Date();

  const pastBookings = bookings.filter(
    (b) =>
      b.event &&
      new Date(b.event.date) <= now
  );

  const upcomingBookings = bookings.filter(
    (b) =>
      b.event &&
      new Date(b.event.date) >= now
  );

  const totalSpent = bookings.reduce((sum, b) => {
    return sum + (Number(b.amount) || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* ================= WELCOME ================= */}
      <div>
        <p className="text-purple-600 text-xl font-semibold">
          Here's an overview of your tickets and events.
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          icon={<CalendarDays size={18} />}
        />

        <StatCard
          title="Past Events"
          value={pastBookings.length}
          icon={<Clock size={18} />}
        />

        <StatCard
          title="Upcoming Events"
          value={upcomingBookings.length}
          icon={<Clock size={18} />}
        />

        <StatCard
          title="Total Spent"
          value={totalSpent}
          icon={<CreditCard size={18} />} isCurrency
        />
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-xl text-purple-600 font-bold mb-4">
          Quick Actions
        </h3>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/dashboard/attendee/events"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
          >
            Browse Events
          </Link>

          <Link
            to="/dashboard/attendee/events/upcoming"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
          >
            View Upcoming
          </Link>

          <Link
            to="/dashboard/attendee/events/past"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
          >
            View Past Events
          </Link>
        </div>
      </div>

      {/* ================= PAST EVENTS ================= */}
      <div className="bg-white px-6 py-4 rounded-xl border">
        <h2 className="text-xl text-purple-600 font-bold mb-6">
          Past Events
        </h2>

        {pastBookings.length === 0 ? (
          <p className="text-gray-500">
            You have no past events.
          </p>
        ) : (
          <div className="space-y-4">
            {pastBookings.map((booking) => (
              <TicketCard
                key={booking._id}
                ticket={booking}
                isPast
              />
            ))}
          </div>
        )}
      </div>

      {/* ================= UPCOMING EVENTS ================= */}
      <div className="bg-white px-6 py-4 rounded-xl border">
        <h2 className="text-xl text-purple-600 font-bold mb-6">
          Upcoming Events
        </h2>

        {upcomingBookings.length === 0 ? (
          <p className="text-gray-500">
            You have no upcoming events.
          </p>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <TicketCard
                key={booking._id}
                ticket={booking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendeeDashboard;
