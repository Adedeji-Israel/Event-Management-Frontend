import type { Event } from "@/types/event";
import React from "react";

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const clickable = Boolean(onClick);

  const minPrice =
    event.ticketTypes.length > 0
      ? Math.min(...event.ticketTypes.map((t) => t.price))
      : null;

  return (
    <article
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!clickable) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`bg-white rounded-xl shadow p-4 flex flex-col transition ${
        clickable
          ? "cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          : ""
      }`}
    >
      {event.image && (
        <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden mb-3">
          <img
            src={event.image}
            alt={event.title || event._id}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold leading-tight">
          {event.title}
        </h2>

        <p className="text-sm text-gray-500">
          {new Date(event.date).toLocaleDateString()}
        </p>

        {event.location && (
          <p className="text-sm text-gray-500">
            {event.location}
          </p>
        )}

        {minPrice !== null && (
          <p className="text-sm font-medium text-gray-900">
            ₦{minPrice.toLocaleString()}
          </p>
        )}
      </div>
    </article>
  );
};

export default EventCard;