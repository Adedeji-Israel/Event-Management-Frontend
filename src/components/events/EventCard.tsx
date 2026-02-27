import React from "react";

interface EventCardProps {
  _id: string;
  title: string;
  date: string;
  location?: string;
  price?: string;
  image?: string;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  _id,
  title,
  date,
  location,
  price,
  image,
  onClick,
}) => {
  const clickable = Boolean(onClick);

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
      {image && (
        <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden mb-3">
          <img
            src={image}
            alt={title || _id}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold leading-tight">{title}</h2>

        <p className="text-sm text-gray-500">{date}</p>

        {location && (
          <p className="text-sm text-gray-500">{location}</p>
        )}

        {price && (
          <p className="text-sm font-medium text-gray-900">
            {price}
          </p>
        )}

      </div>
    </article>
  );
};

export default EventCard;
