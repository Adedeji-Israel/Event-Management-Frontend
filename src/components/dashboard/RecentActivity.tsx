// src/components/dashboard/RecentActivity.tsx
import { CalendarCheck, Ticket, Users } from "lucide-react";

interface Activity {
  id: string;
  type: "event" | "ticket" | "user";
  message: string;
  time: string;
}

interface Props {
  events: any[];
  tickets: any[];
  users?: any[];
}

const iconMap = {
  event: <CalendarCheck size={18} className="text-indigo-600" />,
  ticket: <Ticket size={18} className="text-green-600" />,
  user: <Users size={18} className="text-blue-600" />,
};

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const RecentActivity = ({ events = [] }: Props) => {
  const activities: Activity[] = [
    ...events.slice(0, 3).map((event) => ({
      id: `event-${event._id}`,
      type: "event" as const,
      message: `Event "${event.title}" was created`,
      time: timeAgo(event.createdAt || event.date),
    })),
  ].slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
        Recent Activity
      </h2>

      <div className="flex flex-col gap-2">
        {activities.length === 0 && (
          <p className="text-sm text-gray-400">No recent activity</p>
        )}

        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40 transition cursor-pointer"
          >
            <div className="mt-1">{iconMap[activity.type]}</div>

            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-snug">
                {activity.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
