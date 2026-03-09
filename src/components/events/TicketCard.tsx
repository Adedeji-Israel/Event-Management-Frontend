import type { Ticket } from "@/types/ticket";
import type { Event } from "@/types/event";
import { CalendarDays, MapPin } from "lucide-react";

interface TicketCardProps {
  ticket?: Ticket;
  event?: Event;
  isPast?: boolean;
}

const TicketCard = ({ ticket, event, isPast = false }: TicketCardProps) => {
  const eventData = ticket?.event || event;

  if (!eventData) return null;

  const getDaysDifference = (eventDate: string) => {
    const now = new Date();
    const date = new Date(eventDate);
    return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const days = eventData.date ? getDaysDifference(eventData.date) : 0;

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">

      {/* Image */}
      {eventData.image && (
        <img
          src={eventData.image}
          alt={eventData.title}
          className="h-40 w-full object-cover"
        />
      )}

      <div className="p-4 flex flex-col justify-between flex-1 space-y-4">

        {/* Title */}
        <h3 className="font-semibold text-lg">{eventData.title}</h3>

        {/* Date + Location */}
        <div className="text-sm text-gray-500 space-y-2">

          <p className="flex items-center gap-2">
            <CalendarDays size={14} />
            {eventData.date && new Date(eventData.date).toDateString()}
          </p>

          {eventData.location && (
            <p className="flex items-center gap-2">
              <MapPin size={14} />
              {eventData.location}
            </p>
          )}
        </div>

        {/* Countdown */}
        {eventData.date && (
          <span
            className={`w-fit text-xs px-3 py-1 rounded-full ${
              isPast
                ? "bg-gray-200 text-gray-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {isPast
              ? `${Math.abs(days)} days ago`
              : days === 0
              ? "Happening Today"
              : `${days} days remaining`}
          </span>
        )}

        {/* Stats */}
        <div className="flex justify-between pt-3 border-t text-sm">

          <div>
            <p className="text-gray-400">
              {ticket ? "Tickets" : "Bookings"}
            </p>
            <p className="font-semibold">
              {ticket?.totalQuantity ?? event?.bookingsCount ?? 0}
            </p>
          </div>

          <div className="text-right">
            <p className="text-gray-400">Amount</p>
            <p className="font-semibold">
              ₦{(ticket?.amount ?? event?.revenue ?? 0).toLocaleString()}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TicketCard;