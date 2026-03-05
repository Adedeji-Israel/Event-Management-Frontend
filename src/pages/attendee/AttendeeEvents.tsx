import type { Event } from "@/types/event";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/AxiosInterceptor";
import EventsFilterBar from "@/components/events/EventsFilterBar";
import { Link } from "react-router-dom";


const AttendeeEvents = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const res = await api.get("/events");
                setEvents(res.data.events);
                setFilteredEvents(res.data.events);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <p className="text-gray-500">Loading events…</p>;
    }

    /* ================= PRICE HELPER ================= */
    const getPriceLabel = (ticketTypes: Event["ticketTypes"] = []) => {
        if (!ticketTypes.length) return "Free";

        const prices = ticketTypes
            .map((t) => Number(t.price))
            .filter((p) => !isNaN(p));

        if (!prices.length) return "Free";

        const lowestPrice = Math.min(...prices);

        return lowestPrice <= 0
            ? "Free"
            : `Starting from ₦${lowestPrice.toLocaleString()}`;
    };

    const now = new Date();
    const isPastEvent = (dateStr: string) => new Date(dateStr).getTime() < now.getTime();

    return (
        <div className="space-y-6">
            <EventsFilterBar events={events} onFilter={setFilteredEvents} />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map((event) => {
                    const past = isPastEvent(event.date);

                    return (
                        <div
                            key={event._id}
                            className={`bg-white rounded-2xl border shadow-sm hover:-translate-y-2 hover:shadow-md transition flex flex-col overflow-hidden ${past ? "opacity-50 pointer-events-none" : ""
                                }`}
                        >
                            {/* Image */}
                            <div className="h-44 w-full overflow-hidden">
                                <img
                                    src={event.image || "/placeholder.jpg"}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-1 p-4">
                                {/* Title */}
                                <h3 className="text-purple-600 font-semibold text-lg line-clamp-2 min-h-[56px]">
                                    <Link to={`/events/${event._id}/checkout`}>
                                        {event.title}
                                    </Link>
                                </h3>

                                {/* Date */}
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(event.date).toDateString()}
                                </p>

                                {/* Location */}
                                <p className="text-sm text-gray-600 mb-2 truncate">
                                    {event.location}
                                </p>

                                {/* Price */}
                                <p className="font-semibold text-purple-600 mb-4">
                                    {getPriceLabel(event.ticketTypes)}
                                </p>

                                {/* Push Button to Bottom */}
                                <div className="mt-auto">
                                    <button
                                        onClick={() => navigate(`/events/${event._id}/checkout`)}
                                        className={`w-full py-2.5 rounded-lg text-white font-medium transition active:scale-95 ${past
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                                            }`}
                                        disabled={past}
                                    >
                                        {past ? "Event Ended" : "Book Ticket"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AttendeeEvents;