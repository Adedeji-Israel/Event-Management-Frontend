import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/AxiosInterceptor";
import EditEventModal from "@/components/modals/EditEventModal";

const OrganizerEvents = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchEvents = async () => {
        try {
            const res = await api.get("/events/my-events");
            setEvents(res.data.events); // ✅ correct
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this event?")) return;

        try {
            await api.delete(`/events/${id}`);
            setEvents(prev => prev.filter(e => e._id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || "Delete failed");
        }
    };

    if (loading) return <p>Loading events...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Link
                    to="/dashboard/organizer/events/create"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                >
                    Create New Event
                </Link>
            </div>

            {events.length === 0 ? (
                <p className="text-gray-500">No events created yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                        <div
                            key={event._id}
                            className="bg-white p-4 rounded-xl border space-y-3"
                        >
                            <img
                                src={event.image}
                                alt={event.title}
                                className="h-40 w-full object-cover rounded-lg"
                            />

                            <h3 className="font-bold">{event.title}</h3>

                            <p className="text-sm text-gray-500">
                                {new Date(event.date).toDateString()}
                            </p>

                            <span className="text-xs px-2 py-1 rounded bg-gray-100">
                                {event.status}
                            </span>

                            <div className="flex gap-4 pt-3">
                                <button
                                    onClick={() => {
                                        setSelectedEvent(event);
                                        setShowModal(true);
                                    }}
                                    className="text-purple-600 text-sm"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="text-red-500 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <EditEventModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                eventData={selectedEvent}
                onSuccess={(updatedEvent) => {
                    setEvents(prev =>
                        prev.map(e => e._id === updatedEvent._id ? updatedEvent : e)
                    );
                }}
            />

        </div>

    );
};

export default OrganizerEvents;
