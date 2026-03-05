import type { Event } from "@/types/event";
import { useState, useEffect } from "react";
import EventCard from "@/components/EventCard"
import api from "@/lib/AxiosInterceptor";


const EventsGrid = ({ showAll = false }) => {

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
        setError(error); 
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
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 card-grid items-stretch">
      {(showAll ? events : events.slice(0, 6)).map((event) => (
        <EventCard key={event._id} {...event} id={event._id} />
      ))}
    </div>
  );
}

export default EventsGrid 
