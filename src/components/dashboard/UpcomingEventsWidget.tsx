// src/components/dashboard/UpcomingEventsWidget.tsx
import type { Event } from "@/types/event";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
} from "date-fns";

interface Props {
  upcomingEvent: Event | null;
  events?: Event[]; // all events for highlighting calendar days
}

const UpcomingEventsWidget = ({ upcomingEvent, events = [] }: Props) => {
  const today = new Date();

  // Calendar calculations
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const hasEventOnDay = (day: Date) =>
    events.some((event) => isSameDay(new Date(event.date), day));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 flex flex-col gap-6 w-full">
      {/* 🔹 Upcoming Event */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Upcoming Event
        </h2>
        {upcomingEvent ? (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg flex flex-col gap-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(upcomingEvent.date), "EEEE, MMM d, yyyy")}
            </p>
            <h3 className="text-md font-bold text-gray-700 dark:text-gray-200">
              {upcomingEvent.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {upcomingEvent.time}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {upcomingEvent.location}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500">
            No upcoming events.
          </p>
        )}
      </div>

      {/* 🔹 Calendar */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
          {format(today, "MMMM yyyy")}
        </h2>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-sm text-center">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, today);
            const eventDay = hasEventOnDay(day);

            return (
              <div
                key={day.toString()}
                className={`
                  py-1 rounded-full cursor-pointer transition
                  ${!isCurrentMonth ? "text-gray-300 dark:text-gray-600" : ""}
                  ${isToday(day) ? "bg-purple-700 text-white hover:bg-purple-900" : ""} 
                  ${eventDay && !isToday(day) ? "bg-indigo-100 dark:bg-indigo-900/40 font-semibold" : ""}
                  hover:bg-purple-500 hover:text-white dark:hover:bg-indigo-800/40
                `}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
            Today
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-indigo-200 dark:bg-indigo-900/40 inline-block" />
            Event Day
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsWidget;
