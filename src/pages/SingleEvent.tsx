// pages/events/SingleEvent.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/AxiosInterceptor";

const SingleEvent = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    api.get(`/events/${eventId}`).then((res) => setEvent(res.data.event));
  }, [eventId]);

  if (!event) return <p className="p-6">Loading event...</p>;

  return (
    <div className="p-6">
      <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded-xl mb-4" />
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p className="text-gray-500">{event.location}</p>
      <p className="mt-2">{new Date(event.date).toDateString()}</p>
      <p className="mt-4">₦{event.price?.toLocaleString()}</p>
      <p className="mt-4 text-xl text-gray-700 font-semibold">{event.description}</p>
    </div>
  );
};

export default SingleEvent;
