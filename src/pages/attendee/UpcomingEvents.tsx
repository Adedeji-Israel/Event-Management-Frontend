import { useEffect, useState } from "react";
import api from "@/lib/AxiosInterceptor";
import TicketCard from "@/components/events/TicketCard";

interface Ticket {
    _id: string;
    event?: {
        _id: string;
        title: string;
        date: string;
        location?: string;
        image?: string;
    };
    quantity: number;
    amount: number;
    status: string;
}

const UpcomingEvents = () => {
    const [loading, setLoading] = useState(false);
    const [tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const res = await api.get("/tickets/my-tickets");

                setTickets(res.data.tickets || []);
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading) {
        return <p className="text-gray-500">Loading events…</p>;
    }

    const now = new Date();

    // ✅ Only paid & future events
    const upcomingTickets = tickets.filter(
        (t) =>
            t.status === "paid" &&
            t.event &&
            new Date(t.event.date) >= now
    );

    return (
        <div className="bg-white px-6 py-4 rounded-xl border">

            {upcomingTickets.length === 0 ? (
                <p className="text-gray-500">
                    You have no upcoming events.
                </p>
            ) : (
                <div className="space-y-4">
                    {upcomingTickets.map((ticket) => (
                        <TicketCard
                            key={ticket._id}
                            ticket={ticket}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpcomingEvents;
