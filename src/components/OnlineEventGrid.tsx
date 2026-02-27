import { useState, useEffect } from "react";
import OnlineEventCard from "@/components/OnlineEventCard";
import api from "@/lib/AxiosInterceptor";


const OnlineEventsGrid = ({ showAll = false }) => {

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const eventsRes = await api.get("/events");

        setEvents(eventsRes.data.events);
      } catch (error: any) {
        setError(error.response.data.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading events…</p>;
  }
  if (error) {
    return <p className="text-red-500">Network Error! Connect to the Internet</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {(showAll ? events : events.slice(0, 6)).map((event) => (
        <OnlineEventCard key={event._id} {...event} id={event._id} />
      ))}
    </div>
  );
}

export default OnlineEventsGrid 
