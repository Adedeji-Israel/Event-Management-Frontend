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
  };
  quantity: number;
  amount: number;
  status: string;
}

const PastEvents = () => {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await api.get("/tickets/my-tickets");
        
        setTickets(res.data.tickets || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) return <p>Loading events…</p>;

  const now = new Date();

  const pastTickets = tickets.filter(
    (t) =>
      t.status === "paid" &&
      t.event &&
      new Date(t.event.date) < now
  );

  return (
    <div className="bg-white px-6 py-4 rounded-xl border">

      {pastTickets.length === 0 ? (
        <p className="text-gray-500">No past events yet.</p>
      ) : (
        <div className="space-y-4">
          {pastTickets.map((ticket) => (
            <TicketCard 
              key={ticket._id}
              ticket={ticket}
              isPast
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PastEvents;