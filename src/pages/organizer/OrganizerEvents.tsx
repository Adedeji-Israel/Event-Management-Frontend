import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/AxiosInterceptor";
import EditEventModal from "@/components/modals/EditEventModal";
import { Eye, Pencil, Trash2, CalendarDays, MapPin } from "lucide-react";
import type { Event } from "@/types/event";

const OrganizerEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  /* ================= FETCH EVENTS ================= */
  const fetchEvents = async () => {
    try {
      const res = await api.get("/events/my-events");
      setEvents(res.data.events || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* ================= DELETE EVENT ================= */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      setDeleting(id);
      await api.delete(`/events/${id}/delete`);

      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  /* ================= LOADING ================= */
  if (loading)
    return (
      <div className="flex justify-center py-20">
        <p className="text-gray-500">Loading your events...</p>
      </div>
    );

  /* ================= ERROR ================= */
  if (error)
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-600">All Events</h1>

        <Link
          to="/dashboard/organizer/events/create"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + Create New Event
        </Link>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {events.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg">
            You haven't created any events yet.
          </p>

          <Link
            to="/dashboard/organizer/events/create"
            className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
          >
            Create Your First Event
          </Link>
        </div>
      ) : (
        /* ================= EVENTS GRID ================= */
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              {/* ================= IMAGE ================= */}
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-48 w-full object-cover"
                />

                <span
                  className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full capitalize ${
                    event.status === "live"
                      ? "bg-green-100 text-green-600"
                      : event.status === "draft"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {event.status}
                </span>
              </div>

              {/* ================= CONTENT ================= */}
              <div className="p-4 flex flex-col justify-between flex-1 space-y-4">
                {/* Title */}
                <h3 className="font-semibold text-lg line-clamp-2">
                  {event.title}
                </h3>

                {/* Event Info */}
                <div className="text-sm text-gray-500 space-y-2">
                  <p className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    {event.date
                      ? new Date(event.date).toDateString()
                      : "Date not set"}
                  </p>

                  <p className="flex items-center gap-2">
                    <MapPin size={16} />
                    {event.location || "Location not set"}
                  </p>
                </div>

                {/* ================= STATS ================= */}
                <div className="flex justify-between text-sm pt-3 border-t">
                  <div>
                    <p className="text-gray-400">Tickets Sold</p>
                    <p className="font-semibold">
                      {event.bookingsCount ?? 0}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-400">Revenue</p>
                    <p className="font-semibold">
                      ₦{(event.revenue ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* ================= ACTION BUTTONS ================= */}
                <div className="flex gap-2 pt-3 border-t">
                  {/* VIEW */}
                  <Link to={`/events/${event._id}`} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-lg transition">
                      <Eye size={16} />
                      View
                    </button>
                  </Link>

                  {/* EDIT */}
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 text-sm bg-purple-50 text-purple-600 hover:bg-purple-100 py-2 rounded-lg transition"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(event._id)}
                    disabled={deleting === event._id}
                    className="flex-1 flex items-center justify-center gap-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                    {deleting === event._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      <EditEventModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        eventData={selectedEvent}
        onSuccess={(updatedEvent: Event) => {
          setEvents((prev) =>
            prev.map((event) =>
              event._id === updatedEvent._id ? updatedEvent : event
            )
          );
        }}
      />
    </div>
  );
};

export default OrganizerEvents;