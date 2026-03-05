import type { Event } from "@/types/event";
import { useEffect, useMemo, useState } from "react";

interface EventsFilterBarProps {
  events: Event[];
  onFilter: React.Dispatch<React.SetStateAction<Event[]>>;
}

type DateFilter = "All" | "Upcoming" | "Past";

const EventsFilterBar = ({ events, onFilter }: EventsFilterBarProps) => {
  const [dateFilter, setDateFilter] = useState<DateFilter>("All");
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("All Months");

  const months = useMemo(() => {
    const unique = new Set<string>();

    events.forEach((e) => {
      const d = new Date(e.date);
      if (!isNaN(d.getTime())) {
        unique.add(
          `${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`
        );
      }
    });

    return ["All Months", ...Array.from(unique)];
  }, [events]);

  useEffect(() => {
    let filtered = [...events];
    const today = new Date();

    if (dateFilter === "Upcoming") {
      filtered = filtered.filter((e) => new Date(e.date) >= today);
    }

    if (dateFilter === "Past") {
      filtered = filtered.filter((e) => new Date(e.date) < today);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((e) =>
        e.title.toLowerCase().includes(q)
      );
    }

    if (month !== "All Months") {
      filtered = filtered.filter((e) => {
        const d = new Date(e.date);
        return (
          `${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}` ===
          month
        );
      });
    }

    onFilter(filtered);
  }, [events, dateFilter, search, month]);

  const clearAll = () => {
    setDateFilter("All");
    setSearch("");
    setMonth("All Months");
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["All", "Upcoming", "Past"] as DateFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setDateFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              dateFilter === f
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}

        <button
          onClick={clearAll}
          className="ml-auto px-4 py-2 rounded-lg text-sm bg-red-100 text-red-600 hover:bg-red-200 transition"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search events…"
          className="border rounded-lg px-3 py-2 text-sm min-w-[160px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2 text-sm cursor-pointer"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {months.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EventsFilterBar;