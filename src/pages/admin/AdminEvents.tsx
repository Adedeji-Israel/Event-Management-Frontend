import type { Event } from "@/types/event";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/AxiosInterceptor";
import { useAuth } from "@/hooks/useAuth";

import EventsFilterBar from "@/components/events/EventsFilterBar";
import EventCard from "@/components/events/EventCard";
import EventsRightPanel from "@/components/events/EventsRightPanel";


const AdminEvents = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setLoading(false);
            setError("You must be logged in to view events.");
            return;
        }

        const fetchEvents = async () => {
            try {
                const eventsRes = await api.get("/events");

                setEvents(eventsRes.data.events);
                setFilteredEvents(eventsRes.data.events);
            } catch (err: any) {
                if (err.response?.status === 401) {
                    setError("Session expired. Please log in again.");
                } else if (err.response?.status === 403) {
                    setError("You are not authorized to view this page.");
                } else {
                    setError("Failed to load events.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [authLoading, user]);

    if (loading) {
        return <p className="text-gray-500">Loading events…</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!events.length) {
        return <p className="text-gray-500">No events available.</p>;
    }

    return (
        <>
            <EventsFilterBar
                events={events}
                onFilter={setFilteredEvents}
            />

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-6">
                {/* EVENTS GRID */}
                <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => {
                        return (
                            <EventCard
                                key={event._id}
                                event={event}
                                onClick={() =>
                                    navigate(`/dashboard/events/${event._id}`)
                                }
                            />
                        );
                    })}

                    {events.length === 0 && (
                        <p className="text-gray-500 col-span-full">
                            No events found.
                        </p>
                    )}
                </div>

                {/* RIGHT PANEL */}
                <EventsRightPanel />
            </div>
        </>
    );
};

export default AdminEvents;
