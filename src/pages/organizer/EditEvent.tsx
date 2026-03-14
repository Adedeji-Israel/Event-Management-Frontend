import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/AxiosInterceptor";
import EventForm from "@/components/forms/EventForm";
import type { Event } from "@/types/event";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await api.get(`/events/${eventId}`);
      setEvent(res.data.event);
    };

    fetchEvent();
  }, [eventId]);

  if (!event) return <p>Loading event...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <EventForm
        event={event}
        onSuccess={() =>
          navigate("/dashboard/organizer/events")
        }
      />
    </div>
  );
};

export default EditEvent;